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

const CreateGame = ({ open, handleClose, createGame }) => {
    const [commitment, setCommitment] = useState(null);
    const [opponentAddress, setOpponentAddress] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');

    const handleCreateGame = () => {
        console.log('Creating game...');
        console.log('Commitment:', commitment);
        console.log('Opponent Address:', opponentAddress);
        console.log('Stake Amount:', stakeAmount);



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
                <Typography variant="h6" color="textPrimary">
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
