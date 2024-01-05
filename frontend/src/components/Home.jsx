import React, { useState } from 'react';
import { Typography, Button, List, ListItem } from '@mui/material';
import CreateGame from './CreateGame';
import { Link } from 'react-router-dom';

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
            <Typography variant="h1">Home Screen</Typography>
            <List>
                <ListItem>
                    <Button variant="contained" onClick={handleOpenCreateGameModal}>
                        Create Game
                    </Button>
                </ListItem>
                <ListItem>
                    <Button variant="contained" component={Link} to="/join">
                        Join Game
                    </Button>
                </ListItem>
            </List>

            <CreateGame
                open={isCreateGameModalOpen}
                handleClose={handleCloseCreateGameModal}
            />
        </div>
    );
};

export default Home;
