from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router_insumos = APIRouter(
    prefix='/insumos',
    tags=['Insumos']
)

class InsumoInput(BaseModel):
    nome: str
    categoria: str  # Sementes, Fertilizantes ou Defensivos
    quantidade: float
    unidade: str    # kg, L, toneladas, sacas
    preco_unitario: float

# Base de dados em memória para Insumos
banco_insumos = [
    {"id": 1, "nome": "Semente de Soja Brasmax", "categoria": "Sementes", "quantidade": 150, "unidade": "sacas", "preco_unitario": 280.00},
    {"id": 2, "nome": "Adubo NPK 02-20-20", "categoria": "Fertilizantes", "quantidade": 5000, "unidade": "kg", "preco_unitario": 3.50},
    {"id": 3, "nome": "Glifosato 480", "categoria": "Defensivos", "quantidade": 200, "unidade": "L", "preco_unitario": 45.00}
]

@router_insumos.get('/')
def consultar_insumos():
    return banco_insumos

@router_insumos.get('/{id}')
def consultar_insumo(id: int):
    for insumo in banco_insumos:
        if insumo['id'] == id:
            return insumo
    raise HTTPException(status_code=404, detail='Insumo não localizado nos registos.')

@router_insumos.post('/')
def registar_insumo(dados: InsumoInput):
    novo_id = max([i["id"] for i in banco_insumos], default=0) + 1
    
    novo_insumo = {
        'id': novo_id,
        'nome': dados.nome,
        'categoria': dados.categoria,
        'quantidade': dados.quantidade,
        'unidade': dados.unidade,
        'preco_unitario': dados.preco_unitario
    }
    banco_insumos.append(novo_insumo)
    return {'mensagem': 'Insumo registado com sucesso no inventário.', 'dados': novo_insumo}

@router_insumos.put('/{id}')
def atualizar_insumo(id: int, dados: InsumoInput):
    for insumo in banco_insumos:
        if insumo['id'] == id:
            insumo['nome'] = dados.nome
            insumo['categoria'] = dados.categoria
            insumo['quantidade'] = dados.quantidade
            insumo['unidade'] = dados.unidade
            insumo['preco_unitario'] = dados.preco_unitario
            return {'mensagem': 'Registo do insumo atualizado com sucesso.', 'dados': insumo}
    raise HTTPException(status_code=404, detail='Insumo não localizado nos registos.')

@router_insumos.delete('/{id}')
def eliminar_insumo(id: int):
    for insumo in banco_insumos:
        if insumo['id'] == id:
            banco_insumos.remove(insumo)
            return {'mensagem': 'Insumo removido do inventário.'}
    raise HTTPException(status_code=404, detail='Insumo não localizado nos registos.')