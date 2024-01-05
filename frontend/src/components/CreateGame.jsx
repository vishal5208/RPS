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
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const CreateGame = ({ open, handleClose }) => {
    const [commitment, setCommitment] = useState('');
    const [opponentAddress, setOpponentAddress] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');

    const handleCreateGame = () => {
        // Implement your smart contract interaction logic here
        console.log('Creating game...');
        console.log('Commitment:', commitment);
        console.log('Opponent Address:', opponentAddress);
        console.log('Stake Amount:', stakeAmount);
        handleClose(); // Close the modal after creating the game
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <StyledDialogTitle>
                <Typography variant="h4" color="inherit">
                    Create Game
                </Typography>
            </StyledDialogTitle>
            <StyledDialogContent>
                <form onSubmit={handleCreateGame}>
                    <TextField
                        label="Commitment"
                        value={commitment}
                        onChange={(e) => setCommitment(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
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
                </form>
            </StyledDialogContent>
            <DialogActions>
                <Button type="submit" variant="contained" onClick={handleCreateGame} color="primary">
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
