@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@REM Begin all REM lines with '@' in case MAVEN_BATCH_ECHO is 'on'
@echo off
@REM set title of command prompt window
title %0
@REM enable echoing by setting MAVEN_BATCH_ECHO to 'on'
@if "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@REM set %HOME% to equivalent of $HOME
if "%HOME%" == "" (set "HOME=%USERPROFILE%")

@REM Execute a user defined script before this one
if not "%MAVEN_SKIP_RC%" == "" goto skipRcPre
@REM check for .mavenrc in %HOME%
if exist "%HOME%\.mavenrc" call "%HOME%\.mavenrc"
@REM check for mavenrc.cmd in %HOME%
if exist "%HOME%\mavenrc.cmd" call "%HOME%\mavenrc.cmd"
:skipRcPre

@setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible wrapper scripts, use a fixed variable name
@REM set MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
@if "%MAVEN_PROJECTBASEDIR%" == "" set MAVEN_PROJECTBASEDIR=%~dp0
@if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

@REM Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current working directory if not found.

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

set "DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

if exist "%WRAPPER_JAR%" goto run

echo Window PowerShell is required to download the Maven wrapper jar.

set "WRAPPER_DIR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper"
if not exist "%WRAPPER_DIR%" (
    mkdir "%WRAPPER_DIR%"
)

powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%') }"

:run
set "MAVEN_CMD_LINE_ARGS=%*"
"%JAVA_HOME%\bin\java.exe" %MAVEN_OPTS% -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -classpath "%WRAPPER_JAR%" %WRAPPER_LAUNCHER% %MAVEN_CMD_LINE_ARGS%
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%

if not "%MAVEN_SKIP_RC%" == "" goto skipRcPost
@REM check for .mavenrc in %HOME%
if exist "%HOME%\.mavenrc" call "%HOME%\.mavenrc"
@REM check for mavenrc.cmd in %HOME%
if exist "%HOME%\mavenrc.cmd" call "%HOME%\mavenrc.cmd"
:skipRcPost

@if "%MAVEN_BATCH_PAUSE%" == "on" pause

if "%MAVEN_TERMINATE_CMD%" == "on" exit %ERROR_CODE%

exit /b %ERROR_CODE%
