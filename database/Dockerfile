# SQL Server 2017 - runs as root by default, avoids permission issues on Railway volumes
# (2019+ run as mssql user and fail with "Permission denied" on mounted volumes)
FROM mcr.microsoft.com/mssql/server:2017-latest

# Limit memory - SQL Server reads host RAM (300GB+) and crashes with OOM in containers
ENV MSSQL_MEMORY_LIMIT_MB=1536

EXPOSE 1433

# SQL Server reads ACCEPT_EULA, MSSQL_SA_PASSWORD, MSSQL_PID from env at runtime
