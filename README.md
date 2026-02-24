# Sistema de Gestão de Barbearia

Projeto desenvolvido no âmbito da cadeira de Computação Distribuída , 3º semestre.

Sistema completo de gestão para barbearias com agendamento de serviços, controle de utilizadores e barbeiros. Desenvolvido com React no frontend e Node.js/Express no backend, utilizando SQL Server como base de dados.

## Tecnologias Utilizadas

**Backend:** Node.js, Express, SQL Server, JWT, bcryptjs, multer

**Frontend:** React, Vite, React Router

## Funcionalidades Principais

- Sistema de autenticação e autorização com JWT
- Controle de permissões (utilizador comum e administrador)
- Gestão de serviços (registo, edição, exclusão e listagem)
- Sistema de agendamentos com validação de disponibilidade
- Gestão de barbeiros e usuários
- Upload de arquivos (imagens)
- Validação de horários

## Documentação dos Endpoints

### Autenticação

- **POST** `/login` - Realiza login no sistema
- **POST** `/register` - Regista um novo usuário
- **POST** `/check-auth` - Verifica se o token JWT é válido

### Upload de Arquivos

- **POST** `/upload` - Faz upload de um arquivo (imagem ou PDF)

### Serviços

- **GET** `/services` - Lista todos os serviços disponíveis
- **POST** `/services` - Cria um novo serviço (apenas admin)
- **PUT** `/services/:id` - Atualiza um serviço existente (apenas admin)
- **DELETE** `/services/:id` - Deleta um serviço (apenas admin)

### Marcações

- **GET** `/appointments` - Lista as marcações do usuário logado
- **GET** `/appointments/all` - Lista todos as marcações do sistema (apenas admin)
- **GET** `/appointments/booked/:date` - Retorna os horários ocupados em uma data específica
- **POST** `/appointments` - Cria uma nova marcação
- **DELETE** `/appointments/:id` - Cancela uma marcação

### Barbeiros

- **GET** `/barbeiros` - Lista todos os barbeiros registados
- **POST** `/barbeiro` - Registar um novo barbeiro (apenas admin)
- **DELETE** `/barbeiro/:id` - Remove um barbeiro (apenas admin)

### Usuários

- **GET** `/users` - Lista todos os usuários registados (apenas admin)
- **DELETE** `/users/:id` - Remove um usuário (apenas admin)

## Como Rodar o Projeto Localmente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- SQL Server (local ou remoto)
- npm

### Passos para Instalação

1. **Configure a Base de Dados**
   - Execute o arquivo `script.sql` no SQL Server

2. **Configure o Backend**

Crie um arquivo `.env` na pasta `backend` e preencha com as suas credenciais:

```env
DB_USER=seu_usuario
DB_PASSWORD=sua_palavra_passe
DB_SERVER=localhost
DB_DATABASE=nome_da_base_de_dados
JWT_SECRET=seu_secret_key_aqui (ex: "dsadad32")
PORT=3000
```

Instale as dependências e inicie o servidor:

```bash
cd backend
npm install
npm run dev
```

3. **Configure o Frontend**

```bash
cd frontend
npm install
npm run dev
```

4. **Acesse o sistema**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

5. **Criação de administrador:**

Registe-se normalmente no sistema e a seguir , na base de dados, altere a "role" desse utilizador para "admin" :

```sql
UPDATE utilizadores SET role = 'admin' WHERE email = 'seuemail@exemplo.com';
```
---
