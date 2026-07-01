from fastapi import APIRouter
from models.model import Operador
from db import conectar

router_operadores = APIRouter(
    prefix="/operadores",
    tags=["Operadores"]
)


@router_operadores.post('/')
def cadastrar_operador(operador: Operador):

    conn = conectar()
    cursor = conn.cursor()

    sql = """
    INSERT INTO operador
    (nome, cpf, cargo, id_fazenda)
    VALUES (%s, %s, %s, %s)
    """

    valores = (
        operador.nome,
        operador.cpf,
        operador.cargo,
        operador.idFazenda
    )

    cursor.execute(sql, valores)

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Operador cadastrado"}


@router_operadores.get('/')
def listar_operadores():

    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("SELECT id, nome, cpf, cargo, id_fazenda FROM operador ORDER BY id DESC")

    dados = cursor.fetchall()

    lista = []
    for d in dados:
        lista.append({
            "id": d[0],
            "nome": d[1],
            "cpf": d[2],
            "cargo": d[3],
            "idFazenda": d[4]
        })

    cursor.close()
    conn.close()

    return lista


@router_operadores.put('/{id}')
def atualizar_operador(id: int, operador: Operador):

    conn = conectar()
    cursor = conn.cursor()

    sql = """
    UPDATE operador
    SET nome=%s,
        cpf=%s,
        cargo=%s,
        id_fazenda=%s
    WHERE id=%s
    """

    valores = (
        operador.nome,
        operador.cpf,
        operador.cargo,
        operador.idFazenda,
        id
    )

    cursor.execute(sql, valores)

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Operador atualizado"}


@router_operadores.delete('/{id}')
def deletar_operador(id: int):

    conn = conectar()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM operador WHERE id=%s",
        (id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Operador deletado"}
