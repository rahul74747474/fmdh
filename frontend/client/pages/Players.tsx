// src/pages/Players.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Phone, Mail } from "lucide-react";
import {
  usePlayers,
  useCreatePlayer,
  useDeletePlayer
} from "@/lib/hooks";
import { toast } from "sonner";

export default function Players() {
  const { data: players = [], isLoading } = usePlayers();
  const createPlayer = useCreatePlayer();
  const deletePlayer = useDeletePlayer();

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const filteredPlayers = players.filter((player: any) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlayer = async () => {
    if (!newPlayer.name || !newPlayer.phone) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      await createPlayer.mutateAsync({
        name: newPlayer.name,
        phone: newPlayer.phone
      });
      setNewPlayer({ name: "", phone: "", email: "" });
      setOpen(false);
      toast.success("Player added");
    } catch (e) {
      toast.error("Failed to add");
      console.error(e);
    }
  };

  const handleDeletePlayer = async (id: string | number) => {
    if (!confirm("Delete player?")) return;

    try {
      await deletePlayer.mutateAsync(id);
      toast.success("Deleted");
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="h-full p-4 sm:p-8 space-y-6 sm:space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <Input
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />

        {/* Add Player Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto">
              + Add Player
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-card border border-primary/30 border-gold-glow">
            <DialogHeader>
              <DialogTitle className="text-white">
                Add New Player
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground">Full Name</Label>
                <Input
                  placeholder="Player name"
                  value={newPlayer.name}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-foreground">Phone Number</Label>
                <Input
                  placeholder="+91-9876543210"
                  value={newPlayer.phone}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, phone: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-foreground">Email</Label>
                <Input
                  placeholder="player@example.com"
                  type="email"
                  value={newPlayer.email}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, email: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <Button className="w-full mt-6" onClick={handleAddPlayer}>
                Save Player
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Players Table */}
      <Card className="border-gold-glow">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-primary/20">
                  <TableHead className="text-primary whitespace-nowrap">Player</TableHead>
                  <TableHead className="text-primary whitespace-nowrap">Phone</TableHead>
                  <TableHead className="text-primary whitespace-nowrap">Email</TableHead>
                  <TableHead className="text-primary whitespace-nowrap text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player: any) => (
                    <TableRow
                      key={player._id}
                      className="border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                    >
                      {/* Player Info */}
                      <TableCell className="flex items-center gap-3 whitespace-nowrap">
                        <Avatar className="h-8 w-8 border border-primary/40">
                          <AvatarImage
                            src={
                              player.avatar ||
                              `https://i.pravatar.cc/150?u=${player._id}`
                            }
                          />
                          <AvatarFallback className="bg-primary text-black">
                            {player.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-white">
                          {player.name}
                        </span>
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          {player.phone}
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          {player.email || "-"}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeletePlayer(player._id)
                          }
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {isLoading ? "Loading..." : "No players found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
