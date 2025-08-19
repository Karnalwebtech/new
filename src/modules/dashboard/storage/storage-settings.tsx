"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Cloud, HardDrive, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function StorageSettings() {
  // Mock initial settings based on the Mongoose schema
  const [storageType, setStorageType] = useState("cloud")
  const [cloudProvider, setCloudProvider] = useState("google drive")
  const [encryptionEnabled, setEncryptionEnabled] = useState(false)
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState("AES-256")
  const [backupEnabled, setBackupEnabled] = useState(false)
  const [backupFrequency, setBackupFrequency] = useState("weekly")
  const [retentionEnabled, setRetentionEnabled] = useState(false)
  const [retentionPeriod, setRetentionPeriod] = useState(30)

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="backup">Backup & Retention</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Storage Configuration</CardTitle>
            <CardDescription>Configure your storage type and provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="storage-type">Storage Type</Label>
                <Select value={storageType} onValueChange={setStorageType}>
                  <SelectTrigger id="storage-type">
                    <SelectValue placeholder="Select storage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">
                      <div className="flex items-center">
                        <HardDrive className="mr-2 h-4 w-4" />
                        <span>Local Storage</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cloud">
                      <div className="flex items-center">
                        <Cloud className="mr-2 h-4 w-4" />
                        <span>Cloud Storage</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {storageType === "cloud" && (
                <div>
                  <Label htmlFor="cloud-provider">Cloud Provider</Label>
                  <Select value={cloudProvider} onValueChange={setCloudProvider}>
                    <SelectTrigger id="cloud-provider">
                      <SelectValue placeholder="Select cloud provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google drive">Google Drive</SelectItem>
                      <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
                      <SelectItem value="azure">Microsoft Azure</SelectItem>
                      <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure encryption and security options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="encryption" className="flex flex-col space-y-1">
                <span>Encryption</span>
                <span className="text-xs text-muted-foreground">Enable encryption for your stored files</span>
              </Label>
              <Switch id="encryption" checked={encryptionEnabled} onCheckedChange={setEncryptionEnabled} />
            </div>

            {encryptionEnabled && (
              <div>
                <Label htmlFor="encryption-algorithm">Encryption Algorithm</Label>
                <Select value={encryptionAlgorithm} onValueChange={setEncryptionAlgorithm}>
                  <SelectTrigger id="encryption-algorithm">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AES-256">AES-256</SelectItem>
                    <SelectItem value="AES-128">AES-128</SelectItem>
                    <SelectItem value="RSA">RSA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Security Notice</AlertTitle>
              <AlertDescription>
                Enabling encryption may affect performance but provides better security for your files.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="backup" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Backup Settings</CardTitle>
            <CardDescription>Configure automatic backups for your files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="backup" className="flex flex-col space-y-1">
                <span>Automatic Backups</span>
                <span className="text-xs text-muted-foreground">Enable scheduled backups of your files</span>
              </Label>
              <Switch id="backup" checked={backupEnabled} onCheckedChange={setBackupEnabled} />
            </div>

            {backupEnabled && (
              <div>
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="pt-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="retention" className="flex flex-col space-y-1">
                  <span>Auto-Delete Old Files</span>
                  <span className="text-xs text-muted-foreground">
                    Automatically delete files after a retention period
                  </span>
                </Label>
                <Switch id="retention" checked={retentionEnabled} onCheckedChange={setRetentionEnabled} />
              </div>

              {retentionEnabled && (
                <div className="mt-4">
                  <Label htmlFor="retention-period">Retention Period (days)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="retention-period"
                      type="number"
                      value={retentionPeriod}
                      onChange={(e) => setRetentionPeriod(Number.parseInt(e.target.value))}
                      min={1}
                      max={365}
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

