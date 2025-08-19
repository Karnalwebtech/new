import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Eye, Trash } from "lucide-react"


export function TableSkeleton() {
    return (
        <div className="border-b border-gray-200">
            <div className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-2 w-1/4">
                    <Skeleton className="h-5 w-32" />
                    {Math.random() > 0.5 && (
                        <div className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">
                            <Skeleton className="h-4 w-12" />
                        </div>
                    )}
                </div>

                <div className="flex-1 flex items-center">
                    <Skeleton className="h-4 w-full max-w-md" />
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <Copy size={18} className="text-gray-300" />
                    </div>
                    <div className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <Eye size={18} className="text-gray-300" />
                    </div>
                    <div className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <Trash size={18} className="text-gray-300" />
                    </div>
                </div>
            </div>
        </div>
    )
}
