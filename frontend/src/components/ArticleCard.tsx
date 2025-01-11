import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Link,
  Box,
  Chip,
  Button,
  Collapse,
} from '@mui/material';
import { Article } from '../types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [showAbstract, setShowAbstract] = useState(false);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {article.title}
        </Typography>
        
        <Typography color="textSecondary" gutterBottom>
          {article.authors.join(', ')}
        </Typography>

        <Link href={article.url} target="_blank" rel="noopener noreferrer" 
          sx={{ display: 'block', mb: 1, wordBreak: 'break-all' }}>
          {article.url}
        </Link>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1, mb: 1 }}>
          <Chip 
            label={article.source} 
            size="small" 
            color={article.source.toLowerCase() === 'pubmed' ? 'primary' : 'secondary'}
          />
          {article.publishedDate && (
            <Typography variant="body2" color="textSecondary">
              Published: {new Date(article.publishedDate).toLocaleDateString()}
            </Typography>
          )}
          {article.citations !== undefined && (
            <Typography variant="body2" color="textSecondary">
              Citations: {article.citations}
            </Typography>
          )}
        </Box>

        {article.abstract && (
          <>
            <Button
              onClick={() => setShowAbstract(!showAbstract)}
              endIcon={showAbstract ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              size="small"
              sx={{ mb: 1 }}
            >
              {showAbstract ? 'Hide Abstract' : 'Show Abstract'}
            </Button>
            <Collapse in={showAbstract}>
              <Typography variant="body2" color="text.secondary" paragraph>
                {article.abstract}
              </Typography>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
};
