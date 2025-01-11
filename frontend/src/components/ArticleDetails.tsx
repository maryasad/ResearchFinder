import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Grid,
    Paper,
    Link,
    Divider,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { ArticleDetails as ArticleDetailsType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ArticleDetailsProps {
    article: ArticleDetailsType;
    open: boolean;
    onClose: () => void;
}

export const ArticleDetails = ({ article, open, onClose }: ArticleDetailsProps) => {
    const handleCopyLink = () => {
        navigator.clipboard.writeText(article.url);
        // You might want to add a snackbar notification here
    };

    const renderMetrics = () => (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Metrics</Typography>
            <Grid container spacing={2}>
                {article.metrics?.citationCount !== undefined && (
                    <Grid item xs={4}>
                        <Typography variant="h4" align="center">{article.metrics.citationCount}</Typography>
                        <Typography variant="body2" align="center">Citations</Typography>
                    </Grid>
                )}
                {article.metrics?.downloadCount !== undefined && (
                    <Grid item xs={4}>
                        <Typography variant="h4" align="center">{article.metrics.downloadCount}</Typography>
                        <Typography variant="body2" align="center">Downloads</Typography>
                    </Grid>
                )}
                {article.impactFactor !== undefined && (
                    <Grid item xs={4}>
                        <Typography variant="h4" align="center">{article.impactFactor.toFixed(2)}</Typography>
                        <Typography variant="body2" align="center">Impact Factor</Typography>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );

    const renderCitationChart = () => {
        if (!article.citations_per_year) return null;

        const data = Object.entries(article.citations_per_year).map(([year, count]) => ({
            year,
            citations: count,
        }));

        return (
            <Paper sx={{ p: 2, mb: 2, height: 300 }}>
                <Typography variant="h6" gutterBottom>Citations Over Time</Typography>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="citations" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{article.title}</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            
            <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {article.authors.join(', ')}
                    </Typography>
                    {article.journal && (
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {article.journal} {article.volume && `• Volume ${article.volume}`} 
                            {article.issue && `• Issue ${article.issue}`}
                            {article.pages && `• Pages ${article.pages}`}
                        </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                        <Chip 
                            label={article.source} 
                            color="primary" 
                            size="small" 
                            sx={{ mr: 1 }} 
                        />
                        {article.publishedDate && (
                            <Chip 
                                label={new Date(article.publishedDate).getFullYear()} 
                                variant="outlined" 
                                size="small" 
                            />
                        )}
                    </Box>
                </Box>

                {/* Metrics Section */}
                {renderMetrics()}

                {/* Citation Chart */}
                {renderCitationChart()}

                {/* Abstract */}
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Abstract</Typography>
                    <Typography variant="body1" paragraph>
                        {article.abstract}
                    </Typography>
                </Paper>

                {/* Keywords */}
                {article.keywords && article.keywords.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>Keywords</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {article.keywords.map((keyword, index) => (
                                <Chip key={index} label={keyword} variant="outlined" size="small" />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* References */}
                {article.references && article.references.length > 0 && (
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>References</Typography>
                        <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                            {article.references.map((ref, index) => (
                                <Typography key={index} variant="body2" paragraph>
                                    {index + 1}. {ref}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                {article.doi && (
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
                        DOI: {article.doi}
                    </Typography>
                )}
                <Button
                    startIcon={<ShareIcon />}
                    onClick={handleCopyLink}
                >
                    Share
                </Button>
                {article.pdf_url && (
                    <Button
                        startIcon={<DownloadIcon />}
                        href={article.pdf_url}
                        target="_blank"
                    >
                        Download PDF
                    </Button>
                )}
                <Button
                    variant="contained"
                    startIcon={<OpenInNewIcon />}
                    href={article.url}
                    target="_blank"
                >
                    View Source
                </Button>
            </DialogActions>
        </Dialog>
    );
};
