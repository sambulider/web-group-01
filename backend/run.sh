#!/bin/bash
# Quick start script for the FastAPI backend

set -e

echo "🚀 American Corner Management System - Backend Setup"
echo "=================================================="

# Check Python version
echo "✓ Checking Python version..."
python_version=$(python --version 2>&1 | awk '{print $2}')
echo "  Python: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "✓ Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "✓ Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate

# Install/upgrade pip
echo "✓ Installing pip dependencies..."
pip install --upgrade pip setuptools wheel

# Install requirements
echo "✓ Installing project requirements..."
pip install -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "✓ Creating .env file from template..."
    cp .env.example .env
    echo "  ⚠️  IMPORTANT: Edit .env with your configuration!"
fi

# Initialize database
echo "✓ Initializing database..."
if command -v alembic &> /dev/null; then
    alembic upgrade head
else
    echo "  ⚠️  Alembic not found. Run migrations manually:"
    echo "     alembic upgrade head"
fi

# Display startup information
echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file with your database URL and secret key"
echo "2. Run the development server: uvicorn app.main:app --reload"
echo "3. Visit http://localhost:8000 in your browser"
echo "4. API docs available at http://localhost:8000/docs"
echo ""
echo "🐳 Or use Docker:"
echo "   docker-compose up -d"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: see SETUP.md"
echo "   - API Docs: see API_DOCS.md"
echo "   - README: see README.md"
echo ""
