
import { ethers } from "ethers";
import contractData from '../../constants/contracts.json';

const contractAddress = contractData.RPS.address;
const contractAbi = contractData.RPS.abi;


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

            return { success: true };
        } else {
            return {
                success: false,
                msg: "please connect your wallet",
            };
        }
    } catch (error) {
        return {
            success: false,
            msg: error.message,
        };
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



    console.log("in game")
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
            const timeoutInSeconds = timeoutInMinutes * 60;

            const c1Hash = await contract.hash(move, len.toString());
            const stake = ethers.utils.parseEther(stakeAmount);

            const tx = await contract.createGame(c1Hash, opponentAddr, timeoutInSeconds, { value: stake.toString() });
            await tx.wait()


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
        return {
            success: false,
            message: error.message,
        };
    }
};

export const play = async (gameId, c2Move, stakeAmount) => {

    console.log("in game")
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
            await tx.wait()


            return {
                success: true,
                message: 'Enterd into Game successfully!',
            };
        } else {
            return {
                success: false,
                message: 'Please connect your wallet!',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const solve = async (move, gameId) => {

    console.log("in game")
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
        return {
            success: false,
            message: error.message,
        };
    }
};

export const timeoutFunc = async (gameId, timeoutType) => {

    console.log("in game")
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


            const tx = await contract.solve(move, timeoutType); // based on type handle
            await tx.wait()


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
        return {
            success: false,
            message: error.message,
        };
    }
};



export const getAllProperties = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);


        const allProperties = await contract.getAllProperties();



        return {
            success: true,
            properties: allProperties,
        };
    } catch (error) {
        return {
            success: false,
            msg: error.message,
        };
    }
};

// check registaiton
export const checkUsernameAvailability = async (username) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();



            const contract = new ethers.Contract(contractAddress, contractAbi, signer);

            const isTaken = await contract.isUsernameTaken(username);




            return {
                success: true,
                isTaken,
            };
        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }
    } catch (error) {
        return {
            success: false,
            msg: error.message,
        };
    }
};

// check registaiton
export const checkRegistration = async () => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();



            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const userAddress = await signer.getAddress();
            const isRegisterd = await contract.isUserRegistered(userAddress);


            return {
                success: true,
                isRegisterd,
            };
        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }
    } catch (error) {
        return {
            success: false,
            msg: error.message,
        };
    }
};


// register  user
export const registerUserOnBlockchain = async (username, password, aadhar) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();



            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const transaction = await contract.registerUser(username, password, aadhar);
            await transaction.wait();

            return { success: true, message: 'User registration successful' };


        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }

    } catch (error) {
        console.error('Error registering user:', error.message);
        return { success: false, message: 'User registration failed' };
    }
};


// get user name
export const getUsername = async (address) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();



            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const username = await contract.getUsername(address);



            return { success: true, username };

        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }




    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const login = async (userName, password) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();



            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const isLoginSuccess = await contract.login(userName, password);


            const userAddress = await signer.getAddress();

            return { success: true, isLoginSuccess, userAddress };

        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }

    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const addLandRevenueOffice = async (formData) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const transaction = await contract.add_land_revenue(formData.district_id, formData.address);
            await transaction.wait();

            return { success: true, message: 'SRO address added succesfully.' };


        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }


    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const addNotary = async (formData) => {
    console.log("frm  : ", formData);
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const transaction = await contract.add_notary(formData.district_id, formData.address);
            await transaction.wait();

            return { success: true, message: 'Notary address added succesfully.' };


        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }

    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const addSRO = async (formData) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const transaction = await contract.add_sro(formData.district_id, formData.address);
            await transaction.wait();

            return { success: true, message: 'SRO address added succesfully.' };


        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }


    } catch (error) {
        return { success: false, message: error.message };
    }
};

// make land avaible
export const makeLandAvailable = async (index, price) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();



            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const transaction = await contract.make_land_available(index, price);
            await transaction.wait();

            return { success: true, message: 'Land made successfully available.' };


        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }

    } catch (error) {
        console.error('Error registering user:', error.message);
        return { success: false, message: 'User registration failed' };
    }
};

// create request
export const createRequest = async (name, index, price) => {

    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();



            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const transaction = await contract.add_request(name, index, price);
            await transaction.wait();

            return { success: true, message: 'Created request successfully.' };


        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }

    } catch (error) {
        console.error('Error registering user:', error.message);
        return { success: false, message: 'User registration failed' };
    }
};


export const fetchRequestDetails = async (index) => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);

        const properties = await contract.getPropertyRequests(index);

        return {
            success: true,
            properties: properties,
        };
    } catch (error) {
        return {
            success: false,
            msg: error.message,
        };
    }
};

export const acceptRequest = async (index, requestIndex) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);

            const transaction = await contract.accept_request(index, requestIndex.toString());
            await transaction.wait();



            return { success: true, message: 'Request accepted successfully.' };
        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }
    } catch (error) {
        console.error('Error accepting request:', error.message);
        return { success: false, message: 'Failed to accept request' };
    }
};

export const rejectRequest = async (index, requestIndex) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);

            const transaction = await contract.reject_request(index, requestIndex.toString());
            await transaction.wait();



            return { success: true, message: 'Request rejected successfully.' };
        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }
    } catch (error) {
        console.error('Error rejecteing request:', error.message);
        return { success: false, message: 'Failed to reject request' };
    }
};



export const payAllFeesAndBuyProperty = async (index) => {
    try {
        const { success: connectSuccess } = await requestAccount();

        if (connectSuccess) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            // 
            const fees = (await contract.calculate_total_cost(index)).toString();
            // 

            const erc20TokenContract = new ethers.Contract(erc20TokenAddress, ['function approve(address spender, uint amount) returns (bool)'], signer);
            // const gasLimit = 3000000000;

            const approveTransaction = await erc20TokenContract.approve(contractAddress, fees);
            await approveTransaction.wait();


            // Replace 'pay_stamp_duty' with the ERC-20 payment function in your contract
            const transaction = await contract.payAllFeesAndBuyProperty(index);
            await transaction.wait();

            return { success: true, message: 'Property bought successfully.' };
        } else {
            return {
                success: false,
                msg: 'Please connect your wallet!',
            };
        }
    } catch (error) {
        console.error('Error paying stamp duty:', error.message);
        return { success: false, message: 'Failed to pay stamp duty' };
    }
};








