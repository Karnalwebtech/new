import React, { memo } from "react";
import { Card } from "../ui/card";
import { AlertCircle } from "lucide-react";

const NoRecordsCard = () => {
  return (
    <Card className="border border-border p-12">
      <div className="flex flex-col items-center justify-center gap-3">
        <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
        <div className="text-center">
          <p className="font-medium text-foreground mb-1">No records</p>
          <p className="text-sm text-muted-foreground">
            There are no records to show
          </p>
        </div>
      </div>
    </Card>
  );
};

export default memo(NoRecordsCard);
