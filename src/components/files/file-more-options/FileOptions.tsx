"use client"
import { DrawerComponent } from '@/components/drawer/drawer-component';
import { close } from '@/reducers/healper-slice';
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileDetails from './file-details';
import { ScrollArea } from "@/components/ui/scroll-area"
import FileForm from './file-form';
import { useGetFileDetailsQuery } from '@/state/file-api';
import { FileData } from '@/types/file-types';

const FileOptions = ({ id ,setIsOpen}: { id: string,setIsOpen:(value:boolean)=>void }) => {
    const isOpen = useSelector((state: RootState) => state?.helper?.isOpen);
    const dispatch = useDispatch()
    const { data, isLoading } = useGetFileDetailsQuery({ id })
    const result: FileData | null = data?.result ?? null;
    const handleClose = () => {
        setIsOpen(false)
        dispatch(close());
    };
    if (!result) {
        return null
    }
    return (
        <div className="absolute right-2 rounded-lg top-2 bg-gray-200">
            <DrawerComponent
                title=""
                description=""
                isOpen={isOpen}
                handleClose={handleClose}
            >
                <div className="max-w-full m-auto h-full max-h-[750px] lg:max-h-[450px]">
                    <Tabs defaultValue="details" className="w-full">
                        <div className="p-2 max-w-[400px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="SEO">Add SEO</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="details" className="m-0 p-0">
                            <ScrollArea className="h-full rounded-md border pb-8 pt-4">
                                <FileDetails result={result && result} isLoading={isLoading} />
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="SEO" className="m-0 p-0">
                            <ScrollArea className="h-full rounded-md border pb-8 pt-4">
                                <FileForm result={result && result} isLoading={isLoading} />
                            </ScrollArea>
                        </TabsContent>

                    </Tabs>
                </div>
            </DrawerComponent>
        </div>
    )
}

export default memo(FileOptions)