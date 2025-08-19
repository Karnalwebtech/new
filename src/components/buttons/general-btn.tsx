"use client";

import { Loader2, Save } from "lucide-react";
import { Button } from "../ui/button";

interface GeneralBtnProps {
    title: string;
    loader?: boolean;
    submit?: () => void;
    isIcon?: boolean;
    type?: "submit" | "button" | "reset";
    style?: string;
    Icon?: React.ElementType;
}

export const GeneralBtn: React.FC<GeneralBtnProps> = ({
    title,
    loader = false,
    submit,
    isIcon = true,
    type = "button",
    style = "w-full",
    Icon,
}) => {
    return (
        <Button className={style} type={type} disabled={loader} {...(submit && { onClick: submit })}>
            {loader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isIcon && Icon?<Icon/>:<Save className="h-4 w-4 mr-2" />}
            {title}
        </Button>
    );
};  