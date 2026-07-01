from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router_producao = APIRouter(
    prefix='/producao',
    tags=['Produção e Receitas']
)

# Modelo de entrada de dados para colheitas/vendas
class ProducaoInput(BaseModel):
    cultura: str
    talhao: str
    quantidade: float
    unidade: str
    valor_unitario: float
    data: str

# Simulação da base de dados em memória para as receitas
banco_producao = [
    {"id": 1, "cultura": "Soja", "talhao": "Talhão Norte", "quantidade": 3200, "unidade": "sacas", "valor_unitario": 135.50, "data": "2024-03-15"},
    {"id": 2, "cultura": "Milho", "talhao": "Talhão Sul", "quantidade": 5000, "unidade": "sacas", "valor_unitario": 65.00, "data": "2024-07-20"}
]

@router_producao.get('/')
def consultar_producao():
    return banco_producao

@router_producao.post('/')
def registar_producao(dados: ProducaoInput):
    novo_id = max([p["id"] for p in banco_producao], default=0) + 1
    
    nova_producao = {
        'id': novo_id,
        'cultura': dados.cultura,
        'talhao': dados.talhao,
        'quantidade': dados.quantidade,
        'unidade': dados.unidade,
        'valor_unitario': dados.valor_unitario,
        'data': dados.data
    }
    banco_producao.append(nova_producao)
    return {'mensagem': 'Registo de produção efetuado com sucesso.', 'dados': nova_producao}

@router_producao.delete('/{id}')
def eliminar_producao(id: int):
    for producao in banco_producao:
        if producao['id'] == id:
            banco_producao.remove(producao)
            return {'mensagem': 'Registo de produção eliminado permanentemente.'}
    raise HTTPException(status_code=404, detail='Registo não encontrado.')