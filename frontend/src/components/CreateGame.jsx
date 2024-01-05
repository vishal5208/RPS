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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const CreateGame = ({ open, handleClose, createGame }) => {
    const [commitment, setCommitment] = useState(null);
    const [opponentAddress, setOpponentAddress] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');
    const [timeoutOption, setTimeoutOption] = useState(1);
    const [customTimeout, setCustomTimeout] = useState('');

    const handleCreateGame = () => {
        const selectedTimeout = timeoutOption === 0 ? customTimeout : timeoutOption;
        console.log('Creating game...');
        console.log('Commitment:', commitment);
        console.log('Opponent Address:', opponentAddress);
        console.log('Stake Amount:', stakeAmount);
        console.log('Timeout:', selectedTimeout);

        // createGame(commitment, opponentAddress, stakeAmount, selectedTimeout);
        handleClose();
    };

    const handleCommitmentClick = (move) => {
        setCommitment(move);
    };

    const moveNames = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'];

    return (
        <Dialog open={open} onClose={handleClose}>
            <StyledDialogTitle>
                <Typography variant="h4" color="inherit">
                    Create Game
                </Typography>
            </StyledDialogTitle>
            <StyledDialogContent>
                <Typography variant="h6" color="textPrimary" gutterBottom>
                    Select Move:
                </Typography>
                <div>
                    {moveNames.map((moveName) => (
                        <Button
                            key={moveName}
                            variant={commitment === moveName ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => handleCommitmentClick(moveName)}
                            style={{ margin: '8px' }}
                        >
                            {moveName}
                        </Button>
                    ))}
                </div>
                <TextField
                    label="Opponent's Address"
                    value={opponentAddress}
                    onChange={(e) => setOpponentAddress(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Stake Amount"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="timeout-label">Timeout (in minutes)</InputLabel>
                    <Select
                        labelId="timeout-label"
                        id="timeout-select"
                        value={timeoutOption}
                        onChange={(e) => setTimeoutOption(e.target.value)}
                    >
                        <MenuItem value={1}>1 minute</MenuItem>
                        <MenuItem value={2}>2 minutes</MenuItem>
                        <MenuItem value={4}>4 minutes</MenuItem>
                        <MenuItem value={0}>Custom</MenuItem>
                    </Select>
                </FormControl>
                {timeoutOption === 0 && (
                    <TextField
                        label="Custom Timeout (in minutes)"
                        value={customTimeout}
                        onChange={(e) => setCustomTimeout(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                )}
            </StyledDialogContent>
            <DialogActions>
                <Button
                    type="submit"
                    variant="contained"
                    onClick={handleCreateGame}
                    color="primary"
                    disabled={commitment === null}
                >
                    Create Game
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateGame;
