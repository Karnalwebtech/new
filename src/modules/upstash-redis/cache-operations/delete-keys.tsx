"use client"

import { memo, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import InputField from "@/components/fields/input-field"
import { useCacheFlushMutation, useClearCacheByPatternMutation } from "@/state/upstash-redis-api"
import { useHandleNotifications } from "@/hooks/use-notification-handler"
import { AlertDialogComponenet } from "@/components/alert-dialog"

const deleteKeySchema = z.object({
  keyPattern: z.string().min(1, { message: "Key pattern is required" }),
})

type DeleteKeyFormValues = z.infer<typeof deleteKeySchema>

const DeleteKeys = () => {
  const [isOpen, setIsOpen] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DeleteKeyFormValues>({
    resolver: zodResolver(deleteKeySchema),
    defaultValues: { keyPattern: "" },
  })

  const [clearCacheByPattern, { isLoading, isSuccess, error }] = useClearCacheByPatternMutation()
  const [cacheFlush, { isLoading: flushLoading, isSuccess: flushSuccess, error: flushError }] = useCacheFlushMutation()

  useHandleNotifications({
    error: error || flushError,
    isSuccess: isSuccess || flushSuccess,
    successMessage: `Cache ${flushSuccess ? "flush" : "clear"} successfully`,
  })

  useEffect(() => {
    if (isSuccess) setValue("keyPattern", "")
  }, [isSuccess, setValue])

  const onDeleteSubmit = useCallback(
    async (data: DeleteKeyFormValues) => {
      await clearCacheByPattern({ key: data.keyPattern })
    },
    [clearCacheByPattern]
  )

  const handleFlushDB = useCallback(async () => {
    setIsOpen(false)
    await cacheFlush()
  }, [cacheFlush])

  const processRemoveItem = useCallback(() => {
    setIsOpen(true)
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit(onDeleteSubmit)} className="space-y-6">
        <div>
          <InputField
            control={control}
            errors={errors}
            label="Key Pattern to Delete"
            name="keyPattern"
            placeholder="Enter key pattern (e.g., session:* or specific key)"
          />
          <p className="text-gray-600 text-xs">
            Use * as a wildcard (e.g., session:* to delete all session keys)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button type="submit" variant="destructive" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Keys
          </Button>
        </div>
      </form>

      <div className="mt-8 rounded-md border border-destructive/20 bg-destructive/5 p-4">
        <h3 className="mb-2 font-semibold text-destructive">Danger Zone</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          These actions cannot be undone. Please be certain before proceeding.
        </p>
        <Button
          variant="destructive"
          onClick={processRemoveItem}
          disabled={flushLoading}
        >
          {flushLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Flush Database (Delete All Keys)
        </Button>
      </div>

      {isOpen && (
        <AlertDialogComponenet
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete all keys from your cache."
          action={handleFlushDB}
          type="danger"
        />
      )}
    </>
  )
}

export default memo(DeleteKeys)
