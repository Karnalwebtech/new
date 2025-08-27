"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface AlertDialogComponenetProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  description: string;
  action: () => void;
  type?: "danger" | "success";
  isLoading?: boolean;
  setDeletedId?: (value: string | null) => void;
}

export function AlertDialogComponenet({
  isOpen,
  setIsOpen,
  title,
  description,
  action,
  type = "danger",
  isLoading = false,
  setDeletedId,
}: AlertDialogComponenetProps) {
  const Icon = type === "success" ? CheckCircle : Trash2;
  const CancelHandler = useCallback(() => {
    setIsOpen(false);
    setDeletedId?.(null);
  }, [setIsOpen, setDeletedId]);
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        className={cn(
          "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-300",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2",
          type === "success"
            ? "bg-green-50 border-green-300"
            : "bg-red-50 border-red-300"
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 rounded-lg">
            <Loader2
              className={cn(
                "h-12 w-12 animate-spin",
                type === "success" ? "text-green-600" : "text-red-600"
              )}
            />
          </div>
        )}

        <AlertDialogHeader className="flex flex-col items-center space-y-2 text-center">
          <div className="relative">
            <Icon
              className={cn(
                "h-8 w-8 animate-in zoom-in-50 duration-500 delay-150 transition-opacity",
                type === "success" ? "text-green-600" : "text-red-600"
              )}
            />
          </div>
          <AlertDialogTitle
            className={cn(
              "text-lg font-semibold animate-in slide-in-from-bottom-1 duration-400 delay-200",
              type === "success" ? "text-green-700" : "text-red-700"
            )}
          >
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 animate-in fade-in-0 duration-400 delay-300">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex justify-center space-x-4 animate-in slide-in-from-bottom-1 duration-400 delay-400">
          <AlertDialogCancel
            onClick={CancelHandler}
            disabled={isLoading}
            className="rounded px-4 py-2 border text-sm transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={action}
            disabled={isLoading}
            className={cn(
              "rounded px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg transform-gpu disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              type === "success"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            )}
          >
            {isLoading
              ? "Loading..."
              : type === "success"
              ? "Got it"
              : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
