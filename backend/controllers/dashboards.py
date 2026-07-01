from fastapi import APIRouter
from db import conectar

router_dashboard = APIRouter(prefix="/dashboard")

@router_dashboard.get('/')
def visualizar_dashboard():
    conn = conectar()
    cursor = conn.cursor()
    
    try:
        # Soma da área e produção estimada de todos os talhões
        cursor.execute("SELECT SUM(area), SUM(volumeestimado) FROM talhao")
        row = cursor.fetchone()
        
        area_total = row[0] if row and row[0] is not None else 0
        producao_est = row[1] if row and row[1] is not None else 0
        
        return {
            "areaTotal": area_total,
            "producaoEst": producao_est,
            "graficoProdutividade": [30, 25, 40, 35, 50, 60],
            "graficoCustos": [
                {"nome": "Sementes", "valor": 40},
                {"nome": "Fertil.", "valor": 80},
                {"nome": "Mão Obra", "valor": 50},
                {"nome": "Combust.", "valor": 30}
            ]
        }
    except Exception as e:
        print("Erro no dashboard:", e)
        return {
            "areaTotal": 0,
            "producaoEst": 0,
            "graficoProdutividade": [0,0,0,0,0,0],
            "graficoCustos": []
        }
    finally:
        cursor.close()
        conn.close()
