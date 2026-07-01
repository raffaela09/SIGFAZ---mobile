from pydantic import BaseModel

class Fazenda(BaseModel):
    nome: str
    localizacao: str
    areaTotal: float
    status: str | None = "Ativa"

class Talhao(BaseModel):
    area: float
    tipoCultura: str
    idade: int
    volumeEstimado: float
    idFazenda: int
    maquinario: str | None = None
    operador: str | None = None

class Safra(BaseModel):
    inicio: str
    fim: str

class Plantio(BaseModel):
    data: str
    idSafra: int 
    idTalhao: int
class Cultura(BaseModel):
    nome: str
    safra: float

class Colheita(BaseModel):
    data: str
    quantidade: float
    idCultura: int
    
class Funcionario(BaseModel):
    nome: str
    funcao: str
    salario: float
    cpf: str
    telefone: str
class Operador(BaseModel):
    nome: str
    cpf: str
    cargo: str
    idFazenda: int
class Atividade(BaseModel):
    tipo: str
    data: str
    horaInicio: str
    horaFim: str
    custoTotal: float
    descricao: str
    idFuncionario: int
class Insumo(BaseModel):
    nome: str
    tipo: str
    custo: float
    quantidade: int
    
class AtividadeInsumo(BaseModel):
    idAtividade: int
    idInsumo: int
    quantidade: float
    custo: float
    unidadeMedida: str
class Maquina(BaseModel):
    tipo: str
    modelo: str
    custoHora: float
    ano: int
    status: str
    
class UsoMaquina(BaseModel):
    idAtividade: int
    idMaquina: int
    horasUso: str

### verficar
class Semente(BaseModel):
    nome: str
    quantidade: int
    unidade: str
    cultura: str

class Fertilizante(BaseModel):
    nome: str
    quantidade: int
    unidade: str
    tipo: str

class Defensivo(BaseModel):
    nome: str
    quantidade: int
    unidade: str
    principioAtivo: str


class Custo(BaseModel):
    descricao: str
    valor: float
    data: str
    categoria: str   
    idFazenda: int

class Producao(BaseModel):
    idTalhao: int
    cultura: str
    safra: str
    quantidade_colhida: float
    unidade: str               
    data_registro: str