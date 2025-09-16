import { HTMLAttributes } from "react";

// 필요한 아이콘들만 개별적으로 import (Tree Shaking 최적화)
import {
  FileText,
  Plus,
  Trash2,
  PenTool,
  Search,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  BookText,
  // 툴바 아이콘들
  Undo,
  Redo,
  Code,
  Quote,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  SquareCheck,
  Minus,
  Unlink,
  MousePointer,
  Trash,
  Sun,
  Moon,
} from "lucide-react";

// 아이콘 매핑 객체
const iconMap = {
  FileText,
  Plus,
  Trash2,
  PenTool,
  Search,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  BookText,
  // 툴바 아이콘들
  Undo,
  Redo,
  Code,
  Quote,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  SquareCheck,
  Minus,
  Unlink,
  MousePointer,
  Trash,
  Sun,
  Moon,
} as const;

export interface LucideIconProps extends HTMLAttributes<HTMLOrSVGElement> {
  name: keyof typeof iconMap;
  size?: number;
}

const LucideIcon = ({ name, size = 16, ...props }: LucideIconProps) => {
  const SelectedLucideIcon = iconMap[name];
  if (!SelectedLucideIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  return <SelectedLucideIcon size={size} {...props} />;
};

export default LucideIcon;
