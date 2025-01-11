import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { ArticleCard } from '../components/ArticleCard';
import { Article } from '../types';
import { getSavedArticles, removeSavedArticle } from '../services/api';

export const SavedArticles = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSavedArticles();
    }, []);

    const loadSavedArticles = async () => {
        try {
            setLoading(true);
            const savedArticles = await getSavedArticles();
            setArticles(savedArticles);
        } catch (err) {
            setError('Failed to load saved articles. Please try again.');
            console.error('Error loading saved articles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveArticle = async (article: Article) => {
        if (!article.id) return;
        
        try {
            await removeSavedArticle(article.id);
            setArticles(articles.filter(a => a.id !== article.id));
        } catch (err) {
            console.error('Error removing article:', err);
            // Handle error appropriately
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Saved Articles
            </Typography>

            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" gutterBottom>
                    {error}
                </Typography>
            )}

            {!loading && articles.length === 0 && (
                <Typography variant="body1" color="text.secondary" align="center">
                    No saved articles yet. Start searching and save articles you're interested in!
                </Typography>
            )}

            <Box sx={{ mt: 4 }}>
                {articles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        onSave={() => handleRemoveArticle(article)}
                        isSaved={true}
                    />
                ))}
            </Box>
        </Container>
    );
};
