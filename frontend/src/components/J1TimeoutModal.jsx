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
    useTheme, // Import useTheme hook
} from '@mui/material';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, // Use primary theme color
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const J1TimeoutModal = ({ open, handleClose }) => {
    const [gameId, setGameId] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme(); // Use the useTheme hook to access the primary theme

    const handleJ1Timeout = async () => {
        try {
            setLoading(true);
            // Add your logic here to handle the J1 Timeout with the gameId
            console.log('Game ID:', gameId);
            // Implement the actual J1 Timeout logic or call the j1Timeout function
            // j1Timeout(gameId);
            handleClose();
        } catch (error) {
            console.error('Error handling J1 timeout:', error);
            // Handle error appropriately (show an error message, etc.)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <StyledDialogTitle theme={theme}>
                <Typography variant="h4" color="inherit">
                    J1 Timeout
                </Typography>
            </StyledDialogTitle>
            <StyledDialogContent>
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
                    onClick={handleJ1Timeout}
                    color="primary" // Use primary theme color for the button
                    disabled={loading || !gameId}
                >
                    J1 Timeout
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default J1TimeoutModal;
