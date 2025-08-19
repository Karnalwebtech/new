import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { copyToClipboard } from "@/services/helpers";
import { Copy } from "lucide-react";
interface CopyBtnProps {
  message: string;
  id: string;
  style?: string;
  disabled?: boolean;
}

const CopyBtn = ({ id, message, disabled = false, style }: CopyBtnProps) => {
  const handelCopy = useCallback(async () => {
    toast.success(message);
    copyToClipboard(id);
  }, [id, message]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={disabled}
            className={`w-0 ${style}`}
            variant="outline"
            onClick={handelCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        {message && <TooltipContent>{message}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyBtn;
