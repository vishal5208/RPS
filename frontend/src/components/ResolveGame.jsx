import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    TextField,
    styled,
    useTheme, CircularProgress
} from '@mui/material';
import { solve } from './backendConnectors/rpsConnector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const ResolveGameModal = ({ open, handleClose }) => {
    const [move, setMove] = useState('');
    const [gameId, setGameId] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();


    const Moves = {
        Rock: 1,
        Paper: 2,
        Scissors: 3,
        Spock: 4,
        Lizard: 5,
    };

    const handleResolveGame = async () => {
        try {
            setLoading(true);
            const j1Move = Moves[move]

            console.log('Move:', move);
            console.log('Game ID:', gameId);
            const res = await solve(j1Move, gameId);

            handleClose();
        } catch (error) {
            console.error('Error resolving game:', error);

        } finally {
            setLoading(false);
        }
    };

    const handleMoveClick = (selectedMove) => {
        setMove(selectedMove);
    };

    const moveNames = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'];

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <StyledDialogTitle theme={theme}>
                    <Typography variant="h4" color="inherit">
                        Resolve Game
                    </Typography>
                </StyledDialogTitle>
                <StyledDialogContent>
                    <Typography variant="body1" color="textPrimary" gutterBottom>
                        Select Move:
                    </Typography>
                    <div>
                        {moveNames.map((moveName) => (
                            <Button
                                key={moveName}
                                variant={move === moveName ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => handleMoveClick(moveName)}
                                style={{ margin: '8px' }}
                            >
                                {moveName}
                            </Button>
                        ))}
                    </div>
                    <TextField
                        label="Game ID"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                </StyledDialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleResolveGame}
                        color="primary"
                        disabled={loading || !move || !gameId}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Resolve Game'
                        )}
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer position="top-left" autoClose={5000} hideProgressBar={false} />

        </>
    );
};

export default ResolveGameModal;
