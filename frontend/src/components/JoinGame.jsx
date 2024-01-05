import React, { useState } from 'react';
import {
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled,
    useTheme,
    CircularProgress,
} from '@mui/material';
import { play } from './backendConnectors/rpsConnector';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const JoinGame = ({ open, handleClose }) => {
    const [gameId, setGameId] = useState('');
    const [selectedMove, setSelectedMove] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();

    const handleMoveClick = (move) => {
        setSelectedMove(move);
    };

    const Moves = {
        Rock: 1,
        Paper: 2,
        Scissors: 3,
        Spock: 4,
        Lizard: 5,
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const move = Moves[selectedMove];
            const res = await play(gameId, move, stakeAmount);
            setGameId('');
            setSelectedMove('');
            setStakeAmount('');
            handleClose();
        } catch (error) {
            console.error(`Error handling in handle join game`, error);
        } finally {
            setLoading(false);
        }
    };

    const moveNames = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'];

    return (
        <Dialog open={open} onClose={handleClose}>
            <StyledDialogTitle>
                <Typography variant="h4" color="inherit">
                    Join Game
                </Typography>
            </StyledDialogTitle>
            <StyledDialogContent theme={theme}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Game ID / Opponent's Address"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <Typography variant="subtitle1">Select Move:</Typography>
                    <div>
                        {moveNames.map((move) => (
                            <Button
                                key={move}
                                variant={selectedMove === move ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => handleMoveClick(move)}
                                style={{ margin: '8px' }}
                            >
                                {move}
                            </Button>
                        ))}
                    </div>
                    <TextField
                        label="Stake Amount"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                </form>
            </StyledDialogContent>
            <DialogActions>
                <Button
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                    color="primary"
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Join Game'
                    )}
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JoinGame;
