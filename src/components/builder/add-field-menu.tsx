"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, Type, AtSign, Hash, AlignLeft, ChevronDown, Circle, CheckSquare, Star, Upload, Calendar } from "lucide-react";
import type { FieldType } from "@/types/form";
import { FIELD_TYPE_LABELS } from "@/types/form";

const ICONS: Record<FieldType, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  email: <AtSign className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  textarea: <AlignLeft className="h-4 w-4" />,
  select: <ChevronDown className="h-4 w-4" />,
  radio: <Circle className="h-4 w-4" />,
  checkbox: <CheckSquare className="h-4 w-4" />,
  rating: <Star className="h-4 w-4" />,
  file: <Upload className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
};

interface AddFieldMenuProps {
  onAdd: (type: FieldType) => void;
  disabled?: boolean;
}

const QUICK: FieldType[] = ["text", "email", "textarea", "select", "checkbox", "rating"];

export function AddFieldMenu({ onAdd, disabled }: AddFieldMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled} className="gap-2">
          <Plus className="h-4 w-4" />
          Add field
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Quick add</DropdownMenuLabel>
        {QUICK.map((t) => (
          <DropdownMenuItem key={t} onClick={() => onAdd(t)}>
            {ICONS[t]}
            <span>{FIELD_TYPE_LABELS[t]}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>More</DropdownMenuLabel>
        {(Object.keys(FIELD_TYPE_LABELS) as FieldType[])
          .filter((t) => !QUICK.includes(t))
          .map((t) => (
            <DropdownMenuItem key={t} onClick={() => onAdd(t)}>
              {ICONS[t]}
              <span>{FIELD_TYPE_LABELS[t]}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
