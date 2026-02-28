@echo off
echo Creating PostgreSQL database for ASAGUS Admin Panel...
echo.

REM Try different PostgreSQL versions
set PSQL_PATH=

if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\16\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\15\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\14\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\13\bin\psql.exe

if "%PSQL_PATH%"=="" (
    echo ERROR: PostgreSQL not found in standard locations!
    echo Please run this command manually in Command Prompt:
    echo.
    echo psql -U postgres -c "CREATE DATABASE asagus_admin;"
    echo.
    pause
    exit /b 1
)

echo Found PostgreSQL at: %PSQL_PATH%
echo.

REM Set password and create database
set PGPASSWORD=Gang$ter111

"%PSQL_PATH%" -U postgres -h localhost -c "DROP DATABASE IF EXISTS asagus_admin;"
"%PSQL_PATH%" -U postgres -h localhost -c "CREATE DATABASE asagus_admin;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database created successfully!
    echo.
) else (
    echo.
    echo ✗ Failed to create database. Check your password and PostgreSQL service.
    echo.
)

pause
