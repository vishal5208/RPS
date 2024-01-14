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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const JoinGame = ({ open, handleClose, gameId, stakeAmount }) => {

    const [selectedMove, setSelectedMove] = useState('');

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

            console.log(gameId, move, stakeAmount.toString())
            const res = await play(gameId, move, stakeAmount.toString());

            setSelectedMove('');

            handleClose();
        } catch (error) {
            console.error(`Error handling in handle join game`, error);
        } finally {
            setLoading(false);
        }
    };

    const moveNames = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'];

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <StyledDialogTitle>
                    <Typography variant="h4" color="inherit">
                        Join Game
                    </Typography>
                </StyledDialogTitle>
                <StyledDialogContent theme={theme}>
                    <form onSubmit={handleSubmit}>

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

            <ToastContainer position="top-left" autoClose={5000} hideProgressBar={false} />

        </>

    );
};

export default JoinGame;
