import React, { useState } from 'react';
import { Typography, Button, Grid, Box } from '@mui/material';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';
import ResolveGame from './ResolveGame';
import TimeoutModal from './TimeoutModal';
import { Link } from 'react-router-dom';

const Home = () => {
    const [isCreateGameModalOpen, setCreateGameModalOpen] = useState(false);
    const [isJoinGameModalOpen, setJoinGameModalOpen] = useState(false);
    const [isResolveGameModalOpen, setResolveGameModalOpen] = useState(false);
    const [j1TimeoutOpen, setJ1TimeoutOpen] = useState(false);

    const handleOpenCreateGameModal = () => {
        setCreateGameModalOpen(true);
    };

    const handleCloseCreateGameModal = () => {
        setCreateGameModalOpen(false);
    };

    const handleOpenJoinGameModal = () => {
        setJoinGameModalOpen(true);
    };

    const handleCloseJoinGameModal = () => {
        setJoinGameModalOpen(false);
    };

    const handleOpenResolveGameModal = () => {
        setResolveGameModalOpen(true);
    };

    const handleCloseResolveGameModal = () => {
        setResolveGameModalOpen(false);
    };

    const handleTimeoutOpen = () => {
        setJ1TimeoutOpen(true);
    };

    const handleTimeoutClose = () => {
        setJ1TimeoutOpen(false);
    };

    return (
        <div>
            <Typography variant="h3" style={{ marginBottom: '20px' }}>
                Welcome to Rock, Paper, Scissors, Spock, Lizard Game Center
            </Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                {[1, 2, 3, 4].map((index) => (
                    <Grid key={index} item xs={12} md={6}>
                        <Box
                            border={1}
                            p={2}
                            borderRadius={5}
                            height="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            marginBottom={2}
                        >
                            <Button
                                variant="contained"
                                color={index === 1 ? 'primary' : index === 2 ? 'secondary' : index === 3 ? 'info' : 'warning'}
                                size="large"
                                fullWidth
                                onClick={
                                    index === 1
                                        ? handleOpenCreateGameModal
                                        : index === 2
                                            ? handleOpenJoinGameModal
                                            : index === 3
                                                ? handleOpenResolveGameModal
                                                : handleTimeoutOpen
                                }
                            >
                                {index === 1
                                    ? 'Start a New Game'
                                    : index === 2
                                        ? 'Join an Existing Game'
                                        : index === 3
                                            ? 'Resolve an Ongoing Game'
                                            : 'Timeout Resolution'}
                            </Button>
                            <Typography variant="body1" style={{ marginLeft: '10px' }}>
                                {index === 1
                                    ? 'Challenge someone by creating a new game. Select your move and wait for an opponent to join.'
                                    : index === 2
                                        ? 'Enter a game ID to join an ongoing challenge. Make your move and see who wins!'
                                        : index === 3
                                            ? 'Provide details to resolve an ongoing challenge. Ensure fair play and determine the winner.'
                                            : 'Resolve a game due to timeout by entering the game ID. Address situations where players couldn\'t make a move in time.'}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <CreateGame open={isCreateGameModalOpen} handleClose={handleCloseCreateGameModal} />

            <JoinGame open={isJoinGameModalOpen} handleClose={handleCloseJoinGameModal} />

            <ResolveGame open={isResolveGameModalOpen} handleClose={handleCloseResolveGameModal} />
            <TimeoutModal open={j1TimeoutOpen} handleClose={handleTimeoutClose} />
        </div>
    );
};

export default Home;
