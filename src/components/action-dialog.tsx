import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { memo, useCallback } from "react";
type DialogFieldType = "none" | "cc" | "bcc" | "both";

interface DialogAction {
  title?: string;
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
  description?: string;
  actionList: { key: DialogFieldType; value: string }[]; // fix is here
  setDialogField: (value: DialogFieldType) => void;
}
const DialogAction = ({ isOpen = false, setIsOpen, actionList, setDialogField, title, description }: DialogAction) => {
    const onSelectAction = useCallback((value: "none" | "cc" | "bcc" | "both") => {
        setDialogField(value)
        setIsOpen(false)
    }, [setDialogField, setIsOpen])
    return (
        <AlertDialog
            open={isOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col gap-2">
                    {actionList.map((item) => (
                        <Button variant="outline" key={item.key}
                            onClick={() => onSelectAction(item.key)}
                        >{item.value}</Button>
                    ))}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
export default memo(DialogAction)