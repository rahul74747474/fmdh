// src/pages/Payments.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { useMatches, useAddPayment } from "@/lib/hooks";

export default function Payments() {
  const { data: matches = [] } = useMatches();
  const addPayment = useAddPayment();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMatch, setFilterMatch] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [paymentInputs, setPaymentInputs] = useState<{ [id: string]: string }>({});

  /* -----------------------------------------------------------
      BUILD PAYMENT RECORDS
  ----------------------------------------------------------- */
  const paymentRecords = matches.flatMap((m: any) =>
    m.players.map((p: any) => ({
      id: `${m._id}-${p.player._id}`,
      matchId: m._id,
      playerId: p.player._id,
      player: p.player.name,
      match: m.title,

      totalFee: Number((p.totalAmount || 0).toFixed(2)),
      amount: Number((p.paid || 0).toFixed(2)),
      remain: Number((p.totalAmount - p.paid).toFixed(2)),

      date: m.date,
      status: p.paid >= p.totalAmount ? "completed" : "pending"
    }))
  );

  const uniqueMatches = [...new Set(matches.map((m: any) => m.title))];

  /* -----------------------------------------------------------
      FILTER RECORDS
  ----------------------------------------------------------- */
  const filteredPayments = paymentRecords.filter((payment) => {
    const s = searchTerm.toLowerCase();
    return (
      (payment.player.toLowerCase().includes(s) ||
        payment.match.toLowerCase().includes(s)) &&
      (filterMatch === "all" || payment.match === filterMatch) &&
      (filterStatus === "all" || payment.status === filterStatus)
    );
  });

  /* -----------------------------------------------------------
      SUMMARY CARDS
  ----------------------------------------------------------- */
  const totalAmount = filteredPayments.reduce((s, p) => s + p.totalFee, 0);
  const totalPaid = filteredPayments.reduce((s, p) => s + p.amount, 0);
  const totalPending = totalAmount - totalPaid;

  /* -----------------------------------------------------------
      HANDLE PAYMENT
  ----------------------------------------------------------- */
  const handlePayment = async (row: any) => {
    const amount = paymentInputs[row.id];

    if (!amount || isNaN(Number(amount))) return;

    await addPayment.mutateAsync({
      matchId: row.matchId,
      playerId: row.playerId,
      amount: Number(amount)
    });

    setPaymentInputs((prev) => ({ ...prev, [row.id]: "" }));
  };

  return (
    <div className="h-full p-4 sm:p-8 space-y-6 sm:space-y-8">

      {/* ---------------- SUMMARY CARDS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Total Amount */}
        <Card className="border-gold-glow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Total Amount</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary mt-1 sm:mt-2">
                  ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Paid */}
        <Card className="border-gold-glow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Total Paid</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-1 sm:mt-2">
                  ₹{totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="border-gold-glow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Pending Amount</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-400 mt-1 sm:mt-2">
                  ₹{totalPending.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 opacity-80" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ---------------- FILTERS ---------------- */}
      <div className="flex flex-col sm:flex-row gap-4">

        <Input
          placeholder="Search player or match..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />

        <Select value={filterMatch} onValueChange={setFilterMatch}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Match" />
          </SelectTrigger>
          <SelectContent>
            {["all", ...uniqueMatches].map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* ---------------- TABLE ---------------- */}
      <Card className="border-gold-glow">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-primary/20">
                  <TableHead className="text-primary">Player</TableHead>
                  <TableHead className="text-primary">Match</TableHead>
                  <TableHead className="text-primary text-right">Total Fee</TableHead>
                  <TableHead className="text-primary text-right">Paid</TableHead>
                  <TableHead className="text-primary text-right">Remaining</TableHead>
                  <TableHead className="text-primary text-center">Add Payment</TableHead>
                  <TableHead className="text-primary">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPayments.length ? (
                  filteredPayments.map((p) => (
                    <TableRow key={p.id} className="border-b border-sidebar-border">

                      <TableCell className="text-white">{p.player}</TableCell>
                      <TableCell className="text-muted-foreground">{p.match}</TableCell>

                      <TableCell className="text-right text-white">₹{p.totalFee.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-white">₹{p.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-white">₹{p.remain.toFixed(2)}</TableCell>

                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">

                          <Input
                            type="number"
                            placeholder="₹"
                            value={paymentInputs[p.id] ?? ""}
                            onChange={(e) =>
                              setPaymentInputs({
                                ...paymentInputs,
                                [p.id]: e.target.value
                              })
                            }
                            className="w-20 h-8 px-2 text-sm bg-[#1a1a1d] text-white"
                          />

                          <button
                            onClick={() => handlePayment(p)}
                            className="px-3 h-8 rounded bg-primary text-black text-sm hover:bg-primary/80"
                          >
                            Add
                          </button>

                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={
                            p.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }
                        >
                          {p.status}
                        </Badge>
                      </TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No payments found
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
