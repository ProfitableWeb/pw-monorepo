# ProfitableWeb API

FastAPI backend for ProfitableWeb Research Lab.

## Tech Stack

- **FastAPI** - Modern async Python web framework
- **SQLAlchemy 2.0** - ORM with async support
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **uv** - Fast Python package manager
- **Ruff** - Fast Python linter
- **Pytest** - Testing framework

## Development

```bash
# Install dependencies
uv sync

# Run dev server
uv run uvicorn main:app --reload

# Or use Turborepo from root
bun turbo dev --filter=@profitable-web/api
```

## Project Structure

```
apps/api/
├── src/
│   ├── main.py          # FastAPI app entry point
│   ├── api/             # API routes
│   ├── core/            # Core config, security
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   └── services/        # Business logic
├── tests/
├── pyproject.toml
└── README.md
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
