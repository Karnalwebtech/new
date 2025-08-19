"use client"
import { memo } from "react"
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, Play, Loader2 } from "lucide-react"
import Image from "next/image"
import { TemplateResult } from "@/types/templates-type"
import { useRouter } from "next/navigation"


interface TemplatesCardProps {
    item: TemplateResult;
    isUse?: boolean;
    deleteLoading?: boolean;
    removeAction?: () => void;
    setPreviewId?: (value: string) => void;
    setTemplate?: (value: string) => void;
}

const TemplatesCard = ({ item, setTemplate, isUse = false, setPreviewId, deleteLoading = false, removeAction }: TemplatesCardProps) => {
    const router = useRouter()

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md group">
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src="/assets/template.png" // Placeholder image, replace with item?.imageUrl if available
                    alt={item?.name || "Template preview"}
                    width={400}
                    height={200}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <CardHeader className="p-4">
                <CardTitle className="text-lg line-clamp-1">{item?.name}</CardTitle>
                <CardDescription className="line-clamp-2">A beautiful template for your content</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">

                {isUse ?

                    <Button
                        onClick={() => setTemplate?.(item?.content)}
                        size="sm"
                        className="flex w-full items-center gap-1 hover:bg-primary hover:text-primary-foreground"
                    >
                        <Play className="h-3.5 w-3.5" />
                        <span>Use Template</span>
                    </Button> :
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/templates/${item?._id}?type=${item?.type}`)}
                            className="flex items-center gap-1 hover:bg-primary hover:text-primary-foreground"
                        >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAction && removeAction()}
                            className="flex items-center gap-1 hover:bg-destructive hover:text-destructive-foreground"
                        >
                            {deleteLoading
                                ? <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span className="text-red-700">Deleting..</span>
                                </>
                                : <>
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                </>
                            }

                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewId?.(item?._id)}
                            className="flex items-center gap-1 hover:bg-secondary hover:text-secondary-foreground"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Preview</span>
                        </Button>
                    </>
                }
            </CardFooter>
        </Card>
    )
}

export default memo(TemplatesCard) // Using memo to prevent unnecessary re-renders [^1]
