import React, { useState, useEffect } from 'react';
import { gameHistory, getContract } from './backendConnectors/rpsConnector';
import { Card, CardContent, Typography, Divider } from '@mui/material';

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
        const cardsPerRow = 3;

        const chunkedGames = [];
        for (let i = 0; i < games.length; i += cardsPerRow) {
            chunkedGames.push(games.slice(i, i + cardsPerRow));
        }

        return chunkedGames.reverse().map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', marginBottom: 16 }}>
                {row.slice().reverse().map((game, colIndex) => (
                    <div key={game.gameId} style={{ marginRight: colIndex < cardsPerRow - 1 ? 2 : 0 }}>
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
                                <Typography sx={{ marginBottom: 1 }}>c2: {game?.c2}</Typography>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
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
