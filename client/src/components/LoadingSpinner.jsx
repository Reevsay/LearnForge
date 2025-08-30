import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...', size = 40 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2
      }}
    >
      <CircularProgress 
        size={size} 
        sx={{ color: '#4ade80' }} 
      />
      <Typography variant="body1" sx={{ color: '#ccc' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
