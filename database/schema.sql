CREATE TABLE perfis (
  id INTEGER PRIMARY KEY,
  nome VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil_id INTEGER NOT NULL,
  FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);

CREATE TABLE voos (
  id INTEGER PRIMARY KEY,
  numero VARCHAR(10) NOT NULL,
  origem VARCHAR(3) NOT NULL,
  destino VARCHAR(3) NOT NULL,
  status VARCHAR(30) NOT NULL
);

CREATE TABLE ocorrencias (
  id INTEGER PRIMARY KEY,
  voo_id INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  detalhe_tecnico TEXT NOT NULL,
  recomendacao_operacional TEXT,
  mensagem_cliente TEXT,
  criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (voo_id) REFERENCES voos(id)
);

CREATE TABLE atualizacoes (
  id INTEGER PRIMARY KEY,
  ocorrencia_id INTEGER NOT NULL,
  autor_id INTEGER NOT NULL,
  texto TEXT NOT NULL,
  criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ocorrencia_id) REFERENCES ocorrencias(id),
  FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);

INSERT INTO perfis (id, nome) VALUES
  (1, 'MANUTENCAO_CCO'),
  (2, 'ATENDIMENTO_COMERCIAL'),
  (3, 'CLIENTE');