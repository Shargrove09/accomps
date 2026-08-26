"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  btnDanger,
  btnGhost,
  btnPrimary,
  dialogBody,
  dialogClose,
  dialogFooter,
  dialogHeader,
  dialogOverlay,
  dialogPanel,
  dialogText,
  dialogTitle,
} from "@/lib/ui";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "primary";
}) {
  return (
    <div className={dialogOverlay}>
      <div className={cn(dialogPanel, "max-w-md")}>
        <div className={dialogHeader}>
          <h3 className={dialogTitle}>{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className={dialogClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={dialogBody}>
          <p className={dialogText}>{message}</p>
        </div>

        <div className={dialogFooter}>
          <button type="button" onClick={onCancel} className={btnGhost}>
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              variant === "danger" ? btnDanger : btnPrimary,
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ebony-clay",
              variant === "danger" ? "focus:ring-red-500" : "focus:ring-blue-500"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
