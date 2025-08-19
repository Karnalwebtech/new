import React from "react";
import { Skeleton } from "../ui/skeleton";

interface TableLoaderSkeletonProps {
    length: number;
    content: string[];
    Parenttag: React.ElementType;
    Subtag: React.ElementType;
}

const TableLoaderSkeleton = ({
    length,
    content,
    Parenttag: ParentComponent,
    Subtag: SubComponent,
}: TableLoaderSkeletonProps) => {
    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <ParentComponent key={index} className="border-b">
                    {content.map((_, colIndex) => (
                        <SubComponent key={colIndex} className="p-4">
                            <Skeleton className="h-5 w-full" />
                        </SubComponent>
                    ))}
                </ParentComponent>
            ))}
        </>
    );
};

export default TableLoaderSkeleton;
