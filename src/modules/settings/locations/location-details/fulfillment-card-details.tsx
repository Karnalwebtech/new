"use client";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { containerVariants, itemVariants } from "@/lib/variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { memo } from "react";
// import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FulfillmentCardDetailsProps {
 title: string;
 addEvent: ()=>void;
}
const FulfillmentCardDetails = ({
title,
addEvent
}: FulfillmentCardDetailsProps) => {
  // const router = useRouter();
  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader className="py-4">
          {/* Header Section */}
          <motion.div className="p-0" variants={itemVariants}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-1">
                  <motion.h2
                    className="text-base font-bold m-0 text-slate-600 dark:text-white"
                    variants={itemVariants}
                  >
                    {title}
                  </motion.h2>
                  <motion.div
                    className="flex items-start gap-2"
                    variants={itemVariants}
                  ></motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Table actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        addEvent()
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Enable
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default memo(FulfillmentCardDetails);
