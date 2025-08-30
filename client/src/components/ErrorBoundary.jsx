import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleError = (error) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <Box
        sx={{
          backgroundColor: '#0a0a0a',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ color: '#ef4444', mb: 2 }}>
          Oops! Something went wrong
        </Typography>
        <Typography variant="body1" sx={{ color: '#ccc', mb: 4, maxWidth: 600 }}>
          We encountered an unexpected error. Please try refreshing the page or go back to the home page.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              backgroundColor: '#4ade80',
              color: 'black',
              '&:hover': { backgroundColor: '#22c55e' }
            }}
          >
            Refresh Page
          </Button>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{ color: '#4ade80', borderColor: '#4ade80' }}
          >
            Go Home
          </Button>
        </Box>
      </Box>
    );
  }

  return children;
};

export default ErrorBoundary;
