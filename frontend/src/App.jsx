import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';

function App() {


  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Rock Paper Scissors Lizard Spock Game</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create"
            element={<CreateGame />}
          />
          <Route
            path="/joinGame"
            element={<JoinGame />}
          />

        </Routes>
      </Container>
    </Router>
  )
}

export default App
