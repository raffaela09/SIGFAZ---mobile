from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router_atividades = APIRouter(
    prefix='/atividades',
    tags=['Atividades Agrícolas']
)

# Definição do modelo de validação
class AtividadeInput(BaseModel):
    tipo: str
    data: str
    talhao: str
    descricao: str

# Simulação da base de dados em memória
banco_atividades = [
    {"id": 1, "tipo": "Preparo de Solo", "data": "2023-09-10", "talhao": "Talhão Norte", "descricao": "Gradagem e nivelamento do terreno."},
    {"id": 2, "tipo": "Plantio", "data": "2023-10-15", "talhao": "Talhão Norte", "descricao": "Semeadura de Soja Brasmax."},
    {"id": 3, "tipo": "Pulverização", "data": "2023-11-20", "talhao": "Talhão Norte", "descricao": "Aplicação de herbicida."}
]

@router_atividades.get('/')
def consultar_atividades():
    return banco_atividades

@router_atividades.get('/{id}')
def consultar_atividade(id: int):
    for atividade in banco_atividades:
        if atividade['id'] == id:
            return atividade
    raise HTTPException(status_code=404, detail='Registo de atividade não encontrado.')

@router_atividades.post('/')
def registar_atividade(dados: AtividadeInput):
    novo_id = max([a["id"] for a in banco_atividades], default=0) + 1
    
    nova_atividade = {
        'id': novo_id,
        'tipo': dados.tipo,
        'data': dados.data,
        'talhao': dados.talhao,
        'descricao': dados.descricao
    }
    banco_atividades.append(nova_atividade)
    return {'mensagem': 'Atividade registada com sucesso.', 'dados': nova_atividade}

@router_atividades.put('/{id}')
def atualizar_atividade(id: int, dados: AtividadeInput):
    for atividade in banco_atividades:
        if atividade['id'] == id:
            atividade['tipo'] = dados.tipo
            atividade['data'] = dados.data
            atividade['talhao'] = dados.talhao
            atividade['descricao'] = dados.descricao
            return {'mensagem': 'Registo atualizado com sucesso.', 'dados': atividade}
    raise HTTPException(status_code=404, detail='Registo de atividade não encontrado.')

@router_atividades.delete('/{id}')
def eliminar_atividade(id: int):
    for atividade in banco_atividades:
        if atividade['id'] == id:
            banco_atividades.remove(atividade)
            return {'mensagem': 'Registo de atividade eliminado.'}
    raise HTTPException(status_code=404, detail='Registo de atividade não encontrado.')