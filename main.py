from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db, engine
from models import Base, User, init_db
from passlib.context import CryptContext
import os
Base.metadata.create_all(bind=engine)
init_db()

app = FastAPI()

# Enable password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SignUpRequest(BaseModel):
    restaurant_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    identifier: str  # email or restaurant name
    password: str

# Hashing
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

@app.post("/api/signup")
def signup(req: SignUpRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists.")
    user = User(
        restaurant_name=req.restaurant_name,
        email=req.email,
        password=hash_password(req.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"success": True, "message": "Account created successfully."}

@app.post("/api/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter((User.email == req.identifier) | (User.restaurant_name == req.identifier))
        .first()
    )
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    return {
        "success": True,
        "user": {
            "restaurant_name": user.restaurant_name,
            "email": user.email
        }
    }

# Mount Vite build
app.mount("/", StaticFiles(directory="dist", html=True), name="static")
