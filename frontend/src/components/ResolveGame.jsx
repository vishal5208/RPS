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
} from '@mui/material';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const ResolveGameModal = ({ open, handleClose }) => {
    const [move, setMove] = useState('');
    const [gameId, setGameId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResolveGame = async () => {
        try {
            setLoading(true);
            // Add your logic here to handle the resolution with move and gameId
            console.log('Move:', move);
            console.log('Game ID:', gameId);
            // Implement the actual resolution logic or call the resolveGame function
            // resolveGame(move, gameId);
            handleClose();
        } catch (error) {
            console.error('Error resolving game:', error);
            // Handle error appropriately (show an error message, etc.)
        } finally {
            setLoading(false);
        }
    };

    const handleMoveClick = (selectedMove) => {
        setMove(selectedMove);
    };

    const moveNames = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'];

    return (
        <Dialog open={open} onClose={handleClose}>
            <StyledDialogTitle>
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
                    Resolve Game
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResolveGameModal;
