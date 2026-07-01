from fastapi import APIRouter
from models.model import Talhao
from db import conectar

router_talhoes = APIRouter(
    prefix="/talhoes",
    tags=["Talhões"]
)


@router_talhoes.post('/')
def cadastrar_talhao(talhao: Talhao):
    conn = conectar()
    cursor = conn.cursor()
    
    try:
        # Dica: No Postgres é mais seguro usar tudo minúsculo nas queries 
        # para evitar problemas de compatibilidade
        sql = """
        INSERT INTO talhao
        (area, tipocultura, idade, volumeestimado, idfazenda, maquinario, operador)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        valores = (
            talhao.area,
            talhao.tipoCultura,
            talhao.idade,
            talhao.volumeEstimado,
            talhao.idFazenda,
            talhao.maquinario,
            talhao.operador
        )
        
        cursor.execute(sql, valores)
        conn.commit() # Salva de verdade no banco
        
        return {"mensagem": "Talhão cadastrado"}
        
    except Exception as e:
        conn.rollback() # Desfaz qualquer alteração pela metade se der erro
        print(f"Erro ao salvar talhão: {e}")
        raise e # Repassa o erro para o FastAPI mostrar no terminal
        
    finally:
        # O finally SEMPRE roda, dando erro ou não. 
        # Suas conexões nunca vão ficar presas!
        cursor.close()
        conn.close()


@router_talhoes.get('/')
def listar_talhoes():

    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Talhao")

    dados = cursor.fetchall()

    cursor.close()
    conn.close()

    return dados


@router_talhoes.put('/{id}')
def atualizar_talhao(id: int, talhao: Talhao):

    conn = conectar()
    cursor = conn.cursor()

    sql = """
    UPDATE Talhao
    SET area=%s,
        tipoCultura=%s,
        idade=%s,
        volumeEstimado=%s,
        idFazenda=%s,
        maquinario=%s,
        operador=%s
    WHERE id=%s
    """

    valores = (
        talhao.area,
        talhao.tipoCultura,
        talhao.idade,
        talhao.volumeEstimado,
        talhao.idFazenda,
        talhao.maquinario,
        talhao.operador,
        id
    )

    cursor.execute(sql, valores)

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Talhão atualizado"}


@router_talhoes.delete('/{id}')
def deletar_talhao(id: int):

    conn = conectar()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM Talhao WHERE id=%s",
        (id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {"mensagem": "Talhão deletado"}
