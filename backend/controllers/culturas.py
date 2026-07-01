from fastapi import APIRouter
from models.model import Cultura
from db import conectar

router_culturas = APIRouter(
    prefix="/culturas",
    tags=["Cultura"]
)

# cadastrar
@router_culturas.post('/')  
def cadastrar_cultura(cultura: Cultura):
    conn = conectar()
    cursor = conn.cursor()

    sql = """
    INSERT INTO Cultura
    (nome, safra)
    VALUES (%s, %s)
    """

    valores = (
        cultura.nome,
        cultura.safra
    )

    cursor.execute(sql, valores)

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Cultura cadastrada"}
    

# listar
@router_culturas.get('/')  
def listar_culturas():
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Cultura")

    dados = cursor.fetchall()

    cursor.close()
    conn.close()

    return dados

# alterar
@router_culturas.put('/{id}')  

def alterar_cultura(id: int, cultura: Cultura):
    
    conn = conectar()
    cursor = conn.cursor()

    sql = """
    UPDATE Cultura
    SET nome=%s,
        safra=%s
    WHERE id=%s
    """

    valores = (
        cultura.nome,
        cultura.safra,
        id
    )

    cursor.execute(sql, valores)

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Cultura atualizada"}

# deletar
@router_culturas.delete('/{id}')  
def deletar_cultura(id: int):
    
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM Cultura WHERE id=%s",
        (id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Cultura deletada"}
