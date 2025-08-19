"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const settingsFormSchema = z.object({
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
  defaultRegion: z.string({
    required_error: "Please select a default region.",
  }),
  notifyOnEvents: z.boolean().default(false),
  notifyEmail: z.string().email().optional(),
  autoBackup: z.boolean().default(false),
  backupFrequency: z.string().optional(),
  maxMemoryPolicy: z.string({
    required_error: "Please select a memory policy.",
  }),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

const defaultValues: Partial<SettingsFormValues> = {
  apiKey: "upstash_12345abcdef",
  defaultRegion: "us-east-1",
  notifyOnEvents: true,
  notifyEmail: "admin@example.com",
  autoBackup: true,
  backupFrequency: "daily",
  maxMemoryPolicy: "volatile-lru",
}

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  })

  function onSubmit(data: SettingsFormValues) {
    // In a real application, this would save the settings to the server
    console.log(data)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>Manage your Upstash Redis API settings and credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormDescription>Your Upstash Redis API key for authentication.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultRegion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Region</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                        <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
                        <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
                        <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The default region for new Redis instances.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save API Settings</Button>
            </form>
          </Form> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you want to be notified about Redis events.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="notifyOnEvents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable Event Notifications</FormLabel>
                      <FormDescription>Receive notifications for important Redis events.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notifyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormDescription>Email address for receiving notifications.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save Notification Settings</Button>
            </form>
          </Form> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Settings</CardTitle>
          <CardDescription>Configure automatic backups for your Redis instances.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="autoBackup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable Automatic Backups</FormLabel>
                      <FormDescription>Automatically backup your Redis data for disaster recovery.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backupFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backup Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How often to create backups of your Redis data.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save Backup Settings</Button>
            </form>
          </Form> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redis Configuration</CardTitle>
          <CardDescription>Configure global Redis settings for all instances.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="maxMemoryPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Memory Policy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="noeviction">No Eviction</SelectItem>
                        <SelectItem value="allkeys-lru">All Keys LRU</SelectItem>
                        <SelectItem value="volatile-lru">Volatile LRU</SelectItem>
                        <SelectItem value="allkeys-random">All Keys Random</SelectItem>
                        <SelectItem value="volatile-random">Volatile Random</SelectItem>
                        <SelectItem value="volatile-ttl">Volatile TTL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How Redis should handle memory when the maximum memory limit is reached.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save Redis Configuration</Button>
            </form>
          </Form> */}
        </CardContent>
      </Card>
    </div>
  )
}
