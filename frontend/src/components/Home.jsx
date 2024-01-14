import React, { useState } from 'react';
import { Typography, Button, Grid, Box } from '@mui/material';
import CreateGame from './CreateGame';
import GameInstructions from './GameInstructions';
import { green } from '@mui/material/colors';

import GameHistory from './GameHistory';

const Home = () => {
    const [isCreateGameModalOpen, setCreateGameModalOpen] = useState(false);

    const handleOpenCreateGameModal = () => {
        setCreateGameModalOpen(true);
    };

    const handleCloseCreateGameModal = () => {
        setCreateGameModalOpen(false);
    };

    return (
        <div>
            <Typography variant="h3" style={{ marginBottom: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Welcome to Rock, Paper, Scissors, Spock, Lizard Game Center
            </Typography>

            <GameInstructions />
            <div style={{ margin: '20px' }}></div>

            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Box
                        border={1}
                        p={2}
                        borderRadius={5}
                        height="150px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        marginBottom={2}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            onClick={handleOpenCreateGameModal}
                            style={{
                                fontSize: '1.2rem',
                                background: green[500],
                                color: 'white', // Text color is set to white
                            }}
                        >
                            Start a New Game
                        </Button>
                        <Typography variant="body1" style={{ marginLeft: '10px', fontSize: '1.2rem', lineHeight: '1.2', textAlign: 'center' }}>
                            Challenge someone by creating a new game. Select your move and wait for an opponent to join.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <CreateGame open={isCreateGameModalOpen} handleClose={handleCloseCreateGameModal} />
            <GameHistory />

        </div>
    );
};

export default Home;
