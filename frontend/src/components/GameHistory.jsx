import React, { useState, useEffect } from 'react';
import { gameHistory, getContract } from './backendConnectors/rpsConnector';
import { Card, CardContent, Typography } from '@mui/material';

const GameHistory = () => {
    const [games, setGames] = useState([]);
    const [contractInstance, setContractInstance] = useState(null);

    useEffect(() => {
        const initializeContract = async () => {
            try {
                const contract = await getContract();
                setContractInstance(contract);
            } catch (error) {
                console.error('Error initializing contract:', error.message);
            }
        };

        initializeContract();
    }, []);

    useEffect(() => {
        const fetchGameHistory = async () => {
            try {
                const res = await gameHistory();

                if (res.success) {
                    setGames(res.games);
                    console.log({ games });
                }
            } catch (error) {
                console.error('Error fetching game history:', error.message);
            }
        };

        const handleNewGameEvent = async (gameId, player1, player2, stake, timeout) => {
            try {
                console.log('New Game Created:', { gameId, player1, player2, stake, timeout });
                await fetchGameHistory();
            } catch (error) {
                console.error('Error handling NewGame event:', error.message);
            }
        };


        if (contractInstance) {
            contractInstance.on('NewGame', handleNewGameEvent);
            fetchGameHistory();
        }

        return () => {
            if (contractInstance) {
                contractInstance.off('NewGame', handleNewGameEvent);
            }
        };
    }, [contractInstance]);

    const renderGameCards = () => {
        return games.map((game, index) => (
            <Card key={game.gameId} sx={{ marginBottom: 2, backgroundColor: '#f0f0f0' }}>
                <CardContent>
                    <Typography sx={{ marginBottom: 1, color: '#555555' }}>Game ID: {index}</Typography>
                    <Typography sx={{ marginBottom: 1, color: '#555555' }}>Player 1: {game?.j1?.toString()}</Typography>
                    <Typography sx={{ marginBottom: 1, color: '#555555' }}>Player 2: {game?.j2?.toString()}</Typography>
                    <Typography sx={{ marginBottom: 1, color: '#777777' }}>Stake: {game?.stake?.toString()}</Typography>
                    <Typography sx={{ color: '#777777' }}>Timeout: {game?.timeout?.toString()}</Typography>
                </CardContent>
            </Card>
        ));
    };


    return <div>{renderGameCards()}</div>;
};

export default GameHistory;
