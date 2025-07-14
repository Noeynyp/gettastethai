# schemas.py

from pydantic import BaseModel, EmailStr

class SignUpRequest(BaseModel):
    restaurant_name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    identifier: str  # can be email or restaurant_name.
    password: str

class UserOut(BaseModel):
    restaurant_name: str
    email: EmailStr
