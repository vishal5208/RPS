
import { ethers } from "ethers";
import contractData from '../../constants/contracts.json';
import { toast } from 'react-toastify';

const contractAddress = contractData.RPS.address;
const contractAbi = contractData.RPS.abi;


export const checkNetwork = async () => {
    const targetNetworkId = "0x5";

    if (window.ethereum) {
        const currentChainId = await window.ethereum.request({
            method: "eth_chainId",
        });

        localStorage.setItem("Current-Network-Id", currentChainId);

        if (currentChainId == targetNetworkId) return { success: true };

        // return false is network id is different
        return {
            success: false,
            msg: "Please Open Metamask and Connect The Goelie network",
        };
    }
};


export const requestAccount = async (metaMask) => {
    try {
        if (typeof window.ethereum !== "undefined") {
            let provider = window.ethereum;
            // edge case if MM and CBW are both installed
            if (window.ethereum.providers?.length) {
                window.ethereum.providers.forEach(async (p) => {
                    if (metaMask === true) {
                        if (p.isMetaMask) provider = p;
                    } else {
                        if (p.isCoinbaseWallet) {
                            provider = p;
                        }
                    }
                });
            }
            await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x5" }],
            });
            await provider.request({
                method: "eth_requestAccounts",
                params: [],
            });

            localStorage.setItem("Wallet-Check", true);

            return { success: true };
        } else {
            localStorage.setItem("Wallet-Check", false);

            return {
                success: false,
                msg: "please connect your wallet",
            };
        }
    } catch (error) {
        localStorage.setItem("Wallet-Check", false);

        return {
            success: false,
            msg: error.message,
        };
    }
};

export const switchToGoerli = async (provider, localStorageKeys) => {
    try {
        await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x5" }],
        });

        localStorage.setItem(localStorageKeys.walletCheck, true);
    } catch (error) {
        console.error("Failed to switch to Goerli:", error);
    }
};

export const isConnected = async () => {
    try {
        if (window.ethereum) {
            let chainId = window.ethereum.chainId;
            if (chainId !== "0x5") {
                const temp = await window.provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x5" }],
                });
            }
            if (chainId === "0x5") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const account = await provider.send("eth_requestAccounts", []);

                localStorage.setItem("Wallet-Check", true);

                return {
                    success: true,
                };
            }
        } else {
            localStorage.setItem("Wallet-Check", false);
            return {
                success: false,
                msg: "Please Install Wallet",
            };
        }
    } catch (error) {
        localStorage.setItem("Wallet-Check", false);

        return {

            success: false,
            msg: "Please Open Metamask and Connect",
        };
    }
};




export const getPropertyDetails = async () => {
    try {

        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();



            const contract = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer
            );


            const userAddress = await signer.getAddress();


            const propertiesForSaleCount = await contract.getPropertiesForSaleCount();
            const ownedPropertiesCount = await contract.getOwnedPropertiesCount(userAddress);
            const pendingRequestsCount = await contract.getPendingRequestsCount(userAddress);



            return {
                success: true,
                propertiesForSaleCount,
                ownedPropertiesCount,
                pendingRequestsCount,
            };
        } else {
            return {
                success: false,
                msg: "Please connect your wallet!",
            };
        }
    } catch (error) {
        return {
            success: false,
            msg: error.message,
        };
    }
};

export const createGame = async (move, opponentAddr, stakeAmount, timeout) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();


            // Initialize your contract
            const contract = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer
            );

            // Get the user's address
            const userAddress = await signer.getAddress();

            const len = await contract.getGamesLength();
            const timeoutInSeconds = timeout * 60;

            const c1Hash = await contract.hash(move, len.toString());
            const stake = ethers.utils.parseEther(stakeAmount);

            const tx = await contract.createGame(c1Hash, opponentAddr, timeoutInSeconds, { value: stake.toString() });
            await tx.wait()

            toast.success('Game created successfully!', { position: toast.POSITION.TOP_LEFT, autoClose: 5000, style: { marginTop: '60px', width: '300px' } });


            return {
                success: true,
                message: 'Game Created successfully!',
            };
        } else {
            return {
                success: false,
                message: 'Please connect your wallet!',
            };
        }
    } catch (error) {
        let reason = 'An error occurred. Please try again.';

        if (error.data && error.data.reason) {
            reason = error.data.reason;
        } else if (error.reason) {
            reason = error.reason;
        } else if (error.message && error.message.includes("execution reverted")) {
            reason = "Transaction failed: Execution reverted";
        }

        toast.error(reason, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 5000,
            style: { marginTop: '60px', width: '300px' },
        });

        return {
            success: false,
            message: reason,
        };
    }
};

