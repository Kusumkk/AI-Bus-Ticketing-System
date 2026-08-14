from pydantic import BaseModel, EmailStr
from typing import Literal


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["ADMIN", "CUSTOMER"] = "CUSTOMER"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str