from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse, RedirectResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import uuid
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from schemas import SignUpRequest, LoginRequest, UserOut, ProfileUpdate
from openai import OpenAI
import base64


# Load environment variables
load_dotenv()

app = FastAPI()

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["getauthenticdb"]
users_collection = db["users"]
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/signup")
async def signup(req: SignUpRequest):
    existing = await users_collection.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists.")
    verification_token = secrets.token_urlsafe(32)
    user_data = {
        "restaurant_name": req.restaurant_name,
        "email": req.email,
        "password": hash_password(req.password),
        "is_verified": False,
        "verification_token": verification_token,
        "chat_history": []  # initialize history
    }
    await users_collection.insert_one(user_data)

    # Send verification email
    sender_email = "getauthenticthai@gmail.com"
    receiver_email = req.email
    password = os.getenv("EMAIL_APP_PASSWORD")
    verification_link = f"https://getauthenticthai-dkfhdbg5f3amd7fu.southeastasia-01.azurewebsites.net/api/verify-email?token={verification_token}&email={req.email}"
    message = MIMEMultipart("alternative")
    message["Subject"] = "Verify your email for GET Authentic Thai"
    message["From"] = sender_email
    message["To"] = receiver_email
    message.attach(MIMEText(f"Please verify your email: {verification_link}", "plain"))
    message.attach(MIMEText(f"<a href='{verification_link}'>Verify Email</a>", "html"))
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
    except:
        await users_collection.delete_one({"email": req.email})
        raise HTTPException(status_code=500, detail="Failed to send verification email.")
    return {"success": True, "message": "Account created. Please verify your email."}

@app.get("/api/verify-email")
async def verify_email(token: str, email: str):
    user = await users_collection.find_one({"email": email, "verification_token": token})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification link.")
    await users_collection.update_one(
        {"email": email},
        {"$set": {"is_verified": True}, "$unset": {"verification_token": ""}}
    )
    return RedirectResponse(url="https://getauthenticthai-dkfhdbg5f3amd7fu.southeastasia-01.azurewebsites.net/email-verified")

@app.post("/api/login", response_model=UserOut)
async def login(req: LoginRequest):
    user = await users_collection.find_one({"$or": [{"email": req.identifier}, {"restaurant_name": req.identifier}]})
    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    if not user.get("is_verified"):
        raise HTTPException(status_code=403, detail="Email not verified.")
    required_fields = ["owner_name", "location", "business_type", "current_position"]
    profile_completed = all(user.get(field) for field in required_fields)
    return {"restaurant_name": user["restaurant_name"], "email": user["email"], "profile_completed": profile_completed}

@app.post("/api/profile-update")
async def profile_update(req: ProfileUpdate):
    user = await users_collection.find_one({"email": req.contact_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await users_collection.update_one({"email": req.contact_email}, {"$set": req.dict()})
    return {"success": True, "message": "Profile updated"}

@app.post("/api/upload-result-image")
async def upload_result_image(file: UploadFile = File(...), email: str = Form(...)):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    filename = f"{uuid.uuid4()}.png"
    filepath = os.path.join("uploaded_images", filename)
    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())
    await users_collection.update_one({"email": email}, {"$set": {"result_image_url": f"/uploaded_images/{filename}"}})
    return JSONResponse(content={"success": True, "url": f"/uploaded_images/{filename}"})


@app.post("/api/ask-ai")
async def ask_ai(
    email: str = Form(...),
    profile_type: str = Form(...),
    question: str = Form(...),
    files: Optional[List[UploadFile]] = File(None)
):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    guidelines_map = {
        "Leisure Traveler": {
            "must_have": [
                "Use fresh Thai herbs and vegetables",
                "Menu design using Thai language and Thai-style fonts",
                "Staff interaction offering dish recommendations and sharing Thai culinary culture",
                "Welcome guests with a traditional Thai greeting"
            ],
            "nice_to_have": [
                "Showcase Thai chefs preparing Thai dishes",
                "Demonstrate traditional Thai methods like mortar and pestle or clay pot"
            ]
        },
        "Food-Driven Traveler": {
            "must_have": [
                "Use traditional Thai ingredients such as fish sauce, shrimp paste and galangal",
                "Storytelling on the menu about the origin and cultural background of dishes",
                "Staff interaction offering dish recommendations and sharing Thai culinary culture",
                "Thai-style exterior with carved wood, bamboo, or traditional signage"
            ],
            "nice_to_have": [
                "Cultural storytelling via placemats or QR codes",
                "Open kitchen or chef’s counter to showcase cooking techniques"
            ]
        },
        "Cultural Food Traveler": {
            "must_have": [
                "Use authentic Thai ingredients sourced from Thailand",
                "Traditional dish presentation e.g. banana leaves",
                "Menu design using Thai language and Thai-style fonts",
                "Staff interaction offering dish recommendations and sharing Thai culinary culture",
                "Showcase Thai chefs preparing Thai dishes"
            ],
            "nice_to_have": [
                "Thai traditional music or calming ambient soundscapes",
                "Cultural activities like Thai dessert wrapping"
            ]
        }
    }

    profile = guidelines_map.get(profile_type)
    if not profile:
        raise HTTPException(status_code=400, detail="Invalid profile type.")

    # Convert images to base64
    base64_images = []
    if files:
        for file in files:
            content = await file.read()
            base64_str = base64.b64encode(content).decode("utf-8")
            base64_images.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_str}"}
            })

    # Prepare system and user messages
    system_prompt = {
        "role": "system",
        "content": (
            "You are a friendly assistant helping Thai restaurant owners improve their presentation and customer experience. "
            "Respond in a warm, simple, and encouraging tone. Use the user's profile type and guidelines to shape your answer. "
            "Limit to 2–3 clear suggestions. If an image is included, assume it's their current dish. Use markdown formatting."
        )
    }

    # Profile context
    guideline_context = f"""
My restaurant profile is: {profile_type}

Must Have:
{chr(10).join('- ' + item for item in profile["must_have"])}

Nice to Have:
{chr(10).join('- ' + item for item in profile["nice_to_have"])}

{question}
"""

    # Restore previous chat history
    history = user.get("chat_history", [])
    messages = [system_prompt] + history

    # Add new user message
    messages.append({
        "role": "user",
        "content": [{"type": "text", "text": guideline_context}] + base64_images
    })

    try:
        res = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=300
        )
        reply = res.choices[0].message

        # Save new history (with latest response)
        updated_history = messages + [reply.model_dump()]
        await users_collection.update_one(
            {"email": email},
            {"$set": {"chat_history": updated_history}}
        )

        return PlainTextResponse(reply.content.strip())
    except Exception as e:
        print("OpenAI Error:", e)
        raise HTTPException(status_code=500, detail="AI suggestion failed.")