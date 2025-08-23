import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React from "react";
import { VisuallyHidden } from "../ui/visually-hidden";
interface DialogComponentProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  onSubmit?: () => void;
  isOpen: boolean;
  handleClose: () => void;
}
const DialogPopUp = ({
  title = "Move Goal",
  description = "Set your daily activity goal.",
  children,
  showHeader = false,
  showFooter = false,
  isOpen = false,
  handleClose,
  onSubmit,
}: DialogComponentProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[98%] max-h-full rounded-lg overflow-hidden [&>button]:hidden border-0 m-auto p-0">
        <div ref={contentRef} className="flex flex-col h-full">
          {showHeader ? (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          ) : (
            <VisuallyHidden>
              <DialogTitle>{title}</DialogTitle>
            </VisuallyHidden>
          )}
          <div className="flex-1 overflow-y-auto">{children}</div>
          {showFooter && (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>Save changes</Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPopUp;
