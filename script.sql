CREATE DATABASE trabalhopratico;

use trabalhopratico;

CREATE TABLE utilizadores (
	id INT PRIMARY KEY identity(1,1),
	nome VARCHAR (30) NOT NULL,
	datanascimento DATE NOT NULL,
	morada VARCHAR (50) NOT NULL,
	email VARCHAR (100) NOT NULL UNIQUE,
	telefone INT NOT NULL UNIQUE,
	genero VARCHAR(30) NOT NULL,
	fotografia VARCHAR(255) NOT NULL,
	documento VARCHAR(255) NOT NULL,
	password VARCHAR (100) NOT NULL,
	role VARCHAR (10) NOT NULL DEFAULT 'user',
	CHECK (role IN ('user','admin'))
);

CREATE TABLE barbeiros(
	id INT PRIMARY KEY identity(1,1),
	nome VARCHAR(30) NOT NULL,
)

CREATE TABLE servicos (
	id INT PRIMARY KEY identity(1,1),
	nome VARCHAR (30) NOT NULL,
	descricao TEXT,
	preco decimal(10,2) NOT NULL,
	imagem VARCHAR(255) NOT NULL
);

CREATE TABLE marcacoes (
	id INT PRIMARY KEY identity(1,1),
	user_id INT REFERENCES utilizadores(id),
	servico_id INT REFERENCES servicos(id),
	barbeiro_id INT REFERENCES barbeiros(id);
	data DATE NOT NULL,
	hora TIME NOT NULL
)
