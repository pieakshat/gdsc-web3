import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "@/lib/utils";

export default function TradeRequests({ tradeRequests, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (tradeRequests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">No trade requests</h3>
        <p className="text-gray-500">
          You don t have any pending trade requests
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tradeRequests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <CardHeader className="p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Trade Request from {request.from}
              </CardTitle>
              <Badge
                variant={
                  request.status === "pending"
                    ? "outline"
                    : request.status === "accepted"
                      ? "success"
                      : "destructive"
                }
              >
                {request.status.charAt(0).toUpperCase() +
                  request.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(request.createdAt))} ago
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2 text-center">
                  They re Offering
                </h3>
                <div className="flex flex-col items-center">
                  <div className="relative h-32 w-32 mb-2">
                    <Image
                      src={request.offeringPokemon.image || "/placeholder.svg"}
                      alt={request.offeringPokemon.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h4 className="capitalize font-medium">
                    {request.offeringPokemon.name}
                  </h4>
                  <div className="text-sm text-gray-500">
                    Level: {request.offeringPokemon.level}
                  </div>
                  <Badge className="mt-1 capitalize">
                    {request.offeringPokemon.type}
                  </Badge>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2 text-center">For Your</h3>
                <div className="flex flex-col items-center">
                  <div className="relative h-32 w-32 mb-2">
                    <Image
                      src={
                        request.requestingPokemon.image || "/placeholder.svg"
                      }
                      alt={request.requestingPokemon.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h4 className="capitalize font-medium">
                    {request.requestingPokemon.name}
                  </h4>
                  <div className="text-sm text-gray-500">
                    Level: {request.requestingPokemon.level}
                  </div>
                  <Badge className="mt-1 capitalize">
                    {request.requestingPokemon.type}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-gray-50 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Decline trade")}
            >
              Decline
            </Button>
            <Button size="sm" onClick={() => alert("Accept trade")}>
              Accept Trade
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
