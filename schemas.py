from pydantic import BaseModel, EmailStr
from typing import Optional

class SignUpRequest(BaseModel):
    restaurant_name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    identifier: str
    
    password: str

class UserOut(BaseModel):
    restaurant_name: str
    email: EmailStr
    profile_completed: bool

class ProfileUpdate(BaseModel):
    owner_name: str
    location: str
    business_type: str
    current_position: str

    phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
