// src/pages/Matches.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useMatches } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

export default function Matches() {
  const { data: matches = [], isLoading } = useMatches();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMatches = (matches || []).filter((m: any) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full p-4 sm:p-8 space-y-6 sm:space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <Input
          placeholder="Search matches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />

        <Link to="/create-match">
          <Button className="w-full sm:w-auto" size="lg">
            + Create Match
          </Button>
        </Link>
      </div>

      {/* Matches Table */}
      <Card className="border-gold-glow">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-primary/20">
                  <TableHead className="text-primary whitespace-nowrap">Match Title</TableHead>
                  <TableHead className="text-primary whitespace-nowrap">Date</TableHead>
                  <TableHead className="text-primary whitespace-nowrap text-center">Players</TableHead>
                  <TableHead className="text-primary whitespace-nowrap text-right">Total Fees</TableHead>
                  <TableHead className="text-primary whitespace-nowrap text-right">Paid</TableHead>
                  <TableHead className="text-primary whitespace-nowrap text-right">Remaining</TableHead>
                  <TableHead className="text-primary whitespace-nowrap">Status</TableHead>
                  <TableHead className="text-primary whitespace-nowrap text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match: any) => {
                    const playersCount = match.players?.length || 0;

                    // total match + food fees per player
                    const totalFeesPerPlayer = (match.matchFees || 0) + (match.foodFees || 0);

                    // overall amount expected
                    const totalFees = playersCount * totalFeesPerPlayer;

                    // total paid
                    const paid = match.players?.reduce(
                      (s: number, p: any) => s + (p.paid || 0),
                      0
                    );

                    // remaining
                    const remaining = totalFees - paid;

                    const status = remaining <= 0 ? "completed" : "active";

                    return (
                      <TableRow
                        key={match._id}
                        className="border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                      >
                        <TableCell className="font-medium text-white whitespace-nowrap">
                          {match.title}
                        </TableCell>

                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {new Date(match.date).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="text-center text-muted-foreground whitespace-nowrap">
                          {playersCount}
                        </TableCell>

                        <TableCell className="text-right text-white whitespace-nowrap">
                          ₹{totalFees.toLocaleString()}
                        </TableCell>

                        <TableCell className="text-right text-green-400 whitespace-nowrap">
                          ₹{paid.toLocaleString()}
                        </TableCell>

                        <TableCell className="text-right text-orange-400 whitespace-nowrap">
                          ₹{remaining.toLocaleString()}
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-primary/20 text-primary"
                            }
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center whitespace-nowrap">
                          <Link to={`/match/${match._id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary hover:text-primary"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {isLoading ? "Loading..." : "No matches found"}
                      </p>
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
