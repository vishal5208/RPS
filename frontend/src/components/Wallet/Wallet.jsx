import React, { useState, useEffect } from "react";
import { Button, Container, Typography, CircularProgress, Snackbar, Box } from "@mui/material";
import useConnectWallet from "./useConnectWallet";

const Wallet = () => {
    const { account, requestAccount, connectStatus, disconnectWallet } = useConnectWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        if (connectStatus === "disconnected") {
            setErrorMsg("");
        }
    }, [connectStatus]);

    const handleConnectWallet = async () => {
        setIsLoading(true);
        setErrorMsg("");

        const result = await requestAccount();

        setIsLoading(false);

        if (!result.success) {
            setErrorMsg(result.msg);
            setSnackbarOpen(true);
        }
    };

    const handleDisconnectWallet = () => {
        disconnectWallet();
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container sx={{ display: "flex", flexDirection: "column" }}>
            {connectStatus === "disconnected" && (
                <div
                    style={{
                        padding: "0.3rem",
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "end",
                    }}
                >
                    {/* <Typography variant="h6" gutterBottom style={{ marginRight: "1rem", color: "white", fontSize: '1rem' }} >
                        Connect Your Wallet
                    </Typography> */}
                    <div style={{ marginBottom: "1rem", color: "white" }}>
                        {isLoading && <CircularProgress color="inherit" size={20} style={{ marginRight: "0.5rem" }} />}
                        {errorMsg && <span style={{ color: "#FF5252" }}>{errorMsg}</span>}
                    </div>
                    {!isLoading && !errorMsg && (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={handleConnectWallet}
                            style={{ color: "white", fontSize: '1rem' }}
                        >
                            Connect Wallet
                        </Button>
                    )}
                </div>
            )}

            {connectStatus === "connecting" && (
                <div style={{ marginTop: "2rem", marginLeft: "1rem" }}>
                    <CircularProgress />
                    <Typography variant="body1" style={{ marginTop: "1rem" }}>
                        Connecting...
                    </Typography>
                </div>
            )}

            {connectStatus === "connected" && (
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    <Typography
                        variant="body1"
                        style={{ color: "white", fontSize: '1.2rem', cursor: "pointer" }}
                        onClick={handleDisconnectWallet}
                    >
                        Connected: {account ? `${account.slice(0, 4)}...${account.slice(-4)}` : ""}
                    </Typography>
                </Box>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Failed to connect wallet. Please try again."
                action={
                    <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                        CLOSE
                    </Button>
                }
            />
        </Container>
    );
};

export default Wallet;
