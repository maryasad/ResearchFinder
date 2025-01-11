from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
import requests
import math
from datetime import datetime

from scrapers import search_pubmed, search_arxiv

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    sources: List[str]
    maxResults: int = 10
    startYear: Optional[str] = None
    endYear: Optional[str] = None
    sortBy: str = "relevance"
    sortOrder: str = "desc"

def calculate_ranking(article: Dict[str, Any]) -> float:
    """Calculate article ranking based on citations and recency"""
    try:
        citations = article.get("citations", 0)
        pub_date_str = article.get("publishedDate", "")
        
        citation_score = math.log(citations + 1) / 10
        
        recency_score = 0
        if pub_date_str:
            try:
                pub_date = datetime.strptime(pub_date_str[:10], "%Y-%m-%d")
                days_old = (datetime.now() - pub_date).days
                recency_score = 1.0 / (days_old + 1)
            except:
                pass
        
        return (citation_score * 0.7) + (recency_score * 0.3)
    except Exception as e:
        print(f"Error calculating ranking: {str(e)}")
        return 0

def filter_by_date(articles: List[Dict[str, Any]], start_year: Optional[str], end_year: Optional[str]) -> List[Dict[str, Any]]:
    """Filter articles by date range"""
    if not start_year and not end_year:
        return articles
    
    filtered = []
    for article in articles:
        pub_date = article.get("publishedDate", "")
        if not pub_date:
            continue
        
        try:
            year = int(pub_date[:4])
            if start_year and year < int(start_year):
                continue
            if end_year and year > int(end_year):
                continue
            filtered.append(article)
        except:
            continue
    
    return filtered

def sort_articles(articles: List[Dict[str, Any]], sort_by: str, sort_order: str) -> List[Dict[str, Any]]:
    """Sort articles based on specified criteria"""
    reverse = sort_order.lower() == "desc"
    
    if sort_by == "citations":
        articles.sort(key=lambda x: x.get("citations", 0), reverse=reverse)
    elif sort_by == "date":
        articles.sort(key=lambda x: x.get("publishedDate", ""), reverse=reverse)
    else:  # relevance
        articles.sort(key=lambda x: x.get("ranking", 0), reverse=True)
    
    return articles

@app.post("/search")
async def search_articles(request: SearchRequest):
    """Search for articles across multiple sources"""
    try:
        all_articles = []
        sources = [s.lower() for s in request.sources]
        
        if "pubmed" in sources or "all" in sources:
            try:
                pubmed_articles = search_pubmed(request.query, request.maxResults * 2)  # Get more to allow for filtering
                all_articles.extend(pubmed_articles)
            except Exception as e:
                print(f"PubMed search error: {str(e)}")
        
        if "arxiv" in sources or "all" in sources:
            try:
                arxiv_articles = search_arxiv(request.query, request.maxResults * 2)  # Get more to allow for filtering
                all_articles.extend(arxiv_articles)
            except Exception as e:
                print(f"arXiv search error: {str(e)}")
        
        # Calculate ranking for each article
        for article in all_articles:
            article["ranking"] = calculate_ranking(article)
        
        # Filter by date
        all_articles = filter_by_date(all_articles, request.startYear, request.endYear)
        
        # Sort articles
        all_articles = sort_articles(all_articles, request.sortBy, request.sortOrder)
        
        # Return top results
        return {
            "articles": all_articles[:request.maxResults],
            "total": len(all_articles)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing search: {str(e)}"
        )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
