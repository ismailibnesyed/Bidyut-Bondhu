from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from database import get_db
from models import User

# =====================================
# JWT Configuration
# =====================================

SECRET_KEY = "873c4771e6c6c2b4185ea3fa537f754a4aee0e207e9eff3cbe7c360d3114a9e7"
ALGORITHM = "HS256"

# =====================================
# OAuth2 Configuration
# =====================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# =====================================
# Database Dependency
# =====================================

db_dependency = Annotated[Session, Depends(get_db)]

# =====================================
# Get Current User
# =====================================


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication token",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()

    if user is None or not user.is_active:
        raise credentials_exception

    return user


# =====================================
# Current User Dependency
# =====================================

user_dependency = Annotated[User, Depends(get_current_user)]

# =====================================
# Role Checking
# =====================================


def require_role(required_role: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=403, detail="Permission denied"
            )

        return current_user

    return role_checker


# =====================================
# Role Dependencies
# =====================================

admin_dependency = Annotated[User, Depends(require_role("admin"))]

technician_dependency = Annotated[
    User, Depends(require_role("technician"))
]

user_role_dependency = Annotated[User, Depends(require_role("user"))]