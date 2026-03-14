@echo off
cd /d "C:\FAISAL DATA\RESEARCH\pythonScripts\FQ Website\fysalqayyum.github.io"
echo.
echo Pushing website changes to GitHub...
echo.
git add .
git commit -m "Update site - %date% %time%"
git push
echo.
echo Done! Your site will be live in ~60 seconds.
echo.
pause