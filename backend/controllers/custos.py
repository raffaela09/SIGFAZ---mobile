from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router_custos = APIRouter(
    prefix='/custos',
    tags=['Custos e Gastos']
)

# Modelo para validação da entrada de dados financeiros
class CustoInput(BaseModel):
    categoria: str
    descricao: str
    valor: float
    data: str

# Simulação da base de dados em memória para os custos
banco_custos = [
    {"id": 1, "categoria": "Fertilizantes", "descricao": "Aquisição de Adubo NPK 02-20-20", "valor": 17500.00, "data": "2023-09-15"},
    {"id": 2, "categoria": "Combustível", "descricao": "Abastecimento da frota de tratores", "valor": 4500.00, "data": "2023-09-20"},
    {"id": 3, "categoria": "Manutenção", "descricao": "Reparação da Colheitadeira", "valor": 2300.50, "data": "2023-10-05"}
]

@router_custos.get('/')
def consultar_custos():
    return banco_custos

@router_custos.get('/{id}')
def consultar_custo(id: int):
    for custo in banco_custos:
        if custo['id'] == id:
            return custo
    raise HTTPException(status_code=404, detail='Registo de despesa não localizado.')

@router_custos.post('/')
def registar_custo(dados: CustoInput):
    novo_id = max([c["id"] for c in banco_custos], default=0) + 1
    
    novo_custo = {
        'id': novo_id,
        'categoria': dados.categoria,
        'descricao': dados.descricao,
        'valor': dados.valor,
        'data': dados.data
    }
    banco_custos.append(novo_custo)
    return {'mensagem': 'Despesa registada com sucesso.', 'dados': novo_custo}

@router_custos.put('/{id}')
def atualizar_custo(id: int, dados: CustoInput):
    for custo in banco_custos:
        if custo['id'] == id:
            custo['categoria'] = dados.categoria
            custo['descricao'] = dados.descricao
            custo['valor'] = dados.valor
            custo['data'] = dados.data
            return {'mensagem': 'Registo atualizado com êxito.', 'dados': custo}
    raise HTTPException(status_code=404, detail='Registo de despesa não localizado.')

@router_custos.delete('/{id}')
def eliminar_custo(id: int):
    for custo in banco_custos:
        if custo['id'] == id:
            banco_custos.remove(custo)
            return {'mensagem': 'Registo de despesa eliminado permanentemente.'}
    raise HTTPException(status_code=404, detail='Registo de despesa não localizado.')