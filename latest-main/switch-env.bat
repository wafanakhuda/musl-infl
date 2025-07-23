@echo off
setlocal

if "%1"=="" (
    echo ❌ Please specify an environment: dev, prod, or staging
    echo Usage: switch-env.bat ^<environment^>
    echo Examples:
    echo   switch-env.bat dev
    echo   switch-env.bat prod
    echo   switch-env.bat staging
    exit /b 1
)

set ENV_ARG=%1
if /i "%ENV_ARG%"=="dev" set ENV_FILE=.env.development
if /i "%ENV_ARG%"=="development" set ENV_FILE=.env.development
if /i "%ENV_ARG%"=="prod" set ENV_FILE=.env.production
if /i "%ENV_ARG%"=="production" set ENV_FILE=.env.production
if /i "%ENV_ARG%"=="staging" set ENV_FILE=.env.staging

if "%ENV_FILE%"=="" (
    echo ❌ Unknown environment: %ENV_ARG%
    echo Available environments: dev, prod, staging
    exit /b 1
)

if not exist "%ENV_FILE%" (
    echo ❌ Environment file '%ENV_FILE%' not found!
    exit /b 1
)

if exist ".env.local" (
    set BACKUP_FILE=.env.local.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%
    set BACKUP_FILE=%BACKUP_FILE: =0%
    copy ".env.local" "%BACKUP_FILE%" >nul
    echo 📋 Backed up current .env.local to %BACKUP_FILE%
)

copy "%ENV_FILE%" ".env.local" >nul
echo ✅ Successfully switched to %ENV_ARG% environment!
echo 📁 Copied %ENV_FILE% → .env.local
