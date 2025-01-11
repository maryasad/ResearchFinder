import requests
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
import json
from datetime import datetime
import time

def get_semantic_scholar_citations(title: str, authors: List[str]) -> int:
    """Get citation count from Semantic Scholar API"""
    try:
        # Create a query string from title and first author
        query = f"{title}"
        
        # Search Semantic Scholar
        url = "https://api.semanticscholar.org/graph/v1/paper/search"
        params = {
            "query": query,
            "fields": "citationCount,title,authors",
            "limit": 5
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Check if we found matching papers
        if data.get("data") and len(data["data"]) > 0:
            # Try to find exact title match
            for paper in data["data"]:
                if paper["title"].lower().strip() == title.lower().strip():
                    return paper.get("citationCount", 0)
            
            # If no exact match, return the first result's citation count
            return data["data"][0].get("citationCount", 0)
        
        return 0
    except Exception as e:
        print(f"Error fetching Semantic Scholar citations: {str(e)}")
        return 0

def format_article(article_data: Dict[str, Any], source: str) -> Dict[str, Any]:
    """Format article data into a common structure"""
    return {
        "id": article_data.get("id", ""),
        "title": article_data.get("title", ""),
        "authors": article_data.get("authors", []),
        "abstract": article_data.get("abstract", ""),
        "url": article_data.get("url", ""),
        "source": source,
        "publishedDate": article_data.get("publishedDate", ""),
        "citations": article_data.get("citations", 0)
    }

def search_pubmed(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """Search PubMed for articles"""
    try:
        base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
        
        # Search for articles
        search_url = f"{base_url}/esearch.fcgi"
        search_params = {
            "db": "pubmed",
            "term": query,
            "retmax": max_results,
            "retmode": "json"
        }
        
        response = requests.get(search_url, params=search_params)
        response.raise_for_status()
        search_data = response.json()
        
        if not search_data["esearchresult"]["idlist"]:
            return []
        
        # Get full article data
        fetch_url = f"{base_url}/efetch.fcgi"
        fetch_params = {
            "db": "pubmed",
            "id": ",".join(search_data["esearchresult"]["idlist"]),
            "retmode": "xml",
            "rettype": "abstract"
        }
        
        fetch_response = requests.get(fetch_url, fetch_params)
        fetch_response.raise_for_status()
        
        articles = []
        root = ET.fromstring(fetch_response.text)
        
        for article in root.findall(".//PubmedArticle"):
            try:
                # Extract article data
                pmid = article.find(".//PMID").text
                title_elem = article.find(".//ArticleTitle")
                title = title_elem.text if title_elem is not None else ""
                
                # Get authors
                authors = []
                author_list = article.findall(".//Author")
                for author in author_list:
                    lastname = author.find("LastName")
                    firstname = author.find("ForeName")
                    if lastname is not None and firstname is not None:
                        authors.append(f"{firstname.text} {lastname.text}")
                
                # Get abstract
                abstract = ""
                abstract_texts = article.findall(".//Abstract/AbstractText")
                if abstract_texts:
                    abstract = " ".join(text.text for text in abstract_texts if text.text)
                
                # Get publication date
                pub_date = article.find(".//PubDate")
                year = pub_date.find("Year")
                month = pub_date.find("Month")
                day = pub_date.find("Day")
                
                pub_date_str = ""
                if year is not None:
                    pub_date_str = f"{year.text}"
                    if month is not None:
                        pub_date_str = f"{pub_date_str}-{month.text.zfill(2)}"
                        if day is not None:
                            pub_date_str = f"{pub_date_str}-{day.text.zfill(2)}"
                
                article_data = {
                    "id": f"pubmed_{pmid}",
                    "title": title,
                    "authors": authors,
                    "abstract": abstract,
                    "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                    "publishedDate": pub_date_str,
                    "citations": get_semantic_scholar_citations(title, authors)
                }
                
                articles.append(format_article(article_data, "PubMed"))
                
            except Exception as e:
                print(f"Error processing PubMed article: {str(e)}")
                continue
        
        return articles
        
    except Exception as e:
        print(f"PubMed search error: {str(e)}")
        return []

def search_arxiv(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """Search arXiv for articles"""
    try:
        base_url = "http://export.arxiv.org/api/query"
        params = {
            "search_query": f"all:{query}",
            "start": 0,
            "max_results": max_results,
            "sortBy": "relevance",
            "sortOrder": "descending"
        }
        
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        
        root = ET.fromstring(response.text)
        articles = []
        
        for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
            try:
                # Extract article data
                title = entry.find("{http://www.w3.org/2005/Atom}title").text
                abstract = entry.find("{http://www.w3.org/2005/Atom}summary").text
                url = entry.find("{http://www.w3.org/2005/Atom}id").text
                published = entry.find("{http://www.w3.org/2005/Atom}published").text
                
                # Get authors
                authors = []
                for author in entry.findall("{http://www.w3.org/2005/Atom}author"):
                    name = author.find("{http://www.w3.org/2005/Atom}name").text
                    authors.append(name)
                
                article_data = {
                    "id": f"arxiv_{url.split('/')[-1]}",
                    "title": title,
                    "authors": authors,
                    "abstract": abstract,
                    "url": url,
                    "publishedDate": published[:10],
                    "citations": get_semantic_scholar_citations(title, authors)
                }
                
                articles.append(format_article(article_data, "arXiv"))
                
            except Exception as e:
                print(f"Error processing arXiv article: {str(e)}")
                continue
        
        return articles
        
    except Exception as e:
        print(f"arXiv search error: {str(e)}")
        return []
