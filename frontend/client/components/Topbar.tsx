import { useLocation } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/players": "Players",
  "/matches": "Matches",
  "/create-match": "Create Match",
  "/payments": "Payments",
  "/settings": "Settings",
};

export default function Topbar() {
  const location = useLocation();
  const pageName =
    pageNames[location.pathname] || "Dark Hunters Manager";

  return (
    <header className="h-16 bg-[#1A1A1D] border-b border-[#2A2A2D] flex items-center justify-between px-8">
      <h2 className="text-2xl font-bold text-white">{pageName}</h2>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10 border border-primary">
                <AvatarImage src="https://i.pravatar.cc/150?u=user1" />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  Admin
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?u=user1" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  Admin User
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@fmmanager.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
