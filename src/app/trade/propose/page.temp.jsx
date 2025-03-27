"use client";
export const dynamic = "force-dynamic";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard-header";

export default function ProposeTradePage() {
  const [targetPokemon, setTargetPokemon] = useState(null);
  const [myPokemons, setMyPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pokemonId = searchParams.get("pokemon");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (pokemonId) {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
          );
          const data = await response.json();

          setTargetPokemon({
            id: data.id,
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default,
            level: Math.floor(Math.random() * 100) + 1,
            type: data.types[0].type.name,
            rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"][
              Math.floor(Math.random() * 5)
            ],
            owner: `Trainer${Math.floor(Math.random() * 100) + 1}`,
          });
        }

        // Fetch user's Pokémon collection
        const collectionResponse = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=6"
        );
        const collectionData = await collectionResponse.json();

        const pokemonDetails = await Promise.all(
          collectionData.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.other["official-artwork"].front_default,
              level: Math.floor(Math.random() * 100) + 1,
              type: details.types[0].type.name,
              rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"][
                Math.floor(Math.random() * 5)
              ],
            };
          })
        );

        setMyPokemons(pokemonDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pokemonId]);

  const handleProposeTrade = () => {
    if (!selectedPokemon) {
      alert("Please select a Pokémon to trade");
      return;
    }

    setSubmitting(true);

    // Simulate API call to propose trade
    setTimeout(() => {
      setSubmitting(false);
      router.push("/dashboard?tradeProposed=true");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto p-4 pt-24">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!targetPokemon) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto p-4 pt-24">
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Pokémon Not Found</h3>
            <p className="text-gray-500 mb-4">
              The Pokémon you're looking for doesn't exist
            </p>
            <Link href="/explore">
              <Button>Back to Explore</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto p-4 pt-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Propose a Trade</h1>
          <p className="text-gray-500">
            Select one of your Pokémon to offer for trade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>You Want This Pokémon</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative h-48 w-48 mb-4">
                  <Image
                    src={targetPokemon.image || "/placeholder.svg"}
                    alt={targetPokemon.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold capitalize">
                  {targetPokemon.name}
                </h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">
                    {targetPokemon.type}
                  </Badge>
                  <Badge
                    className={
                      targetPokemon.rarity === "Common"
                        ? "bg-gray-500"
                        : targetPokemon.rarity === "Uncommon"
                          ? "bg-green-500"
                          : targetPokemon.rarity === "Rare"
                            ? "bg-red-500"
                            : targetPokemon.rarity === "Epic"
                              ? "bg-purple-500"
                              : "bg-yellow-500"
                    }
                  >
                    {targetPokemon.rarity}
                  </Badge>
                </div>
                <div className="mt-2 text-gray-500">
                  Level: {targetPokemon.level}
                </div>
                <div className="mt-1 text-gray-500">
                  Owner: {targetPokemon.owner}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>You're Offering</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedPokemon ? (
                <div className="flex flex-col items-center">
                  <div className="relative h-48 w-48 mb-4">
                    <Image
                      src={
                        myPokemons.find((p) => p.id === selectedPokemon)
                          ?.image || ""
                      }
                      alt={
                        myPokemons.find((p) => p.id === selectedPokemon)
                          ?.name || ""
                      }
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold capitalize">
                    {myPokemons.find((p) => p.id === selectedPokemon)?.name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {myPokemons.find((p) => p.id === selectedPokemon)?.type}
                    </Badge>
                    <Badge
                      className={
                        myPokemons.find((p) => p.id === selectedPokemon)
                          ?.rarity === "Common"
                          ? "bg-gray-500"
                          : myPokemons.find((p) => p.id === selectedPokemon)
                            ?.rarity === "Uncommon"
                            ? "bg-green-500"
                            : myPokemons.find((p) => p.id === selectedPokemon)
                              ?.rarity === "Rare"
                              ? "bg-red-500"
                              : myPokemons.find((p) => p.id === selectedPokemon)
                                ?.rarity === "Epic"
                                ? "bg-purple-500"
                                : "bg-yellow-500"
                      }
                    >
                      {myPokemons.find((p) => p.id === selectedPokemon)?.rarity}
                    </Badge>
                  </div>
                  <div className="mt-2 text-gray-500">
                    Level:{" "}
                    {myPokemons.find((p) => p.id === selectedPokemon)?.level}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedPokemon(null)}
                  >
                    Change Selection
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Select a Pokémon from your collection below
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {!selectedPokemon && (
          <Card className="mb-6">
            <CardHeader className="bg-gray-50">
              <CardTitle>Select a Pokémon to Offer</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {myPokemons.map((pokemon) => (
                  <Card
                    key={pokemon.id}
                    className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${selectedPokemon === pokemon.id
                        ? "ring-2 ring-red-500"
                        : ""
                      }`}
                    onClick={() => setSelectedPokemon(pokemon.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={pokemon.image || "/placeholder.svg"}
                            alt={pokemon.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold capitalize">
                            {pokemon.name}
                          </h4>
                          <div className="flex gap-1 mt-1">
                            <Badge
                              variant="outline"
                              className="capitalize text-xs"
                            >
                              {pokemon.type}
                            </Badge>
                            <Badge className="text-xs" variant="secondary">
                              Lvl {pokemon.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <Link href="/explore">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleProposeTrade}
            disabled={!selectedPokemon || submitting}
          >
            {submitting ? "Submitting..." : "Propose Trade"}
          </Button>
        </div>
      </main>
    </div>
  );
}
