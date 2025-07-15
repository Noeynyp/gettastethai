# main.py

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import uuid

from schemas import SignUpRequest, LoginRequest, UserOut

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

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/signup")
async def signup(req: SignUpRequest):
    existing = await users_collection.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists.")

    user_data = {
        "restaurant_name": req.restaurant_name,
        "email": req.email,
        "password": hash_password(req.password)
    }
    await users_collection.insert_one(user_data)
    return {"success": True, "message": "Account created successfully."}

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

    return {
        "restaurant_name": user["restaurant_name"],
        "email": user["email"]
    }

# Serve uploaded images as static files
app.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")

@app.post("/api/upload-result-image")
async def upload_result_image(
    file: UploadFile = File(...),
    email: str = Form(...)
):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save image with unique filename
    filename = f"{uuid.uuid4()}.png"
    filepath = os.path.join("uploaded_images", filename)

    with open(filepath, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    image_url = f"/uploaded_images/{filename}"

    # Update user's record
    await users_collection.update_one(
        {"email": email},
        {"$set": {"result_image_url": image_url}}
    )

    return JSONResponse(content={"success": True, "url": image_url})

# Serve frontend
app.mount("/", StaticFiles(directory="dist", html=True), name="static")
