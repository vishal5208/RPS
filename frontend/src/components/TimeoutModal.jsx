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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const TimeoutModal = ({ open, handleClose }) => {
    const [timeoutType, setTimeoutType] = useState('j1');
    const [gameId, setGameId] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();

    const handleTimeout = async () => {
        try {
            setLoading(true);
            console.log('Timeout Type:', timeoutType);
            console.log('Game ID:', gameId);
            // Implement the actual timeout logic or call the appropriate timeout function
            // handleTimeout(timeoutType, gameId);
            handleClose();
        } catch (error) {
            console.error(`Error handling ${timeoutType} timeout:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <StyledDialogTitle theme={theme}>
                <Typography variant="h4" color="inherit">
                    {timeoutType === 'j1' ? 'J1 Timeout' : 'J2 Timeout'}
                </Typography>
            </StyledDialogTitle>
            <StyledDialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="timeout-type-label">Timeout Type</InputLabel>
                    <Select
                        labelId="timeout-type-label"
                        id="timeout-type-select"
                        value={timeoutType}
                        onChange={(e) => setTimeoutType(e.target.value)}
                    >
                        <MenuItem value="j1">J1 Timeout</MenuItem>
                        <MenuItem value="j2">J2 Timeout</MenuItem>
                    </Select>
                </FormControl>
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
                    onClick={handleTimeout}
                    color="primary"
                    disabled={loading || !gameId}
                >
                    {timeoutType === 'j1' ? 'J1 Timeout' : 'J2 Timeout'}
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TimeoutModal;