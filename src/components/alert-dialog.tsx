import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertDialogComponenetProps {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    title: string
    description: string
    action: () => void
    type?: "danger" | "success"
}

export function AlertDialogComponenet({
    isOpen,
    setIsOpen,
    title,
    description,
    action,
    type = "danger",
}: AlertDialogComponenetProps) {
    const Icon = type === "success" ? CheckCircle : Trash2

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className={cn(
                "transition-all duration-300 ease-in-out",
                type === "success" ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
            )}>
                <AlertDialogHeader className="flex flex-col items-center space-y-2 text-center">
                    <Icon className={cn(
                        "h-8 w-8",
                        type === "success" ? "text-green-600" : "text-red-600"
                    )} />
                    <AlertDialogTitle className={cn(
                        "text-lg font-semibold",
                        type === "success" ? "text-green-700" : "text-red-700"
                    )}>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 flex justify-center space-x-4">
                    <AlertDialogCancel
                        onClick={() => setIsOpen(false)}
                        className="rounded px-4 py-2 border text-sm"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={action}
                        className={cn(
                            "rounded px-4 py-2 text-sm font-medium",
                            type === "success"
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-red-600 text-white hover:bg-red-700"
                        )}
                    >
                        {type === "success" ? "Got it" : "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
