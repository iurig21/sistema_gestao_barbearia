# SQL Server 2019 - Railway Deployment

Dockerfile para fazer deploy do SQL Server 2019 no Railway. Usa a imagem 2019 em vez da 2022 para evitar problemas de permissões com volumes.

## Deploy no Railway

1. **Nova Service** → **GitHub Repo** → seleciona este repositório
2. **Settings** do serviço:
   - **Root Directory**: `database`
   - **Dockerfile Path**: `Dockerfile` (ou deixa em branco para usar o default)
3. **Volumes** → Add Volume → montar em `/var/opt/mssql`
4. **Variables**:
   - `ACCEPT_EULA` = `Y`
   - `MSSQL_SA_PASSWORD` = senha forte (8+ chars, maiúsculas, minúsculas, números, símbolos)
   - `MSSQL_PID` = `Developer` (opcional, default é Developer)
5. **Settings** → **Networking** → TCP Proxy na porta `1433`
6. Guarda o host e porta gerados para usar no backend como `DB_SERVER`

## Variáveis do Backend

No serviço do backend, configura:

- `DB_SERVER` = host do SQL Server (ex: `maglev.proxy.rlwy.net`)
- `DB_USER` = `sa`
- `DB_PASSWORD` = valor de `MSSQL_SA_PASSWORD`
- `DB_DATABASE` = `trabalhopratico`

Cria a base de dados `trabalhopratico` no SQL Server depois do primeiro deploy.
