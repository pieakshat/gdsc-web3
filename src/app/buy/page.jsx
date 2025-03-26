import Navbar from "../../components/navbar";

export default function buyNft() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto p-8 text-center">
                <h2 className="text-3xl font-semibold mb-4">
                    Welcome to PokemonTrade!
                </h2>
                <p className="text-lg text-gray-700">
                    Connect your MetaMask wallet to start trading.
                </p>
            </main>
        </div>
    );
}
