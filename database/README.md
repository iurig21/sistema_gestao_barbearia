# SQL Server 2017 - Railway Deployment

Dockerfile para fazer deploy do SQL Server 2017 no Railway. Usa a imagem 2017 (que corre como root) para evitar problemas de permissões com volumes montados.

## Deploy no Railway

1. **Nova Service** → **GitHub Repo** → seleciona este repositório
2. **Settings** do serviço:
   - **Root Directory**: `database`
   - **Dockerfile Path**: `Dockerfile` (ou deixa em branco para usar o default)
3. **Volumes** → Add Volume → montar em `/var/opt/mssql`
4. **Variables**:
   - `ACCEPT_EULA` = `Y`
   - `MSSQL_SA_PASSWORD` = senha forte (8+ chars, maiúsculas, minúsculas, números, símbolos)
   - `MSSQL_MEMORY_LIMIT_MB` = `1536` (**obrigatório** – SQL Server deteta a RAM do host e crasha por OOM sem este limite)
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

## Se continuar a crashar

- **OOM/crash após alguns segundos**: Confirma que `MSSQL_MEMORY_LIMIT_MB=1536` está definido. Sem isto, o SQL Server usa 80% da RAM do host e o OOM killer encerra o contentor.
- **Permission denied**: Remove o volume atual (Settings → Volumes) e adiciona um novo.
