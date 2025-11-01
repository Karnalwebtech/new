import React, { memo } from "react";
import { Card } from "../ui/card";
import { AlertCircle } from "lucide-react";
interface NoRecordsCardProps {
  style?: string;
  title?: string;
  description?: string;
  is_btn?:boolean;
}
const NoRecordsCard = ({
  style = "border border-border p-12",
  title = "No records",
  description = "There are no records to show",
}: NoRecordsCardProps) => {
  return (
    <Card className={style}>
      <div className="flex flex-col items-center justify-center gap-3">
        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
        <div className="text-center">
          <p className="font-medium text-foreground mb-1">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default memo(NoRecordsCard);
