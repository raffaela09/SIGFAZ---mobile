from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router_maquinas = APIRouter(
    prefix='/maquinas',
    tags=['Máquinas']
)

# Definição do modelo de validação de dados
class MaquinaInput(BaseModel):
    nome: str
    tipo: str
    marca: str
    ano: int

# Simulação da base de dados em memória
banco_maquinas = [
    {"id": 1, "nome": "Trator Série 8R", "tipo": "Trator", "marca": "John Deere", "ano": 2022},
    {"id": 2, "nome": "Colheitadeira Axial-Flow", "tipo": "Colheitadeira", "marca": "Case IH", "ano": 2021}
]

@router_maquinas.get('/')
def consultar_maquinas():
    return banco_maquinas

@router_maquinas.get('/{id}')
def consultar_maquina(id: int):
    for maquina in banco_maquinas:
        if maquina['id'] == id:
            return maquina
    raise HTTPException(status_code=404, detail='Máquina não encontrada no sistema.')

@router_maquinas.post('/')
def registar_maquina(dados: MaquinaInput):
    novo_id = max([m["id"] for m in banco_maquinas], default=0) + 1
    
    nova_maquina = {
        'id': novo_id,
        'nome': dados.nome,
        'tipo': dados.tipo,
        'marca': dados.marca,
        'ano': dados.ano
    }
    banco_maquinas.append(nova_maquina)
    return {'mensagem': 'Registo da máquina efetuado com sucesso.', 'dados': nova_maquina}

@router_maquinas.put('/{id}')
def atualizar_maquina(id: int, dados: MaquinaInput):
    for maquina in banco_maquinas:
        if maquina['id'] == id:
            maquina['nome'] = dados.nome
            maquina['tipo'] = dados.tipo
            maquina['marca'] = dados.marca
            maquina['ano'] = dados.ano
            return {'mensagem': 'Dados da máquina atualizados com sucesso.', 'dados': maquina}
    raise HTTPException(status_code=404, detail='Máquina não encontrada no sistema.')

@router_maquinas.delete('/{id}')
def eliminar_maquina(id: int):
    for maquina in banco_maquinas:
        if maquina['id'] == id:
            banco_maquinas.remove(maquina)
            return {'mensagem': 'Máquina eliminada dos registos.'}
    raise HTTPException(status_code=404, detail='Máquina não encontrada no sistema.')