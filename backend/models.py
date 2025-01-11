from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from database import Base

# Association table for user's saved articles
saved_articles = Table(
    'saved_articles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('article_id', Integer, ForeignKey('articles.id')),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    saved_articles = relationship("Article", secondary=saved_articles, back_populates="saved_by")
    collections = relationship("Collection", back_populates="user")

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    authors = Column(String)  # Stored as JSON string
    abstract = Column(String)
    url = Column(String)
    source = Column(String)
    published_date = Column(DateTime)
    doi = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    saved_by = relationship("User", secondary=saved_articles, back_populates="saved_articles")
    collections = relationship("Collection", secondary="collection_articles", back_populates="articles")

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="collections")
    articles = relationship("Article", secondary="collection_articles", back_populates="collections")

# Association table for collections and articles
collection_articles = Table(
    'collection_articles',
    Base.metadata,
    Column('collection_id', Integer, ForeignKey('collections.id')),
    Column('article_id', Integer, ForeignKey('articles.id')),
)
