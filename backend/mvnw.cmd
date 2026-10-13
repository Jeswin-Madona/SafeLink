@REM Maven wrapper script for Windows
@echo off
setlocal

rem Validate or normalize JAVA_HOME
if not exist "%JAVA_HOME%\bin\java.exe" (
    if exist "%JAVA_HOME%\java.exe" (
        for %%D in ("%JAVA_HOME%\..") do set "JAVA_HOME=%%~fD"
    ) else if exist "C:\Java\jdk-21\bin\java.exe" (
        set "JAVA_HOME=C:\Java\jdk-21"
    ) else if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-21"
    )
)

where mvn >nul 2>&1
if %ERRORLEVEL% equ 0 (
    mvn %*
    goto end
)

if exist "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd" (
    call "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd" %*
    goto end
)

for /f "delims=" %%I in ('dir /b /s "%USERPROFILE%\.m2\wrapper\dists\mvn.cmd" 2^>nul') do (
    call "%%I" %*
    goto end
)

if exist "%USERPROFILE%\.maven\apache-maven-3.9.9\bin\mvn.cmd" (
    call "%USERPROFILE%\.maven\apache-maven-3.9.9\bin\mvn.cmd" %*
    goto end
)

echo [ERROR] Maven not found. Please install Apache Maven or verify Java installation.
exit /b 1

:end
exit /b %ERRORLEVEL%
