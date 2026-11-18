import { LogOut, Menu, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";

interface NavbarProps {
  onMenuClick?: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      console.error("Failed to sign out:", error.message);
      return;
    }

    navigate("/login");
  };

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-pink-600 p-2 text-white">
            <Utensils size={20} />
          </div>

          <span className="text-lg font-bold text-slate-800">Meal Planner</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">{userName}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <Avatar name={userName} size="sm" color="pink" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          leftIcon={<LogOut size={16} />}
          aria-label="Logout"
        >
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
