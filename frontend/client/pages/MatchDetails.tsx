// src/pages/MatchDetails.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useMatch, useAddPayment } from "@/lib/hooks";

export default function MatchDetails() {
  const { id } = useParams();
  const matchId = id!;
  const navigate = useNavigate();

  const { data: match, isLoading } = useMatch(matchId);
  const addPayment = useAddPayment();

  const [open, setOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ playerId: "", amount: "" });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!match) return <div className="p-8">Match not found</div>;

  const totalFees = match.players.reduce(
    (sum, p) => sum + (p.matchFeeAmount || 0) + (p.foodFeeAmount || 0),
    0
  );
  const totalPaid = match.players.reduce((sum, p) => sum + (p.paid || 0), 0);
  const totalRemaining = totalFees - totalPaid;

  const handleAddPayment = async () => {
    if (!paymentForm.playerId || !paymentForm.amount) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addPayment.mutateAsync({
        matchId,
        playerId: paymentForm.playerId,
        amount: Number(paymentForm.amount),
      });

      setPaymentForm({ playerId: "", amount: "" });
      setOpen(false);
      toast.success("Payment recorded!");
    } catch (e) {
      toast.error("Failed to add payment");
      console.error(e);
    }
  };

  return (
    <div className="h-full p-4 sm:p-8 space-y-6 sm:space-y-8">

      {/* Back Button */}
      <button
        onClick={() => navigate("/matches")}
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Matches
      </button>

      {/* Match Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{match.title}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {match.date ? match.date : "No date available"}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-gold-glow">
          <CardContent className="p-5 sm:p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Total Fees</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary mt-1">
                  ₹{totalFees.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold-glow">
          <CardContent className="p-5 sm:p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Total Paid</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-1">
                  ₹{totalPaid.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-green-400 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold-glow">
          <CardContent className="p-5 sm:p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Remaining</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-400 mt-1">
                  ₹{totalRemaining.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-orange-400 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Fee Table */}
      <Card className="border-gold-glow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-lg sm:text-xl">Player Payments</CardTitle>

          {/* Add Payment Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="sm:size-md">
                <Plus className="w-4 h-4 mr-2" /> Add Payment
              </Button>
            </DialogTrigger>

            {/* Dialog */}
            <DialogContent className="bg-card border border-primary/30 border-gold-glow">
              <DialogHeader>
                <DialogTitle className="text-white">Record Payment</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Player</Label>
                  <select
                    value={paymentForm.playerId}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, playerId: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-primary/30 bg-input px-3 py-2 mt-1"
                  >
                    <option value="">Select a player</option>
                    {match.players.map((p: any) => (
                      <option key={p.player._id} value={p.player._id}>
                        {p.player.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-foreground">Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <Button onClick={handleAddPayment} className="w-full mt-4">
                  {addPayment.isPending ? "Saving..." : "Save Payment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[850px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-primary/20">
                    <TableHead className="text-primary whitespace-nowrap">Player</TableHead>
                    <TableHead className="text-primary whitespace-nowrap text-right">Match Fee</TableHead>
                    <TableHead className="text-primary whitespace-nowrap text-right">Food Fee</TableHead>
                    <TableHead className="text-primary whitespace-nowrap text-right">Total</TableHead>
                    <TableHead className="text-primary whitespace-nowrap text-right">Paid</TableHead>
                    <TableHead className="text-primary whitespace-nowrap text-right">Remaining</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {match.players.map((entry: any) => {
                    const matchFee = entry.matchFeeAmount || 0;
                    const foodFee = entry.foodFeeAmount || 0;
                    const total = matchFee + foodFee;
                    const paid = entry.paid || 0;
                    const remaining = total - paid;

                    return (
                      <TableRow key={entry.player._id}>
                        <TableCell className="text-white font-medium whitespace-nowrap">
                          {entry.player.name}
                        </TableCell>

                        <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                          ₹{matchFee}
                        </TableCell>

                        <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                          ₹{foodFee}
                        </TableCell>

                        <TableCell className="text-right text-white whitespace-nowrap">
                          ₹{total}
                        </TableCell>

                        <TableCell className="text-right text-green-400 whitespace-nowrap">
                          ₹{paid}
                        </TableCell>

                        <TableCell className="text-right text-orange-400 whitespace-nowrap">
                          ₹{remaining}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
