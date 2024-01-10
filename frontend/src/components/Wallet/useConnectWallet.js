import { useState, useEffect } from "react";
import { ethers } from "ethers";

function useConnectWallet() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [connectStatus, setConnectStatus] = useState("disconnected");

    useEffect(() => {
        const init = async () => {
            const storedAccount = localStorage.getItem("storedAccount");
            const storedConnectStatus = localStorage.getItem("storedConnectStatus");

            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);

                try {
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setConnectStatus("connected");
                        localStorage.setItem("storedAccount", accounts[0]);
                        localStorage.setItem("storedConnectStatus", "connected");
                    }
                } catch (error) {
                    console.error(error);
                }

                window.ethereum.on("accountsChanged", (accounts) => {
                    if (accounts.length === 0) {
                        disconnectWallet();
                    } else {
                        setAccount(accounts[0]);
                        setConnectStatus("connected");
                        localStorage.setItem("storedAccount", accounts[0]);
                        localStorage.setItem("storedConnectStatus", "connected");
                    }
                });

                window.ethereum.on("chainChanged", async (chainId) => {
                    setProvider(new ethers.providers.Web3Provider(window.ethereum));
                    if (chainId !== "0x5") {
                        await switchToGoerli(provider);
                    }
                    disconnectWallet();
                });
            } else {
                console.log("No Ethereum wallet detected");
            }
        };
        init();
    }, []);

    const switchToGoerli = async (provider) => {
        try {
            await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x5" }],
            });

            localStorage.setItem("storedConnectStatus", "connected");
        } catch (error) {
            console.error("Failed to switch to Goerli:", error);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setConnectStatus("disconnected");
        localStorage.removeItem("storedAccount");
        localStorage.setItem("storedConnectStatus", "disconnected");
    };

    const requestAccount = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                setConnectStatus("connected");
                const accounts = await provider.listAccounts();
                setAccount(accounts[0]);
                localStorage.setItem("storedAccount", accounts[0]);
                localStorage.setItem("storedConnectStatus", "connected");
                return { success: true };
            } catch (error) {
                disconnectWallet();
                return { success: false, msg: error.message };
            }
        } else {
            disconnectWallet();
            return { success: false, msg: "No Ethereum wallet detected" };
        }
    };

    return { provider, account, requestAccount, connectStatus, disconnectWallet };
}

export default useConnectWallet;
