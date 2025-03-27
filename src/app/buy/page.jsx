"use client"
import Navbar from "../../components/navbar";
import { ethers } from "ethers";
import abi from "../../../abis/poke.json"
import { useState } from "react";

import charmanderImg from "../../assets/charmender.webp";
import bulbasaurImg from "../../assets/bulba.webp";
import squirtleImg from "../../assets/squirtle.webp";

const CONTRACT_ADDRESS = "0x1e6216a8c755865970da966069157e676aF3c9A3"

export default function buyNft(id) {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [loadingId, setLoadingId] = useState(null);


    const pokemonList = [
        {
            id: 1,
            name: "Charmander",
            description: "A fire-type Pokémon known for its fiery tail.",
            image: charmanderImg,
        },
        {
            id: 2,
            name: "Bulbasaur",
            description: "A grass-type Pokémon with a seed on its back.",
            image: bulbasaurImg,
        },
        {
            id: 3,
            name: "Squirtle",
            description: "A water-type Pokémon that shoots water.",
            image: squirtleImg,
        },
    ];

    const mint = async (pokemonId) => {
        if (!signer) return alert("Connect your wallet first.");

        try {
            setLoadingId(pokemonId);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

            const mintPrice = ethers.parseEther("0.001");
            const tx = await contract.mintPokemon(pokemonId, {
                value: mintPrice,
            });

            await tx.wait();
            alert(`You successfully minted ${pokemonList[pokemonId - 1].name}!`);
            alert(`view your transaction here: https://base-sepolia.blockscout.com/${tx.hash}`,)
        } catch (err) {
            console.error(err);
            alert("Transaction failed. You might have already minted.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar
                setAccount={setAccount}
                setProvider={setProvider}
                setSigner={setSigner}
            />

            <main className="container mx-auto p-8 text-center">
                <h2 className="text-3xl font-bold mb-8 text-blue-700">Choose Your Pokémon</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pokemonList.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center"
                        >
                            <img src={pokemon.image.src} alt={pokemon.name} className="w-40 h-40 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{pokemon.name}</h3>
                            <p className="text-gray-600 mb-4">{pokemon.description}</p>
                            <button
                                onClick={() => mint(pokemon.id)}
                                disabled={loadingId === pokemon.id}
                                className={`${loadingId === pokemon.id
                                    ? "bg-gray-400"
                                    : "bg-yellow-500 hover:bg-yellow-600"
                                    } text-black font-bold px-4 py-2 rounded-md transition`}
                            >
                                {loadingId === pokemon.id ? "Minting..." : `Mint ${pokemon.name}`}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

