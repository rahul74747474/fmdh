// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useMatches, usePlayers } from "../lib/hooks";
import { Gamepad2, Users, DollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: matches = [] } = useMatches();
  const { data: players = [] } = usePlayers();

  const totalMatches = matches.length;
  const totalPlayers = players.length;

  let totalSpent = 0;
  let totalCollected = 0;

  matches.forEach((m: any) => {
    totalSpent += (m.matchFees || 0) + (m.foodFees || 0);
    totalCollected += m.players.reduce((sum: number, p: any) => sum + (p.paid || 0), 0);
  });

  const totalPending = totalSpent - totalCollected;
  const recentMatches = matches.slice(0, 6);

  const analyticsData = [
    { label: "Total Matches", value: totalMatches, icon: Gamepad2, color: "text-primary" },
    { label: "Total Players", value: totalPlayers, icon: Users, color: "text-accent" },
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Collected", value: `₹${totalCollected.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
    { label: "Pending", value: `₹${totalPending.toLocaleString()}`, icon: TrendingUp, color: "text-orange-400" },
  ];

  return (
    <div className="h-full p-4 sm:p-8 space-y-6 sm:space-y-8">

      {/* Buttons - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/create-match" className="w-full sm:w-auto">
          <Button size="lg" className="w-full border-gold-glow">+ Create Match</Button>
        </Link>

        <Link to="/players" className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="w-full">+ Add Player</Button>
        </Link>
      </div>

      {/* Analytics Cards - Fully Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {analyticsData.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border-gold-glow-lg hover:shadow-[0_0_25px_rgba(197,167,106,0.3)] transition-all">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">{item.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{item.value}</p>
                  </div>
                  <Icon className={`${item.color} w-7 h-7 sm:w-8 sm:h-8 opacity-80`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Matches Table */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 gold-underline">Recent Matches</h3>

        <Card className="border-gold-glow">
          <div className="w-full overflow-x-auto rounded-lg">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-primary/20">
                    <TableHead className="text-primary">Match Title</TableHead>
                    <TableHead className="text-primary whitespace-nowrap">Date</TableHead>
                    <TableHead className="text-primary text-center whitespace-nowrap">Players</TableHead>
                    <TableHead className="text-primary text-right whitespace-nowrap">Spent</TableHead>
                    <TableHead className="text-primary text-right whitespace-nowrap">Collected</TableHead>
                    <TableHead className="text-primary text-right whitespace-nowrap">Remaining</TableHead>
                    <TableHead className="text-primary text-center whitespace-nowrap">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recentMatches.map((m: any) => {
                    const playersCount = m.players?.length || 0;
                    const spent = (m.matchFees || 0) + (m.foodFees || 0);
                    const collected = m.players.reduce((sum: number, p: any) => sum + (p.paid || 0), 0);
                    const remaining = spent - collected;

                    return (
                      <TableRow key={m._id} className="border-b border-sidebar-border hover:bg-sidebar-accent/50">
                        <TableCell className="text-white font-medium whitespace-nowrap">{m.title}</TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {new Date(m.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground whitespace-nowrap">{playersCount}</TableCell>
                        <TableCell className="text-right text-white whitespace-nowrap">₹{spent}</TableCell>
                        <TableCell className="text-right text-green-400 whitespace-nowrap">₹{collected}</TableCell>
                        <TableCell className="text-right text-orange-400 whitespace-nowrap">₹{remaining}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          <Link to={`/match/${m._id}`}>
                            <Button variant="ghost" size="sm" className="text-primary">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

              </Table>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
