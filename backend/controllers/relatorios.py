from fastapi import APIRouter
from controllers.custos import banco_custos
from controllers.producao import banco_producao

router_relatorios = APIRouter(prefix="/relatorios")

@router_relatorios.get('/resumo')
def obter_resumo_financeiro():
    total_custos = sum(c["valor"] for c in banco_custos)
    total_receita = sum(p["quantidade"] * p["valor_unitario"] for p in banco_producao)
    lucro = total_receita - total_custos
    margem = (lucro / total_receita * 100) if total_receita > 0 else 0.0
    
    resumo_categorias = {}
    for c in banco_custos:
        cat = c["categoria"]
        resumo_categorias[cat] = resumo_categorias.get(cat, 0.0) + c["valor"]

    performance_cultura = [
        {
            "cultura": "Soja Safra 23/24",
            "lucro": 210000.0,
            "receita": 410000.0,
            "custo": 200000.0,
            "margem": 51.2,
            "fazenda": "Fazenda Alvorada",
            "area": 250
        },
        {
            "cultura": "Milho Safrinha",
            "lucro": 135000.0,
            "receita": 320000.0,
            "custo": 185000.0,
            "margem": 38.4,
            "fazenda": "Fazenda Santa Fé",
            "area": 180
        },
        {
            "cultura": "Trigo Inverno",
            "lucro": 530000.0,
            "receita": 140000.0,
            "custo": 87000.0,
            "margem": 28.0,
            "fazenda": "Fazenda Progresso",
            "area": 120
        }
    ]

    return {
        "receitaTotal": total_receita,
        "custoTotal": total_custos,
        "lucroEstimado": lucro,
        "margemLucro": round(margem, 1),
        "resumoCategorias": resumo_categorias,
        "performanceCultura": performance_cultura,
        "graficoFluxo": {
            "meses": ["Set", "Out", "Nov", "Dez"],
            "receitas": [400000, 600000, 800000, total_receita if total_receita > 0 else 1240000],
            "custos": [300000, 450000, 600000, total_custos if total_custos > 0 else 842000]
        }
    }