from fastapi import APIRouter
from models.model import Fazenda
from db import conectar

router_fazendas = APIRouter(
    prefix="/fazendas",
    tags=["Fazendas"]
)


# =========================
# CREATE
# =========================
@router_fazendas.post('/')
def cadastrar_fazenda(fazenda: Fazenda):

    conn = conectar()
    cursor = conn.cursor()

    sql = """
    INSERT INTO fazenda
    (nome, localizacao, area_total, status)
    VALUES (%s, %s, %s, %s)
    """

    valores = (
        fazenda.nome,
        fazenda.localizacao,
        fazenda.areaTotal,
        fazenda.status
    )

    cursor.execute(sql, valores)

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Fazenda cadastrada"}


# =========================
# READ
# =========================
@router_fazendas.get('/')
def listar_fazendas():

    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("SELECT id, nome, localizacao, area_total, status FROM fazenda ORDER BY id DESC")

    dados = cursor.fetchall()

    lista = []
    for d in dados:
        lista.append({
            "id": d[0],
            "nome": d[1],
            "localizacao": d[2],
            "areaTotal": float(d[3]) if d[3] is not None else 0.0,
            "status": d[4]
        })

    cursor.close()
    conn.close()

    return lista


# =========================
# UPDATE
# =========================
@router_fazendas.put('/{id}')
def atualizar_fazenda(id: int, fazenda: Fazenda):

    conn = conectar()
    cursor = conn.cursor()

    sql = """
    UPDATE fazenda
    SET nome=%s,
        localizacao=%s,
        area_total=%s,
        status=%s
    WHERE id=%s
    """

    valores = (
        fazenda.nome,
        fazenda.localizacao,
        fazenda.areaTotal,
        fazenda.status,
        id
    )

    cursor.execute(sql, valores)

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Fazenda atualizada"}


# =========================
# DELETE
# =========================
@router_fazendas.delete('/{id}')
def deletar_fazenda(id: int):

    conn = conectar()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM fazenda WHERE id=%s",
        (id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Fazenda deletada"}
