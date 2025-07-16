# main.py

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Body
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from fastapi.responses import Response
import stripe
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import uuid
from schemas import SignUpRequest, LoginRequest, UserOut, ProfileUpdate, SubscriptionRequest
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets

from starlette.staticfiles import StaticFiles



# Load environment variables.
load_dotenv()

app = FastAPI()

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["getauthenticdb"]
users_collection = db["users"]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "verification_token": verification_token
    }
    await users_collection.insert_one(user_data)

    # Send verification email
    sender_email = "getauthenticthai@gmail.com"
    receiver_email = req.email
    password = os.getenv("EMAIL_APP_PASSWORD")  # Use app password for Gmail
    verification_link = f"https://getauthenticthai-dkfhdbg5f3amd7fu.southeastasia-01.azurewebsites.net/api/verify-email?token={verification_token}&email={req.email}"


    message = MIMEMultipart("alternative")
    message["Subject"] = "Verify your email for GET Authentic Thai"
    message["From"] = sender_email
    message["To"] = receiver_email
    text = f"Please verify your email by clicking the following link: {verification_link}"
    html = f"<p>Please verify your email by clicking the following link:</p><a href='{verification_link}'>Verify Email</a>"
    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
    except Exception as e:
        print(f"Failed to send verification email: {e}")
        # Optionally, delete the user if email fails
        await users_collection.delete_one({"email": req.email})
        raise HTTPException(status_code=500, detail="Failed to send verification email.")

    return {"success": True, "message": "Account created. Please verify your email."}

@app.get("/api/verify-email")
async def verify_email(token: str, email: str):
    user = await users_collection.find_one({"email": email, "verification_token": token})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification link.")
    await users_collection.update_one({"email": email}, {"$set": {"is_verified": True}, "$unset": {"verification_token": ""}})
    return RedirectResponse(url="https://getauthenticthai-dkfhdbg5f3amd7fu.southeastasia-01.azurewebsites.net/email-verified")

# Update login to check is_verified
@app.post("/api/login", response_model=UserOut)
async def login(req: LoginRequest):
    user = await users_collection.find_one({
        "$or": [
            {"email": req.identifier},
            {"restaurant_name": req.identifier}
        ]
    })
    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    if not user.get("is_verified"):
        raise HTTPException(status_code=403, detail="Email not verified. Please check your inbox.")

    # Determine if profile is completed
    required_fields = ["owner_name", "location", "business_type", "current_position"]
    profile_completed = all(user.get(field) for field in required_fields)

    return {
        "restaurant_name": user["restaurant_name"],
        "email": user["email"],
        "profile_completed": profile_completed
    }



from schemas import ProfileUpdate

@app.post("/api/profile-update")
async def profile_update(req: ProfileUpdate):
    user = await users_collection.find_one({"email": req.contact_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await users_collection.update_one(
        {"email": req.contact_email},
        {"$set": req.dict()}
    )

    return {"success": True, "message": "Profile updated"}

# Serve uploaded images as static files
app.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")

@app.post("/api/upload-result")
async def upload_result(
    file: UploadFile = File(...),
    email: str = Form(...),
    scores: str = Form(...),
    categories: str = Form(...),
    profile_type: str = Form(...)
):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    filename = f"{uuid.uuid4()}.png"
    filepath = os.path.join("uploaded_images", filename)

    with open(filepath, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    image_url = f"/uploaded_images/{filename}"

    # Save score + result
    await users_collection.update_one(
        {"email": email},
        {"$set": {
            "quiz_result": {
                "scores": eval(scores),  # List of numbers
                "categories": eval(categories),
                "profile_type": profile_type,
                "result_image_url": image_url
            }
        }}
    )

    return JSONResponse(content={"success": True, "url": image_url})

    

# @app.post("/api/upload-result-image")
# async def upload_result_image(
#     file: UploadFile = File(...),
#     email: str = Form(...)
# ):
#     user = await users_collection.find_one({"email": email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     # Save image with unique filename
#     filename = f"{uuid.uuid4()}.png"
#     filepath = os.path.join("uploaded_images", filename)

#     with open(filepath, "wb") as buffer:
#         content = await file.read()
#         buffer.write(content)

#     image_url = f"/uploaded_images/{filename}"

#     # Update user's record
#     await users_collection.update_one(
#         {"email": email},
#         {"$set": {"result_image_url": image_url}}
#     )

#     return JSONResponse(content={"success": True, "url": image_url}).

@app.get("/api/quiz-result")
async def get_quiz_result(email: str):
    user = await users_collection.find_one({"email": email})
    if not user or "quiz_result" not in user:
        return JSONResponse(content={"exists": False})
    
    return {
        "exists": True,
        "scores": user["quiz_result"]["scores"],
        "categories": user["quiz_result"]["categories"],
        "profile_type": user["quiz_result"]["profile_type"]
    }


@app.get("/api/subscription-status")
async def check_subscription(email: str):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"subscribed": user.get("subscribed", False)}


@app.post("/api/subscribe")
async def subscribe_user(data: SubscriptionRequest):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await users_collection.update_one(
        {"email": data.email},
        {"$set": {"subscribed": True}}
    )

    return {"success": True, "message": "Subscription activated"}



@app.post("/webhook", include_in_schema=False)
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET")
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return Response(status_code=400)

    # ✅ Handle successful subscription checkout
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_id = session["customer"]

        await users_collection.update_one(
            {"stripe_customer_id": customer_id},
            {"$set": {
                "subscribed": True,
                "subscription_type": "monthly"  # or 'yearly', you can enhance later
            }}
        )

    return Response(status_code=200)


@app.post("/api/create-checkout-session")
async def create_checkout_session(data: SubscriptionRequest):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create Stripe customer if not already
    if not user.get("stripe_customer_id"):
        customer = stripe.Customer.create(email=data.email)
        await users_collection.update_one(
            {"email": data.email},
            {"$set": {"stripe_customer_id": customer.id}}
        )
    else:
        customer = stripe.Customer.retrieve(user["stripe_customer_id"])

    # Define your real price IDs from Stripe dashboard
    price_id = {
        "monthly": "price_1RlYI4GarNGWe9gLUr0dc7QH",  # replace with actual Stripe price ID
        "yearly": "price_1RlYKBGarNGWe9gLYjdarYLt"
    }.get(data.plan)

    if not price_id:
        raise HTTPException(status_code=400, detail="Invalid plan")

    session = stripe.checkout.Session.create(
        customer=customer.id,
        payment_method_types=["card"],
        line_items=[{
            "price": price_id,
            "quantity": 1,
        }],
        mode="subscription",
        success_url=f"{os.getenv('FRONTEND_URL')}/result",
        cancel_url=f"{os.getenv('FRONTEND_URL')}/result",
    )

    return {"checkout_url": session.url}


# Serve frontend
app.mount("/", StaticFiles(directory="dist", html=True), name="static")


from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import FileResponse
from starlette.requests import Request
import os

class SPAFallbackMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Only fallback if it's a 404 and NOT an API or static file request
        if response.status_code == 404 and not request.url.path.startswith("/api") and "." not in request.url.path:
            index_path = os.path.join("dist", "index.html")
            if os.path.exists(index_path):
                return FileResponse(index_path)
        
        return response

app.add_middleware(SPAFallbackMiddleware)
