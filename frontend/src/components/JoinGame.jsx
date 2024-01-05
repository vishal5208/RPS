import React, { useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const JoinGame = () => {
    const [gameId, setGameId] = useState('');
    const [selectedMove, setSelectedMove] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');

    const handleSubmit = () => {

    };

    return (
        <div>
            <Typography variant="h1">Join Game</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Game ID / Opponent's Address"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Your Move"
                    value={selectedMove}
                    onChange={(e) => setSelectedMove(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Stake Amount"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    fullWidth
                />
                <Button type="submit" variant="contained">
                    Join Game
                </Button>
            </form>
            <Button variant="outlined" component={Link} to="/">
                Go Back
            </Button>
        </div>
    );
};

export default JoinGame;
