from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

# =====================================
# User Schema
# =====================================


# User registration
class UserCreate(BaseModel):
    firstname: str = Field(min_length=1)
    lastname: str = Field(min_length=1)
    username: str = Field(min_length=1)
    email: str = Field(min_length=1)
    phone: str = Field(min_length=1)
    password: str = Field(min_length=6)
    postal_code: Optional[str] = None


# Admin creates technician/admin
class StaffCreate(BaseModel):
    firstname: str = Field(min_length=1)
    lastname: str = Field(min_length=1)
    username: str = Field(min_length=1)
    email: str = Field(min_length=1)
    phone: str = Field(min_length=1)
    password: str = Field(min_length=6)
    role: Literal["admin", "technician"]
    postal_code: Optional[str] = None


# Update profile
class UserUpdate(BaseModel):
    firstname: Optional[str] = Field(default=None, min_length=1)
    lastname: Optional[str] = Field(default=None, min_length=1)
    username: Optional[str] = Field(default=None, min_length=1)
    email: Optional[str] = Field(default=None, min_length=1)
    phone: Optional[str] = Field(default=None, min_length=1)
    postal_code: Optional[str] = Field(default=None, min_length=1)


class UserResponse(BaseModel):
    id: int
    firstname: str
    lastname: str
    username: str
    email: str
    phone: str
    role: str
    postal_code: Optional[str]
    is_active: bool
    created_at: datetime


# Change password
class PasswordUpdate(BaseModel):
    old_password: str = Field(min_length=6)
    new_password: str = Field(min_length=6)


class ForgotPassword(BaseModel):
    username: str = Field(min_length=1)
    email: str = Field(min_length=1)
    phone: str = Field(min_length=1)
    new_password: str = Field(min_length=6)


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=1)


# =====================================
# Area Schema
# =====================================


class AreaCreate(BaseModel):
    area_name: str = Field(min_length=1)
    district: str = Field(min_length=1)
    postal_code: str = Field(min_length=1)

class AreaUpdate(BaseModel):
    area_name: Optional[str] = Field(default=None, min_length=1)
    district: Optional[str] = Field(default=None, min_length=1)
    postal_code: Optional[str] = Field(default=None, min_length=1)

# =====================================
# Load Shedding Schema
# =====================================

class LoadSheddingCreate(BaseModel):
    postal_code: str = Field(min_length=1)
    start_time: datetime
    end_time: datetime
    reason: Optional[str] = None
    status: Optional[
        Literal["Scheduled", "Running", "Completed", "Cancelled"]
    ] = "Scheduled"


class LoadSheddingUpdate(BaseModel):
    postal_code: Optional[str] = Field(default=None, min_length=1)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    reason: Optional[str] = None
    status: Optional[
        Literal["Scheduled", "Running", "Completed", "Cancelled"]
    ] = None


# =====================================
# Complaint Schema
# =====================================


# User creates complaint
class ComplaintCreate(BaseModel):
    postal_code: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)


# Admin assigns technician
class ComplaintAssign(BaseModel):
    assigned_to: int = Field(gt=0)


# Technician updates status
class ComplaintStatusUpdate(BaseModel):
    status: Literal["Pending", "Assigned", "Processing", "Solved"]


# =====================================
# Outage History Schema
# =====================================


class OutageHistoryCreate(BaseModel):
    postal_code: str = Field(min_length=1)
    start_time: datetime
    end_time: Optional[datetime] = None
    reason: Optional[str] = None


class OutageHistoryUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    reason: Optional[str] = None