from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from passlib.context import CryptContext

from dependencies import ALGORITHM, SECRET_KEY, db_dependency
from models import User
from schemas import ForgotPassword, RefreshTokenRequest, UserCreate, UserResponse

# =====================================
# Router Configuration
# =====================================

router = APIRouter(prefix="/auth", tags=["Authentication"])

# =====================================
# JWT Configuration
# =====================================

ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
# A separate key prevents a refresh token from being used as an access token.
REFRESH_SECRET_KEY = SECRET_KEY + "-refresh"

# =====================================
# Password Hash Configuration
# =====================================

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =====================================
# Create JWT Token
# =====================================


def create_access_token(data: dict):
    token_data = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    token_data.update({"exp": expire})

    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return token


def create_refresh_token(user: User):
    token_data = {
        "id": user.id,
        "username": user.username,
        "exp": datetime.now(timezone.utc)
        + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    }
    return jwt.encode(token_data, REFRESH_SECRET_KEY, algorithm=ALGORITHM)


# =====================================
# Create User
# =====================================


@router.post("/create_user", response_model=UserResponse)
def create_user(user_data: UserCreate, db: db_dependency):
    # Check username
    existing_username = (
        db.query(User).filter(User.username == user_data.username).first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400, detail="Username already exists"
        )

    # Check email
    existing_email = (
        db.query(User).filter(User.email == user_data.email).first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400, detail="Email already exists"
        )

    if db.query(User).filter(User.phone == user_data.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already exists")
    if len(user_data.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password must be at most 72 bytes.")

    # Hash password
    hashed_password = bcrypt_context.hash(user_data.password)

    new_user = User(
        firstname=user_data.firstname,
        lastname=user_data.lastname,
        username=user_data.username,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hashed_password,
        postal_code=user_data.postal_code,
        role="user",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return jsonable_encoder(new_user)


# =====================================
# Login
# =====================================


@router.post("/login")
def login(
    db: db_dependency,
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = (
        db.query(User)
        .filter(User.username == form_data.username)
        .first()
    )

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=401, detail="Invalid username or password"
        )

    password_match = bcrypt_context.verify(
        form_data.password, user.password_hash
    )

    if not password_match:
        raise HTTPException(
            status_code=401, detail="Invalid username or password"
        )

    token = create_access_token(
        {"id": user.id, "username": user.username, "role": user.role}
    )

    return {
        "access_token": token,
        "refresh_token": create_refresh_token(user),
        "token_type": "bearer",
    }


@router.post("/refresh")
def refresh_access_token(data: RefreshTokenRequest, db: db_dependency):
    try:
        payload = jwt.decode(
            data.refresh_token,
            REFRESH_SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        user_id = payload.get("id")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token.")

    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token.")

    return {
        "access_token": create_access_token(
            {"id": user.id, "username": user.username, "role": user.role}
        ),
        "refresh_token": create_refresh_token(user),
        "token_type": "bearer",
    }


@router.post("/forgot-password")
def forgot_password(data: ForgotPassword, db: db_dependency):
    if len(data.new_password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400, detail="Password must be at most 72 bytes."
        )

    user = (
        db.query(User)
        .filter(
            User.username == data.username,
            User.email == data.email,
            User.phone == data.phone,
            User.is_active.is_(True),
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=400, detail="Account details do not match."
        )

    user.password_hash = bcrypt_context.hash(data.new_password)
    db.commit()

    return {"message": "Password reset successfully. You can now log in."}