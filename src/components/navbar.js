"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACTADDRESS = ""; // Add your contract address if needed

const Navbar = () => {
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    // Connect Wallet and Setup Provider & Signer
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                // Request account access
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });

                // Set account
                setAccount(accounts[0]);
                setConnected(true);

                // Create provider and signer instances
                const providerInstance = new ethers.BrowserProvider(window.ethereum);
                setProvider(providerInstance);

                const signerInstance = await providerInstance.getSigner();
                setSigner(signerInstance);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("MetaMask not detected! Please install MetaMask.");
        }
    };

    // Disconnect Wallet
    const disconnectWallet = async () => {
        setAccount(null);
        setConnected(false);
        setProvider(null);
        setSigner(null);
    };

    // Check if wallet is already connected
    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const providerInstance = new ethers.BrowserProvider(window.ethereum);
                const accounts = await providerInstance.listAccounts();

                if (accounts.length > 0) {
                    setAccount(accounts[0].address);
                    setProvider(providerInstance);

                    const signerInstance = await providerInstance.getSigner();
                    setSigner(signerInstance);
                    setConnected(true);
                }
            }
        };

        checkConnection();
    }, []);

    return (
        <nav className="bg-blue-700 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">PokemonTrade</h1>
                <button
                    onClick={connected ? disconnectWallet : connectWallet}
                    className={`${connected
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        } text-black font-semibold px-4 py-2 rounded-lg transition`}
                >
                    {connected
                        ? `Disconnect (${account.slice(0, 6)}...${account.slice(-4)})`
                        : "Connect Wallet"}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
