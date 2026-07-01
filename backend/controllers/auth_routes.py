from fastapi import APIRouter
from pydantic import BaseModel

router_auth = APIRouter(
    prefix='/auth',
    tags=['Autenticação']
)


class Login(BaseModel):
    email: str
    senha: str


@router_auth.post('/login')
def login(usuario: Login):
    return {
        'token': '123456',
        'usuario': usuario.email
    }
