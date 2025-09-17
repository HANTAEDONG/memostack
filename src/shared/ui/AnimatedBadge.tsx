"use client";

import { motion } from "framer-motion";
import { Badge } from "@/shared/ui/shadcn/badge";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedBadge({
  children,
  className,
}: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex justify-center"
    >
      <Badge variant="secondary" className={className}>
        {children}
      </Badge>
    </motion.div>
  );
}
