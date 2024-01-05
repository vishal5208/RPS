import React, { useState, useEffect } from 'react';
import { gameHistory, getContract } from './backendConnectors/rpsConnector';
import { Card, CardContent, Typography, Divider, Grid } from '@mui/material';

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

    const Moves = {
        Rock: 1,
        Paper: 2,
        Scissors: 3,
        Spock: 4,
        Lizard: 5,
    };


    const renderGameCards = () => {
        const cardsPerRow = 3;

        const chunkedGames = [];
        for (let i = 0; i < games.length; i += cardsPerRow) {
            chunkedGames.push(games.slice(i, i + cardsPerRow));
        }

        return chunkedGames.reverse().map((row, rowIndex) => (
            <Grid key={rowIndex} container spacing={2} justifyContent="center">
                {row.slice().reverse().map((game, colIndex) => (
                    <Grid key={game.gameId} item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <Card sx={{
                            backgroundColor: '#2196F3',
                            color: '#FFFFFF',
                            borderRadius: 8,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ marginBottom: 1 }}>ID: {games.indexOf(game)}</Typography>
                                <Divider sx={{ marginBottom: 1 }} />
                                <Typography sx={{ marginBottom: 1 }}>P1: {truncateAddress(game?.j1?.toString())}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>P2: {truncateAddress(game?.j2?.toString())}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>Stake: {game?.stake?.toString()}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>Address: {truncateAddress(game?.address)}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>Timeout: {game?.timeout?.toString()}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>Last Action: {new Date(game?.lastAction * 1000).toLocaleString()}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>Resolved: {game?.resolved ? 'Yes' : 'No'}</Typography>
                                {/* You may need to handle displaying c1Hash and c2 depending on their types */}
                                {/* <Typography sx={{ marginBottom: 1 }}>c1Hash: {game?.c1Hash}</Typography> */}
                                <Typography sx={{ marginBottom: 1 }}>P2's move: {game?.c2 === 0 ? "Hasn't played yet." : Object.keys(Moves).find(key => Moves[key] === game?.c2)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        ));
    };

    const truncateAddress = (address) => {

        if (address && address.length > 7) {
            return `${address.substring(0, 3)}...${address.substring(address.length - 4)}`;
        }
        return address;
    };

    return <div>
        <Typography variant="h4" sx={{ marginBottom: 2, color: 'black' }}>Game History </Typography>
        {renderGameCards()}
    </div>;
};

export default GameHistory;
