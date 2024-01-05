import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Home from './components/Home';
import Wallet from './components/Wallet/Wallet';

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', md: '1.5rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    🚀 RockPaper Game
                  </Typography>
                </Link>
              </Box>

            </Link>
          </Box>
          <Wallet />
        </Toolbar>
      </AppBar>

      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
