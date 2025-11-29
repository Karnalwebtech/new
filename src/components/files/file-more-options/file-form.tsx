"use client"
import { GeneralBtn } from '@/components/buttons/general-btn'
import InputField from '@/components/fields/input-field'
import Loader from '@/components/loader'
import { useHandleNotifications } from '@/hooks/use-notification-handler'
import { useUpdateFilesMutation } from '@/state/file-api'
import { FileData } from '@/types/file-types'
import { fileFormSchema } from '@/zod-schema/file-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
interface FileFormProps {
    result: FileData;
    isLoading: boolean;
}
const FileForm = ({ result, isLoading = false }: FileFormProps) => {
    const [updateFiles, { isLoading: updateIsLoading, isSuccess, error }] = useUpdateFilesMutation();
    useHandleNotifications({
        error: error,
        isSuccess,
        successMessage: "File updated successfuly",
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof fileFormSchema>>({
        defaultValues: ({
            title: result?.title || "",
            caption: result?.caption || "",
            altText: result?.altText || "",
            width: result?.width || 0,
            height: result?.height || 0,
            signature: result?.signature || "",
        }),
        resolver: zodResolver(fileFormSchema)
    })


    const onSubmit = useCallback(
        async (formData: z.infer<typeof fileFormSchema>) => {
            const updatedData = {
                ...formData,
                id: result?._id
            }
            await updateFiles(updatedData)
        },
        [updateFiles, result]
    );

    return (
        isLoading ? <div className="h-[400px] w-full">
            <Loader />
        </div> :
            <div className='max-w-[600px] m-auto border p-4 rounded-lg overflow-hidden relative'>
                <form className='space-y-2' onSubmit={handleSubmit(onSubmit)} >
                    <InputField
                        control={control}
                        errors={errors}
                        name={"title"}
                        label="Title"
                        placeholder="Title"
                        type="text"
                    />
                    <InputField
                        control={control}
                        errors={errors}
                        name={"caption"}
                        label="Caption"
                        placeholder="Caption"
                        type="text"
                    />
                    <InputField
                        control={control}
                        errors={errors}
                        name={"altText"}
                        label="Alt text"
                        placeholder="Alt text"
                        type="text"
                    />
                    <div className='grid grid-cols-2 gap-4'>
                        <InputField
                            control={control}
                            errors={errors}
                            name={"width"}
                            label="Width"
                            placeholder="100"
                            type="number"
                        />
                        <InputField
                            control={control}
                            errors={errors}
                            name={"height"}
                            label="Height"
                            placeholder="100"
                            type="number"
                        />
                    </div>
                    <InputField
                        control={control}
                        errors={errors}
                        name={"signature"}
                        placeholder={"Optional"}
                        label="Signature"
                        type="text"
                    />

                    <div className='flex justify-end pt-4'>
                        <GeneralBtn
                            style="w-[120px]"
                            title="Submit"
                            type={"submit"}
                            loader={updateIsLoading}
                        />
                    </div>
                </form>
            </div>
    )
}

export default memo(FileForm)