@echo off
REM ================================
REM Verdleaf Docker Deployment Script (Windows)
REM ================================

setlocal enabledelayedexpansion

REM Colors (Windows 10+)
set "GREEN=[32m"
set "YELLOW=[33m"
set "RED=[31m"
set "BLUE=[34m"
set "NC=[0m"

REM Change to script directory
cd /d "%~dp0"

REM Main command handler
if "%1"=="" goto help
if "%1"=="build" goto build
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="migrate" goto migrate
if "%1"=="shell" goto shell
if "%1"=="status" goto status
if "%1"=="health" goto health
if "%1"=="clean" goto clean
if "%1"=="deploy" goto deploy
if "%1"=="help" goto help
goto help

:check_docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo %RED%Error: Docker is not installed%NC%
    exit /b 1
)
echo %GREEN%Docker is installed%NC%
goto :eof

:check_env
if not exist ".env" (
    if exist ".env.docker" (
        echo %YELLOW%Creating .env from .env.docker template...%NC%
        copy .env.docker .env
        echo %YELLOW%Please edit .env file with your values and run again.%NC%
        exit /b 1
    ) else (
        echo %RED%Error: .env file not found%NC%
        exit /b 1
    )
)
echo %GREEN%Environment file found%NC%
goto :eof

:build
echo.
echo %BLUE%======================================%NC%
echo %BLUE%Building Verdleaf Docker Image%NC%
echo %BLUE%======================================%NC%
echo.
call :check_docker
docker compose build --no-cache
echo %GREEN%Build completed%NC%
goto end

:start
echo.
echo %BLUE%======================================%NC%
echo %BLUE%Starting Verdleaf Services%NC%
echo %BLUE%======================================%NC%
echo.
call :check_docker
call :check_env
docker compose up -d
echo.
echo %GREEN%Verdleaf is running at: http://localhost:3000%NC%
echo.
goto end

:stop
echo.
echo %BLUE%======================================%NC%
echo %BLUE%Stopping Verdleaf Services%NC%
echo %BLUE%======================================%NC%
echo.
docker compose down
echo %GREEN%Services stopped%NC%
goto end

:restart
echo.
echo %BLUE%======================================%NC%
echo %BLUE%Restarting Verdleaf Services%NC%
echo %BLUE%======================================%NC%
echo.
docker compose restart
echo %GREEN%Services restarted%NC%
goto end

:logs
if "%2"=="" (
    docker compose logs -f app
) else (
    docker compose logs -f %2
)
goto end

:migrate
echo.
echo %BLUE%======================================%NC%
echo %BLUE%Running Database Migrations%NC%
echo %BLUE%======================================%NC%
echo.
call :check_docker
call :check_env
docker compose --profile migrate up migrate
echo %GREEN%Migrations completed%NC%
goto end

:shell
docker compose exec app sh
goto end

:status
echo.
echo %BLUE%======================================%NC%
echo %BLUE%Verdleaf Service Status%NC%
echo %BLUE%======================================%NC%
echo.
docker compose ps
goto end

:health
echo.
echo %BLUE%======================================%NC%
echo %BLUE%Health Check%NC%
echo %BLUE%======================================%NC%
echo.
docker compose exec db pg_isready -U verdleaf >nul 2>nul
if %errorlevel% equ 0 (
    echo %GREEN%Database: Healthy%NC%
) else (
    echo %RED%Database: Unhealthy%NC%
)
curl -s http://localhost:3000 >nul 2>nul
if %errorlevel% equ 0 (
    echo %GREEN%Application: Healthy%NC%
) else (
    echo %RED%Application: Unhealthy or starting...%NC%
)
goto end

:clean
echo.
echo %BLUE%======================================%NC%
echo %BLUE%Cleaning Up%NC%
echo %BLUE%======================================%NC%
echo.
docker compose down -v --rmi all --remove-orphans
echo %GREEN%Cleanup completed%NC%
goto end

:deploy
echo.
echo %BLUE%======================================%NC%
echo %BLUE%Production Deployment%NC%
echo %BLUE%======================================%NC%
echo.
call :check_docker
call :check_env

REM Pull latest if git repo
if exist ".git" (
    echo %YELLOW%Pulling latest changes...%NC%
    git pull origin main
)

REM Build
call :build

REM Migrate
call :migrate

REM Start
docker compose up -d

REM Wait
echo.
echo %YELLOW%Waiting for application to be ready...%NC%
timeout /t 10 /nobreak >nul

REM Health check
call :health

echo.
echo %GREEN%Deployment Complete!%NC%
echo %GREEN%Verdleaf is running at: http://localhost:3000%NC%
echo.
goto end

:help
echo.
echo %BLUE%Verdleaf Docker Deployment Script%NC%
echo.
echo Usage: deploy.bat [command]
echo.
echo Commands:
echo   build       Build Docker images
echo   start       Start all services
echo   stop        Stop all services
echo   restart     Restart all services
echo   logs [svc]  View logs (default: app)
echo   migrate     Run database migrations
echo   shell       Open shell in app container
echo   status      Show service status
echo   health      Run health checks
echo   clean       Remove all containers, volumes, and images
echo   deploy      Full production deployment
echo   help        Show this help message
echo.
goto end

:end
endlocal
