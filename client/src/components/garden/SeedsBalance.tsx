import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp } from "lucide-react";
import { getTierName } from "./types";

interface SeedsBalanceProps {
  seedsData: { seedsBalance: number };
}

export default function SeedsBalance({ seedsData }: SeedsBalanceProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <Card className="border-0 rounded-card shadow-card-sm relative overflow-hidden bg-gold/20">
        <div className="absolute inset-0 bg-gradient-to-r from-garden-accent-light/80 to-garden-accent/30" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-garden-accent rounded-full p-3">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-stat-md font-heading text-garden-text-primary">
                  {seedsData.seedsBalance}
                </p>
                <p className="text-body-sm text-garden-text-secondary">
                  Seeds Balance
                </p>
              </div>
            </div>
            <Badge className="bg-garden-accent text-white text-label px-4 py-2 rounded-badge">
              <TrendingUp className="w-4 h-4 mr-1" />
              {getTierName(seedsData.seedsBalance)} Pollinator
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
