@echo off
REM mk_superuser.bat — Create a PocketBase superuser/admin account
REM Supported on: Windows Command Prompt (cmd.exe)

set CONTAINER_NAME=buddyup-pocketbase

if "%~1"=="" goto usage
if "%~2"=="" goto usage

set USER_INPUT=%~1
set PASSWORD=%~2

REM If input does not contain '@', append '@buddyup.com'
echo %USER_INPUT% | findstr /C:"@" >nul
if errorlevel 1 (
    set EMAIL=%USER_INPUT%@buddyup.com
    echo [i] Username formatted as email: %USER_INPUT%@buddyup.com
) else (
    set EMAIL=%USER_INPUT%
)

echo [*] Creating superuser '%EMAIL%' in container '%CONTAINER_NAME%'...

docker exec %CONTAINER_NAME% /pocketbase superuser create %EMAIL% %PASSWORD% --dir=/pb_data >nul 2>&1
if %errorlevel% equ 0 goto success

docker exec %CONTAINER_NAME% pocketbase superuser create %EMAIL% %PASSWORD% --dir=/pb_data >nul 2>&1
if %errorlevel% equ 0 goto success

docker exec %CONTAINER_NAME% /pocketbase admin create %EMAIL% %PASSWORD% --dir=/pb_data >nul 2>&1
if %errorlevel% equ 0 goto success

docker exec %CONTAINER_NAME% pocketbase admin create %EMAIL% %PASSWORD% --dir=/pb_data
if %errorlevel% equ 0 goto success

echo [!] Failed to create superuser. Ensure Docker container '%CONTAINER_NAME%' is running and password has at least 8 characters.
exit /b 1

:success
echo [✓] Superuser '%EMAIL%' successfully created!
echo.
echo You can now log in to the PocketBase Admin Panel at:
echo http://localhost:8090/_/
exit /b 0

:usage
echo ==========================================
echo   BuddyUp — PocketBase Superuser Creator  
echo ==========================================
echo Usage:
echo   mk_superuser.bat ^<username_or_email^> ^<password^>
echo.
echo Examples:
echo   mk_superuser.bat admin password123
echo   mk_superuser.bat admin@buddyup.com password123
echo ==========================================
exit /b 1
