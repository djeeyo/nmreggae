
@echo off
echo ========================================
echo NMREGGAE PROJECT FIX SCRIPT FOR WINDOWS
echo ========================================
echo.
echo This script will install missing dependencies and fix configuration issues.
echo Make sure you're running this from your nmreggae project root directory.
echo.
pause

echo Installing missing tailwindcss-animate dependency...
npm install tailwindcss-animate@^1.0.7

echo.
echo Installing/updating other dependencies...
npm install

echo.
echo Clearing npm cache to avoid potential issues...
npm cache clean --force

echo.
echo Installing latest Tailwind CSS v4 and related packages...
npm install tailwindcss@^4 @tailwindcss/postcss@^4

echo.
echo Rebuilding node_modules to ensure clean state...
rmdir /s /q node_modules 2>nul
rmdir /s /q .next 2>nul
npm install

echo.
echo Running build test to verify fixes...
npm run build

echo.
echo ========================================
echo FIX SCRIPT COMPLETED!
echo ========================================
echo.
echo If the build was successful, your project is now fixed.
echo You can now run: npm run dev
echo.
pause
