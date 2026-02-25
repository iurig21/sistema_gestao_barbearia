# Sistema de Gestão de Barbearia

Projeto desenvolvido no âmbito da cadeira de Computação Distribuída, 3º semestre.

Sistema completo de gestão para barbearias com agendamento de serviços, controle de utilizadores e barbeiros. Desenvolvido com React no frontend e Node.js/Express no backend, utilizando SQL Server como base de dados.

## Tecnologias Utilizadas

**Backend:** Node.js, Express, SQL Server, JWT, bcryptjs, Resend (email), Twilio (WhatsApp), Cloudinary (upload), Google Calendar API, Multer (em memória)

**Frontend:** React, Vite, React Router, Lucide React

## Funcionalidades Principais

### Autenticação e Registo
- Sistema de autenticação e autorização com JWT
- Registo com validação de email e telefone (formato português: 9xxxxxxxx)
- **Verificação por email** – link enviado via [Resend](https://resend.com)
- **Verificação por WhatsApp** – código de 6 dígitos enviado via Twilio
- Fluxo de confirmação: Registo → Verificar Email → Verificar Telefone → Login

### Permissões e Gestão
- Controle de permissões (utilizador comum e administrador)
- Gestão de serviços (registo, edição, exclusão e listagem)
- Sistema de agendamentos com validação de disponibilidade
- Gestão de barbeiros e utilizadores
- Perfil de utilizador editável (nome, morada, fotografia, etc.)

### Integrações
- **Upload de imagens** – Cloudinary (imagens de perfil, serviços)
- **Google Calendar** – sincronização de marcações (ligar conta no perfil)
- **Email** – Resend (verificação de email)
- **WhatsApp** – Twilio (verificação de telefone)

### Validações
- Validação de horários e disponibilidade
- Validação de email e telefone no registo

## Documentação dos Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Login no sistema |
| POST | `/register` | Registo de um novo utilizador |
| GET | `/verify-email` | Verifica o email (query: `token`) |
| POST | `/verify-phone` | Verifica o telefone (body: `userId`, `code`) |
| POST | `/resend-phone-code` | Reenvia o código WhatsApp (body: `userId`) |
| POST | `/check-auth` | Verifica se o token JWT é válido (requer token) |

### Upload

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/upload` | Upload de imagem ou PDF (requer token) |

### Serviços

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/services` | Lista todos os serviços disponíveis |
| POST | `/services` | Cria um novo serviço (apenas admin) |
| PUT | `/services/:id` | Atualiza um serviço (apenas admin) |
| DELETE | `/services/:id` | Remove um serviço (apenas admin) |

### Marcações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/appointments` | Lista as marcações do utilizador logado |
| GET | `/appointments/all` | Lista todas as marcações (apenas admin) |
| GET | `/appointments/booked/:date` | Horários ocupados numa data específica |
| POST | `/appointments` | Cria uma nova marcação |
| DELETE | `/appointments/:id` | Cancela uma marcação |

### Barbeiros

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/barbeiros` | Lista todos os barbeiros |
| POST | `/barbeiro` | Regista um novo barbeiro (apenas admin) |
| DELETE | `/barbeiro/:id` | Remove um barbeiro (apenas admin) |

### Utilizadores

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Lista todos os utilizadores (apenas admin) |
| PUT | `/users/:id` | Atualiza o perfil do utilizador |
| DELETE | `/users/:id` | Remove um utilizador (apenas admin) |

### Google Calendar

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/google/auth-url` | URL para ligar conta Google (requer token) |
| GET | `/google/callback` | Callback OAuth (usado internamente) |
| GET | `/google/status` | Verifica se a conta está ligada (requer token) |
| DELETE | `/google/disconnect` | Desliga a conta Google (requer token) |

## Como Rodar o Projeto Localmente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- SQL Server (local ou remoto)
- npm

### Passos para Instalação

1. **Configure a Base de Dados**
   - Execute o ficheiro `script.sql` no SQL Server

2. **Configure o Backend**

Crie um ficheiro `.env` na pasta `backend` com as variáveis necessárias:

```env
# Base de dados
DB_USER=seu_usuario
DB_PASSWORD=sua_palavra_passe
DB_SERVER=localhost
DB_DATABASE=nome_da_base_de_dados
DB_PORT=1433

# Servidor
PORT=3000

# Autenticação
JWT_SECRET=seu_secret_key_aqui

# Frontend (para redirects e links nos emails)
FRONTEND_URL=http://localhost:5173

# Email (Resend - verificação de email)
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=Barbearia <onboarding@resend.dev>

# WhatsApp (Twilio - verificação de telefone)
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=xxxxxxxx
CLOUDINARY_API_KEY=xxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxx

# Google Calendar (opcional)
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/google/callback
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

4. **Aceda ao sistema**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

5. **Criação de administrador**

Registe-se normalmente no sistema e, na base de dados, altere a role desse utilizador para `admin`:

```sql
UPDATE utilizadores SET role = 'admin' WHERE email = 'seuemail@exemplo.com';
```

## Deploy (Railway)

Para deploy em produção (ex.: Railway):

- Configure todas as variáveis de ambiente no painel do Railway
- Ajuste `FRONTEND_URL` e `GOOGLE_REDIRECT_URI` para os URLs de produção
- Garanta que `RESEND_API_KEY` está definida; caso contrário, o envio de emails falhará (o servidor não crasha, mas os emails não serão enviados)

## Alterações Recentes

- **Email:** Migração de Gmail/Nodemailer para Resend
- **Upload:** Migração de armazenamento local/Multer para Cloudinary
- **Registo:** Verificação dupla por email (Resend) e telefone (WhatsApp/Twilio)
- **Perfil:** Integração opcional com Google Calendar para sincronizar marcações
