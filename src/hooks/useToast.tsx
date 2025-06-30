"use client"

import { toast as sonnerToast } from "sonner"
import type { ReactNode } from "react"

type ToastVariant = "default" | "success" | "error" | "destructive" | "info" | "warning"

interface ToastOptions {
  title?: ReactNode
  description?: ReactNode
  variant?: ToastVariant
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

export function useToast() {
  const showToast = ({
    title,
    description,
    variant = "default",
    action,
    duration = 3000, // long duration as you had before
  }: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <div
        className={`flex flex-col rounded-md shadow-md p-4 text-white ${
          {
            success: "bg-green-600",
            error: "bg-red-600",
            destructive: "bg-red-800",
            info: "bg-blue-600",
            warning: "bg-yellow-600 text-black",
            default: "bg-gray-800",
          }[variant]
        }`}
      >
        {title && <div className="font-bold">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
        {action && (
          <button
            className="mt-2 text-xs underline"
            onClick={() => {
              action.onClick()
              sonnerToast.dismiss(t)
            }}
          >
            {action.label}
          </button>
        )}
      </div>
    ), { duration })
  }

  const dismiss = (toastId?: string | number) => sonnerToast.dismiss(toastId)

  // Optional helpers
  const withVariant = (variant: ToastVariant) => (opts: Omit<ToastOptions, "variant">) =>
    showToast({ ...opts, variant })

  return {
    toast: showToast,
    dismiss,
    success: withVariant("success"),
    error: withVariant("error"),
    destructive: withVariant("destructive"),
    info: withVariant("info"),
    warning: withVariant("warning"),
  }
}
