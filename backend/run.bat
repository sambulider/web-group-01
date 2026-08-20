@echo off
REM Quick start script for the FastAPI backend (Windows)

echo.
echo 🚀 American Corner Management System - Backend Setup
echo ==================================================
echo.

REM Check Python version
echo ✓ Checking Python version...
python --version

REM Create virtual environment if it doesn't exist
if not exist "venv\" (
    echo ✓ Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo ✓ Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/upgrade pip
echo ✓ Installing pip dependencies...
python -m pip install --upgrade pip setuptools wheel

REM Install requirements
echo ✓ Installing project requirements...
pip install -r requirements.txt

REM Create .env if it doesn't exist
if not exist ".env" (
    echo ✓ Creating .env file from template...
    copy .env.example .env
    echo   ⚠️  IMPORTANT: Edit .env with your configuration!
)

REM Initialize database
echo ✓ Initializing database...
where alembic >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    alembic upgrade head
) else (
    echo   ⚠️  Alembic not found. Run migrations manually:
    echo      alembic upgrade head
)

REM Display startup information
echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Edit .env file with your database URL and secret key
echo 2. Run the development server: uvicorn app.main:app --reload
echo 3. Visit http://localhost:8000 in your browser
echo 4. API docs available at http://localhost:8000/docs
echo.
echo 🐳 Or use Docker:
echo    docker-compose up -d
echo.
echo 📚 Documentation:
echo    - Setup Guide: see SETUP.md
echo    - API Docs: see API_DOCS.md
echo    - README: see README.md
echo.

pause
