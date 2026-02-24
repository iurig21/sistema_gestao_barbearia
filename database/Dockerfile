# SQL Server 2019 - runs as root by default, avoids permission issues on Railway volumes
FROM mcr.microsoft.com/mssql/server:2019-latest

EXPOSE 1433

# SQL Server reads ACCEPT_EULA, MSSQL_SA_PASSWORD, MSSQL_PID from env at runtime
