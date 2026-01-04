"""
ProfitableWeb API - FastAPI Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ProfitableWeb API",
    description="Backend API for ProfitableWeb Research Lab",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "ProfitableWeb API",
        "version": "0.1.0",
        "status": "operational",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/api/articles")
async def get_articles():
    """Get all articles (mock data)"""
    return {
        "data": [
            {
                "id": "1",
                "title": "Первая статья",
                "slug": "first-article",
                "excerpt": "Описание первой статьи",
                "category": "tutorials",
                "tags": ["python", "fastapi"],
                "publishedAt": "2026-01-03T12:00:00Z",
            }
        ],
        "meta": {"total": 1, "page": 1, "limit": 10},
    }
