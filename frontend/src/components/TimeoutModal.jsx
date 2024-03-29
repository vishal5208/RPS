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
    MenuItem, CircularProgress
} from '@mui/material';
import { timeoutFunc } from './backendConnectors/rpsConnector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const TimeoutModal = ({ open, handleClose, gameId }) => {
    const [timeoutType, setTimeoutType] = useState(0);

    const [loading, setLoading] = useState(false);

    const theme = useTheme();

    const handleTimeout = async () => {
        try {
            setLoading(true);
            console.log('Timeout Type:', timeoutType);

            console.log('Game ID:', gameId);
            const res = await timeoutFunc(gameId, timeoutType);
            handleClose();
        } catch (error) {
            console.error(`Error handling ${timeoutType} timeout:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <StyledDialogTitle theme={theme}>
                    <Typography variant="h4" color="inherit">
                        {timeoutType === 'P1' ? 'P1 Timeout' : 'P2 Timeout'}
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
                            <MenuItem value={0}>P1 Timeout</MenuItem>
                            <MenuItem value={1}>P2 Timeout</MenuItem>
                        </Select>
                    </FormControl>

                </StyledDialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleTimeout}
                        color="primary"
                        disabled={loading || !gameId}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            timeoutType === 'P1' ? 'P1 Timeout' : 'P2 Timeout'
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

export default TimeoutModal;
