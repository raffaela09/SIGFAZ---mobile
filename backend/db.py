import os
# Isso tenta forçar o PostgreSQL a falar inglês para parar de quebrar com acentos
os.environ["PGCLIENTENCODING"] = "utf-8"
os.environ["LC_MESSAGES"] = "C"

import psycopg2

def conectar():
    print("Tentando conectar ao banco de dados...")
    try:
        conexao = psycopg2.connect(
            host="localhost",
            database="postgres", # IMPORTANTE: Deixe 'postgres' aqui por enquanto
            user="postgres",
            password="123456", # Digite a senha que você criou na instalação
            port="5432"
        )
        print("Conexão bem sucedida!")
        return conexao
    except Exception as e:
        print("ERRO DE CONEXÃO: Verifique sua senha e se o banco existe.")
        raise e
    

def criar_tabelas():
    print("Verificando se as tabelas existem...")
    conn = conectar()
    cursor = conn.cursor()
    try:
        # 1. Cria a tabela de Fazenda
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS fazenda (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            localizacao VARCHAR(255) NOT NULL,
            area_total NUMERIC NOT NULL,
            status VARCHAR(50) DEFAULT 'Ativa'
        );
        """)
        conn.commit()

        # 2. Cria a tabela de Talhão
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS talhao (
            id SERIAL PRIMARY KEY,
            area NUMERIC NOT NULL,
            tipocultura VARCHAR(100) NOT NULL,
            idade INTEGER NOT NULL,
            volumeestimado NUMERIC NOT NULL,
            idfazenda INTEGER NOT NULL,
            maquinario VARCHAR(255),
            operador VARCHAR(255),
            status_ciclo VARCHAR(50) DEFAULT 'Plantio',
            data_plantio VARCHAR(50),
            safra VARCHAR(50)
        );
        """)
        conn.commit()

        # 3. Cria a tabela de Operador
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS operador (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            cpf VARCHAR(14) NOT NULL,
            cargo VARCHAR(100) NOT NULL,
            id_fazenda INTEGER NOT NULL
        );
        """)
        conn.commit()

        # 4. Cria a tabela de Cultura
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Cultura (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            safra VARCHAR(100) NOT NULL
        );
        """)
        conn.commit()

        # Migrações seguras de colunas para talhao
        colunas_migracao = [
            ("maquinario", "VARCHAR(255)"),
            ("operador", "VARCHAR(255)"),
            ("status_ciclo", "VARCHAR(50) DEFAULT 'Plantio'"),
            ("data_plantio", "VARCHAR(50)"),
            ("safra", "VARCHAR(50)")
        ]
        for col, tipo in colunas_migracao:
            try:
                cursor.execute(f"ALTER TABLE talhao ADD COLUMN {col} {tipo};")
                conn.commit()
            except Exception:
                conn.rollback()

        # Seeding de dados iniciais
        # 1. Fazendas
        cursor.execute("SELECT COUNT(*) FROM fazenda;")
        if cursor.fetchone()[0] == 0:
            print("Seeding fazendas...")
            fazendas_seed = [
                ("Fazenda Boa Esperança", "15°45'S, 47°52'W", 1250.0, "Ativa"),
                ("Recanto do Vale", "16°22'S, 48°15'W", 850.0, "Ativa"),
                ("Pioneira Agrícola", "14°20'S, 46°30'W", 2100.0, "Inativa")
            ]
            for f in fazendas_seed:
                cursor.execute("INSERT INTO fazenda (nome, localizacao, area_total, status) VALUES (%s, %s, %s, %s);", f)
            conn.commit()

        # 2. Talhões / Culturas
        cursor.execute("SELECT COUNT(*) FROM talhao;")
        if cursor.fetchone()[0] == 0:
            print("Seeding talhões...")
            talhoes_seed = [
                (65.0, "Soja RR", 0, 65.0, 1, "Trator John Deere 8R", "João Silva", "Crescimento", "2024-10-15", "Safra 24/25"),
                (120.0, "Milho Híbrido", 0, 145.0, 1, "Colheitadeira Axial-Flow", "Carlos Santos", "Colheita", "2024-02-02", "Safra 24/25"),
                (82.5, "Soja IPRO", 0, 72.0, 1, "Trator John Deere 7J", "Marcos Lima", "Plantio", "2024-10-22", "Safra 24/25")
            ]
            for t in talhoes_seed:
                cursor.execute("""
                    INSERT INTO talhao (area, tipocultura, idade, volumeestimado, idfazenda, maquinario, operador, status_ciclo, data_plantio, safra)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                """, t)
            conn.commit()

        # 3. Operadores
        cursor.execute("SELECT COUNT(*) FROM operador;")
        if cursor.fetchone()[0] == 0:
            print("Seeding operadores...")
            operadores_seed = [
                ("João Silva", "123.456.789-01", "Operador de Trator", 1),
                ("Carlos Santos", "987.654.321-02", "Operador de Colheitadeira", 1),
                ("Marcos Lima", "456.789.123-03", "Auxiliar de Campo", 1)
            ]
            for o in operadores_seed:
                cursor.execute("INSERT INTO operador (nome, cpf, cargo, id_fazenda) VALUES (%s, %s, %s, %s);", o)
            conn.commit()

        print("Tabelas e Seed prontas para uso!")
    except Exception as e:
        print("Erro ao criar as tabelas:", e)
    finally:
        cursor.close()
        conn.close()