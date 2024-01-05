import { useState, useEffect } from "react";
import { ethers } from "ethers";

function useConnectWallet() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [connectStatus, setConnectStatus] = useState("disconnected");

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);

                try {
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setConnectStatus("connected");
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
                    }
                });

                window.ethereum.on("chainChanged", (chainId) => {
                    setProvider(new ethers.providers.Web3Provider(window.ethereum));
                    disconnectWallet();
                });
            } else {
                console.log("No Ethereum wallet detected");
            }
        };
        init();
    }, []);

    const disconnectWallet = () => {
        setAccount(null);
        setConnectStatus("disconnected");
    };

    const requestAccount = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                setConnectStatus("connected");
                const accounts = await provider.listAccounts();
                setAccount(accounts[0]);
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
