from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from database import get_db

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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id:int = payload.get("id")
        username:str = payload.get("username")
        role:str = payload.get("role")
        if user_id is None or username is None:
            raise HTTPException(status_code=404, detail="User not found.")
        return {
            'username' : username,
            'id' : user_id,
            'role':role,
            'email':payload.get('email'),
            'firstname' : payload.get('firstname'),
            'lastname': payload.get('lastname')
        }

    except JWTError as e:
        raise HTTPException(status_code=401, detail='Invalid Token.')



# =====================================
# Current User Dependency
# =====================================

user_dependency = Annotated[dict, Depends(get_current_user)]