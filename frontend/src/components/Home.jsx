import React, { useState } from 'react';
import { Typography, Button, List, ListItem } from '@mui/material';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';
import { Link } from 'react-router-dom';

const Home = () => {
    const [isCreateGameModalOpen, setCreateGameModalOpen] = useState(false);
    const [isJoinGameModalOpen, setJoinGameModalOpen] = useState(false);


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
    return (
        <div>
            <Typography variant="h1">Home Screen</Typography>
            <List>
                <ListItem>
                    <Button variant="contained" onClick={handleOpenCreateGameModal}>
                        Create Game
                    </Button>
                </ListItem>
                <ListItem>
                    <Button variant="contained" onClick={handleOpenJoinGameModal}>
                        Join Game
                    </Button>
                </ListItem>
            </List>

            <CreateGame
                open={isCreateGameModalOpen}
                handleClose={handleCloseCreateGameModal}
            />

            <JoinGame
                open={isJoinGameModalOpen}
                handleClose={handleCloseJoinGameModal}
            />
        </div>
    );
};

export default Home;
