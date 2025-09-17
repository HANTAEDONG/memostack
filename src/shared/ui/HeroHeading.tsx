"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface HeroHeadingProps {
  className?: string;
}

export default function HeroHeading({
  className,
  children,
}: PropsWithChildren<HeroHeadingProps>) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.6 }}
      className={className}
    >
      {children}
    </motion.h1>
  );
}
