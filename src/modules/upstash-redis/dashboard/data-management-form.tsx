"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InstanceSelector } from "./instance-selector"
import InputField from "@/components/fields/input-field"
import SelectFields from "@/components/fields/select-field"
import TextareaField from "@/components/fields/textarea-field"
import SwitchField from "@/components/fields/switch-field"
import { Button } from "@/components/ui/button"

const dataFormSchema = z.object({
  key: z.string().min(1, { message: "Key is required" }),
  dataType: z.string().min(1, { message: "Data type is required" }),
  value: z.string().min(1, { message: "Value is required" }),
  ttl: z.string().optional(),
  enableTTL: z.boolean().default(false),
})

type DataFormValues = z.infer<typeof dataFormSchema>

export function DataManagementForm() {

  const { control,
    handleSubmit, watch, reset,
    formState: { errors }, } = useForm<DataFormValues>({
      resolver: zodResolver(dataFormSchema),
      defaultValues: {
        key: "",
        dataType: "string",
        value: "",
        ttl: "3600",
        enableTTL: false,
      },
    })

  function onSubmit(data: DataFormValues) {
    console.log(data)
  }

  const dataTypeOptions = [
    { key: "string", value: "String" },
    { key: "hash", value: "Hash" },
    { key: "list", value: "List" },
    { key: "set", value: "Set" },
    { key: "zset", value: "Sorted Set" },
  ]

  const getValuePlaceholder = (dataType: string) => {
    switch (dataType) {
      case "string":
        return "Enter string value"
      case "hash":
        return '{"field1":"value1","field2":"value2"}'
      case "list":
        return '["item1","item2","item3"]'
      case "set":
        return '["member1","member2","member3"]'
      case "zset":
        return '{"member1":1,"member2":2,"member3":3}'
      default:
        return "Enter value"
    }
  }

  const getValueDescription = (dataType: string) => {
    switch (dataType) {
      case "string":
        return "A simple string value"
      case "hash":
        return "JSON object with field-value pairs"
      case "list":
        return "JSON array of items"
      case "set":
        return "JSON array of unique members"
      case "zset":
        return "JSON object with member-score pairs"
      default:
        return "Enter value based on selected data type"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
          <form onSubmit={handleSubmit(onSubmit)} >
        <CardHeader>
          <CardTitle>Add or Update Redis Data</CardTitle>
          <CardDescription>Create new keys or update existing ones in your Redis instance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6">
            <InstanceSelector />
          </div>

            <InputField
              control={control}
              errors={errors}
              label="Key"
              name="key"
              placeholder="Enter key name (e.g., user:1001)"
            />
            <SelectFields
              control={control}
              errors={errors}
              label="Data Type"
              name="dataType"
              drop_down_selector={dataTypeOptions}
            />
            <TextareaField
              control={control}
              errors={errors}
              label="Value"
              name="value"
              placeholder={getValuePlaceholder(watch("dataType"))}
            />

            <SwitchField
              control={control}
              errors={errors}
              label="Set Expiration (TTL)"
              name="enableTTL"
            />
            <InputField
              control={control}
              errors={errors}
              label="TTL (seconds)"
              name="ttl"
              placeholder="Enter key name (e.g., user:1001)"
              type="number"
            />

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Button >
            Save Data
          </Button>
        </CardFooter>
          </form>
      </Card>
    </div>
  )
}
