"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

const Navbar = ({ setAccount, setProvider, setSigner }) => {
    const [connected, setConnected] = useState(false);
    const [localAccount, setLocalAccount] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });

                const account = accounts[0];
                setLocalAccount(account);
                setAccount(account);
                setConnected(true);

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

    const disconnectWallet = () => {
        setLocalAccount(null);
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setConnected(false);
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const providerInstance = new ethers.BrowserProvider(window.ethereum);
                const accounts = await providerInstance.listAccounts();

                if (accounts.length > 0) {
                    const account = accounts[0].address;
                    setLocalAccount(account);
                    setAccount(account);
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
                        ? `Disconnect (${localAccount?.slice(0, 6)}...${localAccount?.slice(-4)})`
                        : "Connect Wallet"}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
