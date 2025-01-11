import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ArticleCard } from '../components/ArticleCard';
import { SearchFiltersComponent } from '../components/SearchFilters';
import { Article, SearchFilters } from '../types';
import { searchArticles } from '../services/api';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    sources: ['PubMed', 'arXiv'],
    sortBy: 'relevance',
    sortOrder: 'desc',
    maxResults: 10,
    startYear: '2024',
    endYear: '2025'
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchArticles(searchQuery, filters);
      setArticles(response.articles);
      if (response.articles.length === 0) {
        setError('No articles found. Try different search terms.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch articles. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Research Paper Finder
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Search for academic papers across PubMed and arXiv
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your search query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            disabled={loading}
          >
            Search
          </Button>
        </Box>

        <SearchFiltersComponent
          filters={filters}
          onFilterChange={setFilters}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} key={article.id}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
