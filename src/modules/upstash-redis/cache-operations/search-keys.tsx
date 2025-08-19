"use client"
import { useCallback, useEffect, useState } from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import InputField from '@/components/fields/input-field'
import { Button } from '@/components/ui/button'
import { Search, Trash2 } from 'lucide-react'
import React from 'react'
import { DataBrowser } from "../dashboard/data-browser"
import { useClearCacheUsingKeysMutation } from "@/state/upstash-redis-api"
import { useHandleNotifications } from "@/hooks/use-notification-handler"
const searchKeySchema = z.object({
    searchPattern: z.string().min(1, { message: "Search pattern is required" }),
})

type SearchKeyFormValues = z.infer<typeof searchKeySchema>

const SearchKeys = () => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const [searchValues, setSearchValues] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [clearCacheUsingKeys, { isLoading: deleteLoading, error, isSuccess }] = useClearCacheUsingKeysMutation()

    useHandleNotifications({
        error: error,
        isSuccess,
        successMessage: "Cache clear successfully"
    });

    const searchForm = useForm<SearchKeyFormValues>({
        resolver: zodResolver(searchKeySchema),
        defaultValues: {
            searchPattern: "",
        },
    })


    const clearCacheHandler = useCallback(
        async () => {
            if (selectedKeys.length > 0) {
                await clearCacheUsingKeys({ keys: selectedKeys }); // Your function to remove keys
                return
            };

        },
        [clearCacheUsingKeys, selectedKeys]
    );



    function onSearchSubmit(data: SearchKeyFormValues) {
        setIsLoading(true)
        setTimeout(() => {
            if (data.searchPattern.trim().length > 0) {
                setSearchValues(data?.searchPattern.trim())
            }
            setIsLoading(false)
        }, 1000)
    }


    useEffect(() => {
        if (isSuccess) {
            setSelectedKeys([])
        }
    }, [setSelectedKeys, isSuccess])

    return (
        <>
            <div className="grid lg:grid-cols-2 grid-cols-1 space-x-2">
                <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="flex items-start space-x-2">
                    <InputField
                        control={searchForm.control}
                        errors={searchForm.formState.errors}
                        name="searchPattern"
                        type="search"
                        placeholder="Enter search pattern (e.g., user:* or *)"
                        inputStyle={"w-[200px] lg:w-[300px]"}
                    />
                    <Button type="submit" disabled={isLoading}>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>

                </form>

                <div className="flex mt-4 lg:mt-0 lg:justify-end">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={clearCacheHandler}
                            disabled={selectedKeys.length === 0 || deleteLoading}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Selected ({selectedKeys.length})
                        </Button>
                    </div>
                </div>
            </div>

            {searchValues.length > 0 && (
                <div className="space-y-4">
                    <div className="rounded-md border">
                        <DataBrowser isHeaderVisiable={false} searchKey={searchValues} setSelectedDeleteIds={setSelectedKeys} />
                    </div>
                </div>
            )}

            {searchValues.length === 0 && (
                <div className="rounded-md border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">No keys found matching the pattern</p>
                </div>
            )}
        </>
    )
}

export default SearchKeys