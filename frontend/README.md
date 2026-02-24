# Frontend - Railway Deploy

## Deploy no Railway

1. **Nova Service** → **GitHub Repo** → seleciona o repositório
2. **Settings** do serviço:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start` (serve dist em produção)
3. **Variables**:
   - `VITE_API_URL` = URL do backend (ex: `https://sistema-gestao-barbearia-production.up.railway.app`)
4. **Networking**: Ativa o domínio público para o frontend.

## Variável VITE_API_URL

Define a URL do backend **sem** barra final. Exemplos:
- `https://sistema-gestao-barbearia-production.up.railway.app`
- `http://localhost:3000` (desenvolvimento local)

O frontend usa esta variável para todas as chamadas à API.
