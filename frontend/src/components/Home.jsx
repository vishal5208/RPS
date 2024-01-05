import React, { useState } from 'react';
import { Typography, Button, List, ListItem } from '@mui/material';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';
import ResolveGame from './ResolveGame';
import J1TimeoutModal from './J1TimeoutModal';
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

    const handleOpenResolveGameModal = (gameId) => {

        setResolveGameModalOpen(true);
    };

    const handleCloseResolveGameModal = () => {

        setResolveGameModalOpen(false);
    };

    const handleJ1TimeoutOpen = () => {
        setJ1TimeoutOpen(true);
    };

    const handleJ1TimeoutClose = () => {
        setJ1TimeoutOpen(false);
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
                <Button variant="contained" onClick={() => handleOpenResolveGameModal(1)}>
                    Resolve Game
                </Button>

                <Button variant="contained" onClick={handleJ1TimeoutOpen}>
                    J1 Timeout
                </Button>
            </List>

            <CreateGame
                open={isCreateGameModalOpen}
                handleClose={handleCloseCreateGameModal}
            />

            <JoinGame
                open={isJoinGameModalOpen}
                handleClose={handleCloseJoinGameModal}
            />

            <ResolveGame
                open={isResolveGameModalOpen}
                handleClose={handleCloseResolveGameModal}
            />
            <J1TimeoutModal open={j1TimeoutOpen} handleClose={handleJ1TimeoutClose} />

        </div>


    );
};

export default Home;
