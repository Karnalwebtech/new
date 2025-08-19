"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAddConfigMutation, useGetConfigsQuery } from "@/state/config-api";
import { configForm } from "@/types/config-type";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import EnvVariablesList from "./env-variables-list";
import { TableSkeleton } from "@/components/skeletons/tabel-skeleton";

function EnvForm() {
  const [activeTab, setActiveTab] = useState("development");
  const [envVariables, setEnvVariables] = useState<configForm[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  const [addConfig, { error, isLoading, isSuccess }] = useAddConfigMutation();
  const { data, isLoading: islistLoading } = useGetConfigsQuery();
  const result = data?.result;
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Data Added succesfuly.",
  });

  const environments = ["development", "staging", "production", "testing"];

  const handleAddVariable = useCallback(() => {
    if (!newKey.trim() || !newValue.trim()) {
      toast.error("Both key and value are required");
      return;
    }

    const newVariable: configForm = {
      _id: Date.now().toString(),
      key: newKey.trim(),
      value: newValue.trim(),
      isSecret,
      environment: activeTab,
    };

    setEnvVariables((prev: configForm[]) => [
      ...prev,
      newVariable as configForm,
    ]);
    setNewKey("");
    setNewValue("");
    setIsSecret(false);

    toast.success(`Environment variable ${newKey} added to ${activeTab}`);
  }, [activeTab, isSecret, newKey, newValue]);

  const filteredVariables = useMemo(() => {
    const mergedArray = [...envVariables, ...(result ?? [])]; // Ensure result is an array
    return mergedArray.filter((variable) => variable.environment === activeTab);
  }, [envVariables, result, activeTab]); // ✅ Use correct dependencies

  const exportEnvFile = () => {
    const envContent = filteredVariables
      .map((variable) => `${variable.key}=${variable.value}`)
      .join("\n");

    const blob = new Blob([envContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `.env.${activeTab}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`.env.${activeTab} file downloaded`);
  };
  const submitData = useCallback(async () => {
    if (envVariables.length === 0) {
      return toast.error("Both input fields Should not be Emtpty")
    }
    await addConfig(envVariables);
  }, [addConfig, envVariables]);

  return (
    <Card className="w-full max-w-[98%] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Environment Variables</CardTitle>
        <CardDescription>
          Manage your environment variables for different deployment
          environments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            {environments.map((env) => (
              <TabsTrigger key={env} value={env} className="capitalize">
                {env}
              </TabsTrigger>
            ))}
          </TabsList>

          {environments.map((env) => (
            <TabsContent key={env} value={env} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1  md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-5">
                    <Label htmlFor={`key-${env}`}>Key</Label>
                    <Input
                      id={`key-${env}`}
                      placeholder="DATABASE_URL"
                      value={activeTab === env ? newKey : ""}
                      onChange={(e) =>
                        activeTab === env && setNewKey(e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-5">
                    <Label htmlFor={`value-${env}`}>Value</Label>
                    <Input
                      id={`value-${env}`}
                      placeholder="postgres://user:password@localhost:5432/db"
                      value={activeTab === env ? newValue : ""}
                      onChange={(e) =>
                        activeTab === env && setNewValue(e.target.value)
                      }
                      type={isSecret ? "password" : "text"}
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center space-x-2">
                    <Switch
                      id={`secret-${env}`}
                      checked={isSecret}
                      onCheckedChange={setIsSecret}
                    />
                    <Label htmlFor={`secret-${env}`} className="text-sm">
                      Secret
                    </Label>
                  </div>
                  <div className="md:col-span-1">
                    <Button onClick={handleAddVariable} className="w-full">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                {islistLoading ?
                  (
                    <div className="flex flex-col border-collapse w-full">
                      {
                        Array.from({ length: 10 }).map((_, i) => (

                          <TableSkeleton key={i} />
                        ))}
                    </div>

                  )
                  : filteredVariables.length > 0 ? (

                    <EnvVariablesList
                      setEnvVariables={setEnvVariables}
                      filteredVariables={filteredVariables}
                    />

                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No environment variables defined for {env}
                    </div>
                  )
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={exportEnvFile}>
          Export .env.{activeTab}
        </Button>
        <Button onClick={submitData}>
          {isLoading ? (
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save All Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
export default memo(EnvForm);
