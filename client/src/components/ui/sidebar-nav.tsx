import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  onNavigate: (href: string) => void;
  variant?: "hive" | "garden";
  title?: string;
}

export function SidebarNav({
  items,
  onNavigate,
  variant = "hive",
  title
}: SidebarNavProps) {
  const variantStyles = {
    hive: {
      sidebar: "bg-hive-card-light border-hive-accent/20",
      title: "text-hive-text-primary",
      button: "text-hive-text-primary hover:bg-hive-bg"
    },
    garden: {
      sidebar: "bg-garden-sidebar border-garden-accent/20",
      title: "text-garden-text-on-sage",
      button: "text-garden-text-on-sage hover:bg-white/10"
    }
  };

  const styles = variantStyles[variant];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "w-64 border-r p-6 flex flex-col",
        styles.sidebar
      )}
    >
      {title && (
        <div className="mb-8">
          <h2 className={cn(
            "text-page-heading font-heading",
            styles.title
          )}>
            {title}
          </h2>
        </div>
      )}

      <nav className="space-y-1 flex-1">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.href)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-button text-body transition-colors",
              styles.button
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </motion.aside>
  );
}
