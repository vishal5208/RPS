import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Home from './components/Home';
import Wallet from './components/Wallet/Wallet';

import { isConnected, checkNetwork, requestAccount, switchToGoerli } from './components/backendConnectors/rpsConnector';

function App() {
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  useEffect(() => {
    const handleAccountsChanged = async () => {
      try {
        const connectionResult = await isConnected();

        if (connectionResult.success) {
          setShowConnectDialog(false);
        } else {
          setShowConnectDialog(false);
          await requestAccount();
        }
      } catch (error) {
        console.log("error : ", error);
      }
    };

    const handleChainChanged = async () => {
      try {
        const connectionResult = await isConnected();

        if (!connectionResult.success) {
          setShowConnectDialog(true);
          await switchToGoerli();
        }
      } catch (error) {
        console.log("error : ", error);
      }
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);
    window.ethereum?.on("chainChanged", handleChainChanged);

    checkNetwork().then((result) => {
      if (!result.success) {
        setShowConnectDialog(true);
      }
    });

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const handleConnectToGoerli = async () => {
    try {
      const connectionResult = await isConnected();

      if (connectionResult.success) {
        setShowConnectDialog(false);
      } else {
        setShowConnectDialog(false);
        await requestAccount();
      }
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handleCancelConnect = () => {
    setShowConnectDialog(false);
  };

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

      {/* Connect to Goerli Dialog */}
      <Dialog open={showConnectDialog} onClose={handleCancelConnect}>
        <DialogTitle sx={{ backgroundColor: '#2196F3', color: 'white', padding: '12px' }}>
          Connect to Goerli
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: '#f5f5f5' }}>
          <Typography>
            To use this application, please connect to the Goerli network.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f5f5f5', justifyContent: 'space-between' }}>
          <Button onClick={handleConnectToGoerli} autoFocus variant="contained" color="primary">
            Connect to Goerli
          </Button>
          <Button onClick={handleCancelConnect} variant="contained" style={{ backgroundColor: 'red', color: 'white' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </Router>
  );
}

export default App;
