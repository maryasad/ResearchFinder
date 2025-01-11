import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';

interface Article {
  id: number;
  title: string;
  authors: string;
  abstract: string;
  url: string;
  published_date: string;
}

const SavedArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedArticles();
    }
  }, [isAuthenticated]);

  const fetchSavedArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/articles/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(response.data);
    } catch (err) {
      setError('Failed to fetch saved articles');
    }
  };

  const handleRemoveArticle = async (articleId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/articles/saved/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(articles.filter(article => article.id !== articleId));
    } catch (err) {
      setError('Failed to remove article');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <Alert severity="warning">Please log in to view saved articles</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Saved Articles
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper elevation={2}>
        <List>
          {articles.map((article, index) => (
            <React.Fragment key={article.id}>
              {index > 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveArticle(article.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      {article.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {article.authors}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {article.abstract}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Published: {new Date(article.published_date).toLocaleDateString()}
                      </Typography>
                      <Typography
                        component="a"
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        color="primary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        View Article
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
          {articles.length === 0 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" color="text.secondary" align="center">
                    No saved articles yet
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default SavedArticles;
