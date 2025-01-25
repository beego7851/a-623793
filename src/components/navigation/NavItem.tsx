import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface NavItemProps {
  name: string;
  tab: string;
  onClick: () => void;
  isActive?: boolean;
}

const NavItem = memo(({ name, tab, onClick, isActive }: NavItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 text-sm font-medium",
        "hover:bg-dashboard-hover/10 hover:text-white",
        "transition-colors duration-200",
        isActive && "bg-dashboard-hover/10 text-white"
      )}
      onClick={onClick}
    >
      {name}
    </Button>
  );
});

NavItem.displayName = "NavItem";

export default NavItem;