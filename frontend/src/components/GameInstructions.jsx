// GameInstructions.js
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const GameInstructions = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    How to Play
                </Typography>
                <Typography variant="body1" style={{ fontSize: '1.4rem' }}>
                    <span style={{ color: 'red' }}>Vishal</span> and <span style={{ color: 'green' }}>Aditi</span> are playing a game of Rock-Paper-Scissors.
                </Typography>
                <ol>
                    <li style={{ fontSize: '1.3rem' }}>
                        <span style={{ color: 'red' }}>Vishal</span> creates a game and invites <span style={{ color: 'green' }}>Aditi</span> to play.
                    </li>
                    <li style={{ fontSize: '1.3rem' }}>
                        <span style={{ color: 'green' }}>Aditi</span> joins the game by pressing the "Join An Existing Game" button, staking the same amount as <span style={{ color: 'red' }}>Vishal</span>.
                    </li>
                    <li style={{ fontSize: '1.3rem' }}>
                        If <span style={{ color: 'green' }}>Aditi</span> misses the move deadline, <span style={{ color: 'red' }}>Vishal</span> can click the timeout button to reclaim his staked ETH.
                    </li>
                    <li style={{ fontSize: '1.3rem' }}>
                        If <span style={{ color: 'green' }}>Aditi</span> plays but <span style={{ color: 'red' }}>Vishal</span> doesn't reveal his move, <span style={{ color: 'green' }}>Aditi</span> can press the timeout button to claim both stakes.
                    </li>
                    <li style={{ fontSize: '1.3rem' }}>
                        After revealing his move, the winner will receive the total staked ETH (twice the staked amount). In case of a draw, where no one wins, both players will get their staked ETH back.
                    </li>
                    <li style={{ fontSize: '1.3rem' }}>
                        At the end of the game, if both players have made their moves, <span style={{ color: 'red' }}>Vishal</span> can reveal his move by clicking the 'Resolve Game' button.
                    </li>
                </ol>
            </CardContent>
        </Card>
    );
};

export default GameInstructions;
