import React, { useState, useEffect } from 'react';
import { gameHistory, getContract, getCurrentAddress } from './backendConnectors/rpsConnector';
import { Card, CardContent, Typography, Divider, Grid, Button } from '@mui/material';
import { utils } from 'ethers';
import JoinGame from './JoinGame';
import ResolveGameModal from './ResolveGame';

const GameHistory = () => {
    const [games, setGames] = useState([]);
    const [contractInstance, setContractInstance] = useState(null);
    const [isJoinGameModalOpen, setJoinGameModalOpen] = useState(false);
    const [isResolveGameModalOpen, setResolveGameModalOpen] = useState(false);

    const [joinGameData, setJoinGameData] = useState({
        gameId: null,
        stakeAmount: null,
    });

    const [resolveGameData, setResolveGameData] = useState({
        gameId: null

    });
    const [currentAddress, setCurrentAddress] = useState(null);

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

    useEffect(() => {
        const initializeContract = async () => {
            try {
                const contract = await getContract();
                setContractInstance(contract);

                const initialAddressResponse = await getCurrentAddress();
                if (initialAddressResponse.success) {
                    setCurrentAddress(initialAddressResponse.currentAddress);
                }

                window.ethereum.on('accountsChanged', async (accounts) => {
                    await fetchGameHistory();

                    console.log("account changed: ", accounts[0]);
                    const newAddress = accounts[0];
                    setCurrentAddress(newAddress);
                });
            } catch (error) {
                console.error('Error initializing contract:', error.message);
            }
        };

        initializeContract();
    }, [currentAddress]);

    useEffect(() => {
        const handleNewGameEvent = async () => {
            try {
                await fetchGameHistory();
            } catch (error) {
                console.error('Error handling NewGame event:', error.message);
            }
        };

        if (contractInstance) {
            contractInstance.on('NewGame', handleNewGameEvent);
            contractInstance.on('GameResolved', handleNewGameEvent);
            contractInstance.on('Player2MoveCommitted', handleNewGameEvent);
            fetchGameHistory();
        }

        return () => {
            if (contractInstance) {
                contractInstance.off('NewGame', handleNewGameEvent);
                contractInstance.off('GameResolved', handleNewGameEvent);
                contractInstance.off('Player2MoveCommitted', handleNewGameEvent);
            }
        };
    }, [contractInstance, currentAddress]);

    const Moves = {
        Rock: 1,
        Paper: 2,
        Scissors: 3,
        Spock: 4,
        Lizard: 5,
    };

    const handleJoinGameButtonClick = (gameId, stakeAmount) => {
        setJoinGameModalOpen(true);
        setJoinGameData({ gameId, stakeAmount });
    };

    const handleResolveGameButtonClick = (gameId, salt) => {
        setResolveGameModalOpen(true);
        setResolveGameData({ gameId });
    };

    const renderGameCards = () => {
        const cardsPerRow = 3;

        const chunkedGames = [];
        for (let i = 0; i < games.length; i += cardsPerRow) {
            chunkedGames.push(games.slice(i, i + cardsPerRow));
        }

        return chunkedGames.reverse().map((row, rowIndex) => (
            <Grid key={rowIndex} container spacing={2} marginBottom={2} justifyContent="center">
                {row.slice().reverse().map((game, colIndex) => (
                    <Grid key={game.gameId} item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <Card sx={{
                            backgroundColor: game.resolved ? '#DFF0D8' : '#2196F3',
                            color: game?.resolved ? 'black' : '#FFFFFF',
                            borderRadius: 8,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            <CardContent>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>ID: {games.indexOf(game)}</Typography>
                                    {game.resolved && (
                                        <Typography variant="h6" sx={{ marginBottom: 1, color: '#4CAF50' }}>
                                            Winner: {game.winner === game.j1 ? 'Player 1' : game.winner === game.j2 ? 'Player 2' : 'No winner'}
                                        </Typography>
                                    )}
                                </div>
                                <Divider sx={{ marginBottom: 1 }} />
                                <Typography sx={{ marginBottom: 1 }}>P1: {truncateAddress(game?.j1?.toString())}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>P2: {truncateAddress(game?.j2?.toString())}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>Stake: {utils.formatEther(game?.stake)} ETH</Typography>
                                <Typography sx={{ marginBottom: 1 }}>Timeout: {Math.floor(game?.timeout / 60)} minutes</Typography>
                                <Typography sx={{ marginBottom: 1 }}>Last Action: {new Date(game?.lastAction * 1000).toLocaleString()}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>Resolved: {game?.resolved ? 'Yes' : 'No'}</Typography>
                                <Typography sx={{ marginBottom: 1 }}>P2's move: {game?.c2 === 0 ? "Hasn't played yet." : Object.keys(Moves).find(key => Moves[key] === game?.c2)}</Typography>

                                {game?.c2 !== 0 ? (


                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            style={{
                                                marginTop: '10px',
                                                backgroundColor: 'grey',
                                                color: 'white',
                                            }}
                                            disabled
                                        >
                                            P2 Played
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            size="large"
                                            onClick={() => handleResolveGameButtonClick(games.indexOf(game))}
                                            style={{
                                                marginTop: '10px',
                                                backgroundColor: 'green',
                                                color: 'white',
                                            }}
                                        >
                                            Resolve Game
                                        </Button>
                                    </>
                                ) : (
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={() => handleJoinGameButtonClick(games.indexOf(game), game.stake)}
                                            style={{
                                                marginTop: '10px',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                marginRight: '5px',
                                                ...(game?.j2?.toString() !== currentAddress && {
                                                    backgroundColor: 'grey',
                                                    cursor: 'not-allowed',
                                                }),
                                            }}
                                            disabled={game?.j2?.toString() !== currentAddress}
                                        >
                                            Join Game
                                        </Button>

                                    </div>
                                )}
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

    return (
        <div>
            <Typography variant="h4" sx={{ marginBottom: 2, color: 'black' }}>Game History </Typography>
            {renderGameCards()}

            <JoinGame
                open={isJoinGameModalOpen}
                handleClose={() => setJoinGameModalOpen(false)}
                gameId={joinGameData.gameId}
                stakeAmount={joinGameData.stakeAmount}
            />

            <ResolveGameModal
                open={isResolveGameModalOpen}
                handleClose={() => setResolveGameModalOpen(false)}
                gameId={resolveGameData.gameId}

            />

        </div>
    );
};

export default GameHistory;
