import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <AppBar position="static" color="primary" elevation={0}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    ResearchFinder
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        color="inherit"
                        startIcon={<SearchIcon />}
                        onClick={() => navigate('/')}
                        sx={{
                            backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<BookmarkIcon />}
                        onClick={() => navigate('/saved')}
                        sx={{
                            backgroundColor: location.pathname === '/saved' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                        }}
                    >
                        Saved Articles
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
