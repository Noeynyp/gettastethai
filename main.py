# main.py

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

from schemas import SignUpRequest, LoginRequest, UserOut

# Load environment variables
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

# Serve frontend
app.mount("/", StaticFiles(directory="dist", html=True), name="static")