export const play = async (gameId, c2Move, stakeAmount) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Initialize your contract
            const contract = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer
            );

            const stake = ethers.utils.parseEther(stakeAmount);

            const tx = await contract.play(gameId, c2Move, { value: stake.toString() });
            await tx.wait();

            toast.success('Joined the game successfully!', { position: toast.POSITION.TOP_LEFT, autoClose: 5000, style: { marginTop: '60px', width: '300px' } });


            return {
                success: true,
                message: 'Entered into the game successfully!',
            };
        } else {
            return {
                success: false,
                message: 'Please connect your wallet!',
            };
        }
    } catch (error) {
        let reason = 'An error occurred. Please try again.';

        if (error.data && error.data.reason) {
            reason = error.data.reason;
        } else if (error.reason) {
            reason = error.reason;
        } else if (error.message && error.message.includes("execution reverted")) {
            reason = "Transaction failed: Execution reverted";
        }

        toast.error(reason, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 5000,
            style: { marginTop: '60px', width: '300px' }, // Adjust the width as needed
        });

        return {
            success: false,
            message: reason,
        };
    }
};

export const solve = async (move, gameId) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Initialize  contract
            const contract = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer
            );

            const tx = await contract.solve(move, gameId);
            await tx.wait()

            toast.success('Game Solved successfully!', { position: toast.POSITION.TOP_LEFT, autoClose: 5000, style: { marginTop: '60px', width: '300px' } });

            return {
                success: true,
                message: 'Game Solved successfully!',
            };
        } else {
            return {
                success: false,
                message: 'Please connect your wallet!',
            };
        }
    } catch (error) {
        let reason = 'An error occurred. Please try again.';

        if (error.data && error.data.reason) {
            reason = error.data.reason;
        } else if (error.reason) {
            reason = error.reason;
        } else if (error.message && error.message.includes("execution reverted")) {
            reason = "Transaction failed: Execution reverted";
        }

        toast.error(reason, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 5000,
            style: { marginTop: '60px', width: '300px' },
        });

        return {
            success: false,
            message: reason,
        };
    }
};



export const timeoutFunc = async (gameId, timeoutType) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Initialize  contract
            const contract = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer
            );

            let tx;
            if (timeoutType == 0) {
                console.log("hi")
                tx = await contract.j1Timeout(gameId);
            } else {
                tx = await contract.j2Timeout(gameId);
            }

            await tx.wait()

            toast.success('Game successfully resolved!', { position: toast.POSITION.TOP_LEFT, autoClose: 5000, style: { marginTop: '60px', width: '300px' } });



            return {
                success: true,
                message: 'successfully!',
            };
        } else {
            return {
                success: false,
                message: 'Please connect your wallet!',
            };
        }
    } catch (error) {

        let reason = 'An error occurred. Please try again.';

        if (error.data && error.data.reason) {
            reason = error.data.reason;
        } else if (error.reason) {
            reason = error.reason;
        } else if (error.message && error.message.includes("execution reverted")) {
            reason = "Transaction failed: Execution reverted";
        }

        toast.error(reason, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 5000,
            style: { marginTop: '60px', width: '300px' }, // Adjust the width as needed
        });
        return {
            success: false,
            message: reason,
        };
    }
};

export const gameHistory = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            provider
        );


        const gamesLength = await contract.getGamesLength();
        const gamesArray = [];

        for (let i = 0; i < gamesLength; i++) {
            const game = await contract.games(i);
            gamesArray.push(game);
        }


        return {
            success: true,
            games: gamesArray
        };

    } catch (error) {
        return {
            success: false,
            msg: error.message,
        };
    }
};

export const getContract = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
    );

    return contract;
};











