// src/pages/CreateMatch.tsx
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Switch } from "../components/ui/switch";
import { usePlayers, useCreateMatch } from "../lib/hooks";
import { Player } from "../types/api";

export default function CreateMatch() {
  const navigate = useNavigate();
  
  // players is now strongly typed
  const { data: players = [], isLoading: playersLoading } = usePlayers();

  // create match mutation typed correctly
  const createMatch = useCreateMatch();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    matchFees: "",
    foodFees: "",
  });

  // selectedPlayers now typed
  const [selectedPlayers, setSelectedPlayers] = useState<
    (Player & { matchFee: boolean; foodFee: boolean })[]
  >([]);

  const handleAddPlayer = (player: Player) => {
    if (!selectedPlayers.some((p) => p._id === player._id)) {
      setSelectedPlayers([
        ...selectedPlayers,
        { ...player, matchFee: true, foodFee: false },
      ]);
    }
  };

  const handleRemovePlayer = (playerId: string) =>
    setSelectedPlayers(selectedPlayers.filter((p) => p._id !== playerId));

  const handleToggleFee = (
    playerId: string,
    feeType: "matchFee" | "foodFee"
  ) => {
    setSelectedPlayers(
      selectedPlayers.map((p) =>
        p._id === playerId ? { ...p, [feeType]: !p[feeType] } : p
      )
    );
  };

  const handleSaveMatch = async () => {
  if (!formData.title || !formData.date || selectedPlayers.length === 0) {
    toast.error("Please fill all required fields");
    return;
  }

  const payload = {
    title: formData.title,
    date: formData.date,
    matchFees: Number(formData.matchFees || 0),
    foodFees: Number(formData.foodFees || 0),
    selectedPlayers: selectedPlayers.map((p) => ({
      playerId: p._id,
      payMatchFee: p.matchFee,
      payFoodFee: p.foodFee,
    })),
  };

  // 🔥 THIS LINE SHOWS EXACTLY WHAT'S SENT TO BACKEND
  console.log("📤 MATCH PAYLOAD SENT TO BACKEND:", payload);

  try {
    await createMatch.mutateAsync(payload);
    toast.success("Match created successfully!");
    navigate("/matches");
  } catch (e) {
    toast.error("Failed to create match");
    console.error(e);
  }
};


  return (
    <div className="h-full p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Match Details */}
          <Card className="border-gold-glow">
            <CardHeader>
              <CardTitle className="text-white">Match Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-foreground">Match Title</Label>
                <Input
                  placeholder="e.g., Guild Tournament"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Match Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-foreground">Match Fees (₹)</Label>
                  <Input
                    type="number"
                    placeholder="1500"
                    value={formData.matchFees}
                    onChange={(e) =>
                      setFormData({ ...formData, matchFees: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-foreground">Food Fees (₹)</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={formData.foodFees}
                  onChange={(e) =>
                    setFormData({ ...formData, foodFees: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Player Selection */}
          <Card className="border-gold-glow">
            <CardHeader>
              <CardTitle className="text-white">Select Players</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 pr-4">
                <div className="space-y-2">
                  {playersLoading && (
                    <p className="text-muted-foreground">Loading players...</p>
                  )}

                  {!playersLoading &&
                    players.map((player) => (
                      <button
                        key={player._id}
                        onClick={() => handleAddPlayer(player)}
                        disabled={selectedPlayers.some(
                          (p) => p._id === player._id
                        )}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                          selectedPlayers.some((p) => p._id === player._id)
                            ? "bg-primary/20 border border-primary text-primary opacity-50 cursor-not-allowed"
                            : "bg-sidebar-accent border border-sidebar-border hover:border-primary hover:bg-primary/10"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-white">
                              {player.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {player.phone}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              selectedPlayers.some(
                                (p) => p._id === player._id
                              )
                                ? "border-primary text-primary"
                                : ""
                            }
                          >
                            {selectedPlayers.some(
                              (p) => p._id === player._id
                            )
                              ? "Added"
                              : "Select"}
                          </Button>
                        </div>
                      </button>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <Card className="border-gold-glow flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="text-white">
                Selected Players ({selectedPlayers.length})
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-3">
                  {selectedPlayers.length > 0 ? (
                    selectedPlayers.map((player) => (
                      <div
                        key={player._id}
                        className="p-3 bg-sidebar-accent border border-primary/20 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-white">
                              {player.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {player.phone}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRemovePlayer(player._id)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-sidebar-border">
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-foreground">
                              Match Fee
                            </label>
                            <Switch
                              checked={player.matchFee}
                              onCheckedChange={() =>
                                handleToggleFee(player._id, "matchFee")
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-xs text-foreground">
                              Food Fee
                            </label>
                            <Switch
                              checked={player.foodFee}
                              onCheckedChange={() =>
                                handleToggleFee(player._id, "foodFee")
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No players selected
                    </p>
                  )}
                </div>
              </ScrollArea>

              <Button
                onClick={handleSaveMatch}
                className="w-full mt-6 h-12 text-base border-gold-glow"
                disabled={createMatch.isPending}
              >
                {createMatch.isPending ? "Saving..." : "Save Match"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
