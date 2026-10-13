@REM Maven wrapper script for Windows
@echo off
setlocal

set MAVEN_CMD=mvn
where mvn >nul 2>&1
if %ERRORLEVEL% equ 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

if exist "%USERPROFILE%\.maven\apache-maven-3.9.9\bin\mvn.cmd" (
    call "%USERPROFILE%\.maven\apache-maven-3.9.9\bin\mvn.cmd" %*
    exit /b
)

echo [ERROR] Maven not found. Please install Apache Maven or verify Java installation.
exit /b 1
