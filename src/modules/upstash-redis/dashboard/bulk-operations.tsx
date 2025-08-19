"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, 
  // Upload, Download, FileJson, Trash2 
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Separator } from "@/components/ui/separator"
import { InstanceSelector } from "./instance-selector"

const importSchema = z.object({
  format: z.string().min(1, { message: "Format is required" }),
  data: z.string().min(1, { message: "Data is required" }),
  prefix: z.string().optional(),
  replaceExisting: z.boolean().default(false),
})

const exportSchema = z.object({
  format: z.string().min(1, { message: "Format is required" }),
  keyPattern: z.string().min(1, { message: "Key pattern is required" }),
  includeValues: z.boolean().default(true),
})

const bulkDeleteSchema = z.object({
  keyPattern: z.string().min(1, { message: "Key pattern is required" }),
  confirmDelete: z.boolean().default(false),
})

type ImportFormValues = z.infer<typeof importSchema>
type ExportFormValues = z.infer<typeof exportSchema>
type BulkDeleteFormValues = z.infer<typeof bulkDeleteSchema>

export function BulkOperations() {
  const [operationResult, setOperationResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const importForm = useForm<ImportFormValues>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      format: "json",
      data: "",
      prefix: "",
      replaceExisting: false,
    },
  })

  const exportForm = useForm<ExportFormValues>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      format: "json",
      keyPattern: "*",
      includeValues: true,
    },
  })

  const bulkDeleteForm = useForm<BulkDeleteFormValues>({
    resolver: zodResolver(bulkDeleteSchema),
    defaultValues: {
      keyPattern: "",
      confirmDelete: false,
    },
  })

  function onImportSubmit(data: ImportFormValues) {
    setIsLoading(true)

    // Simulate API call to Redis
    setTimeout(() => {
      console.log("Importing data:", data)

      try {
        // Validate JSON if format is JSON
        if (data.format === "json") {
          JSON.parse(data.data)
        }

        setOperationResult({
          success: true,
          message: `Successfully imported data in ${data.format.toUpperCase()} format${data.prefix ? ` with prefix '${data.prefix}'` : ""}`,
        })
      } catch (error) {
        setOperationResult({
          success: false,
          message: `Error parsing ${data.format.toUpperCase()} data: ${(error as Error).message}`,
        })
      }

      setIsLoading(false)
    }, 1500)
  }

  // function onExportSubmit(data: ExportFormValues) {
  //   setIsLoading(true)

  //   // Simulate API call to Redis
  //   setTimeout(() => {
  //     console.log("Exporting data:", data)

  //     // Generate mock export data
  //     const mockExportData =
  //       data.format === "json"
  //         ? JSON.stringify(
  //             {
  //               "user:1001": { name: "John Doe", email: "john@example.com" },
  //               "user:1002": { name: "Jane Smith", email: "jane@example.com" },
  //               "session:abc123": { userId: "1001", loginTime: "2023-09-15T14:30:00Z" },
  //             },
  //             null,
  //             2,
  //           )
  //         : data.format === "csv"
  //           ? 'key,type,value\nuser:1001,hash,{"name":"John Doe","email":"john@example.com"}\nuser:1002,hash,{"name":"Jane Smith","email":"jane@example.com"}\nsession:abc123,string,{"userId":"1001","loginTime":"2023-09-15T14:30:00Z"}'
  //           : "user:1001\nuser:1002\nsession:abc123"

  //     // In a real app, this would trigger a download
  //     console.log("Export data:", mockExportData)

  //     setOperationResult({
  //       success: true,
  //       message: `Successfully exported data in ${data.format.toUpperCase()} format for keys matching '${data.keyPattern}'`,
  //     })

  //     setIsLoading(false)
  //   }, 1500)
  // }

  // function onBulkDeleteSubmit(data: BulkDeleteFormValues) {
  //   if (!data.confirmDelete) {
  //     setOperationResult({
  //       success: false,
  //       message: "Please confirm the deletion by checking the confirmation box",
  //     })
  //     return
  //   }

  //   setIsLoading(true)

  //   // Simulate API call to Redis
  //   setTimeout(() => {
  //     console.log("Bulk deleting keys:", data)

  //     setOperationResult({
  //       success: true,
  //       message: `Successfully deleted keys matching pattern '${data.keyPattern}'`,
  //     })

  //     setIsLoading(false)
  //     bulkDeleteForm.reset({
  //       keyPattern: "",
  //       confirmDelete: false,
  //     })
  //   }, 1500)
  // }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
          <CardDescription>Perform bulk operations on your Redis data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <InstanceSelector />
          </div>

          {operationResult && (
            <Alert className={`mb-6 ${operationResult.success ? "border-green-500" : "border-destructive"}`}>
              {operationResult.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <AlertTitle>{operationResult.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{operationResult.message}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="import" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="import">Import Data</TabsTrigger>
              <TabsTrigger value="export">Export Data</TabsTrigger>
              <TabsTrigger value="bulkDelete">Bulk Delete</TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="mt-6 space-y-6">
              {/* <Form {...importForm}> */}
                {/* <form onSubmit={importForm.handleSubmit(onImportSubmit)} className="space-y-6"> */}
                  {/* <FormField */}
                    {/* control={importForm.control}
                    name="format"
                    render={({ field }) => ( */}
                      {/* // <FormItem>
                        // <FormLabel>Import Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}> */}
                          {/* <FormControl> */}
                            {/* <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger> */}
                          {/* </FormControl> */}
                          {/* <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="rdb">RDB Dump</SelectItem>
                          </SelectContent>
                        </Select> */}
                        {/* // <FormDescription>Format of the data you want to import</FormDescription>
                        // <FormMessage />
                      // </FormItem> */}
                    {/* )} */}
                  {/* /> */}

                  {/* <FormField
                    control={importForm.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <FormControl> */}
                          <Textarea
                            placeholder={
                              importForm.watch("format") === "json"
                                ? '{"key1":"value1","key2":"value2"}'
                                : importForm.watch("format") === "csv"
                                  ? "key,type,value\nuser:1,string,John\nuser:2,string,Jane"
                                  : "Paste RDB data or upload a file"
                            }
                            className="min-h-[200px] font-mono text-sm"
                            // {...field}
                          />
                        {/* </FormControl>
                        <FormDescription className="flex items-center">
                          <FileJson className="mr-2 h-4 w-4" />
                          Paste your data or
                          <Button type="button" variant="link" className="px-1">
                            upload a file
                          </Button>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  {/* <FormField
                    control={importForm.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Prefix (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., import:" {...field} />
                        </FormControl>
                        <FormDescription>Add a prefix to all imported keys</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={importForm.control}
                    name="replaceExisting"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Replace Existing Keys</FormLabel>
                          <FormDescription>Overwrite keys if they already exist</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isLoading ? "Importing..." : "Import Data"}
                  </Button>
                </form>
              </Form> */}
            </TabsContent>

            <TabsContent value="export" className="mt-6 space-y-6">
              {/* <Form {...exportForm}>
                <form onSubmit={exportForm.handleSubmit(onExportSubmit)} className="space-y-6">
                  <FormField
                    control={exportForm.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Export Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="txt">Text (Keys Only)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Format of the exported data</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={exportForm.control}
                    name="keyPattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Pattern</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., user:* or * for all keys" {...field} />
                        </FormControl>
                        <FormDescription>Pattern to match keys for export</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={exportForm.control}
                    name="includeValues"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Include Values</FormLabel>
                          <FormDescription>Export both keys and their values</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <Download className="mr-2 h-4 w-4" />
                    {isLoading ? "Exporting..." : "Export Data"}
                  </Button>
                </form>
              </Form> */}
            </TabsContent>

            <TabsContent value="bulkDelete" className="mt-6 space-y-6">
              {/* <Form {...bulkDeleteForm}>
                <form onSubmit={bulkDeleteForm.handleSubmit(onBulkDeleteSubmit)} className="space-y-6">
                  <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
                    <h3 className="mb-2 font-semibold text-destructive">Danger Zone</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Bulk deletion cannot be undone. Please be certain before proceeding.
                    </p>
                  </div>

                  <FormField
                    control={bulkDeleteForm.control}
                    name="keyPattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Pattern to Delete</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., session:* or cache:*" {...field} />
                        </FormControl>
                        <FormDescription>Pattern to match keys for deletion</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={bulkDeleteForm.control}
                    name="confirmDelete"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I confirm that I want to delete all keys matching this pattern</FormLabel>
                          <FormDescription>This action cannot be undone</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full"
                    disabled={isLoading || !bulkDeleteForm.watch("confirmDelete")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isLoading ? "Deleting..." : "Delete Keys"}
                  </Button>
                </form>
              </Form> */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
