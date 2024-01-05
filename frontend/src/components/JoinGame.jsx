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
} from '@mui/material';
import { play } from './backendConnectors/rpsConnector';


// const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
//     padding: theme.spacing(2),
//     fontSize: '1.2rem',
// }));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, // Use primary theme color
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));


const JoinGame = ({ open, handleClose }) => {
    const [gameId, setGameId] = useState('');
    const [selectedMove, setSelectedMove] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');

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
        console.log('Joining game...');
        console.log('Game ID / Opponent\'s Address:', gameId);
        console.log('Selected Move:', selectedMove);
        console.log('Stake Amount:', stakeAmount);

        const move = Moves[selectedMove];

        const res = await play(gameId, move, stakeAmount);

        setGameId('');
        setSelectedMove('');
        setStakeAmount('');
        handleClose();
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
                >
                    Join Game
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JoinGame;
