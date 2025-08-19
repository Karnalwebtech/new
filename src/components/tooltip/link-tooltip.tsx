"use client"
import React, { memo } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface LinkTooltipProps {
    Icon: React.ElementType;
    title?: string;
    path?: string;
    description?: string | number;
    style?:string;
}

const LinkTooltip = ({ Icon, title, path, description,style }: LinkTooltipProps) => {
    const router = useRouter();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button className={`w-0 ${style}`} variant="outline" onClick={() => path && router.push(path)}> {Icon ? <Icon /> : title}</Button>
                </TooltipTrigger>
                {description && <TooltipContent>{description}</TooltipContent>}
            </Tooltip>
        </TooltipProvider>
    );
};

export default memo(LinkTooltip);
