"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { configForm } from '@/types/config-type'
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner';

interface EnvVariablesListProps {
    filteredVariables: configForm[];
    setEnvVariables: React.Dispatch<React.SetStateAction<configForm[]>>;
}
const EnvVariablesList = ({ filteredVariables, setEnvVariables }: EnvVariablesListProps) => {
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
    const handleDeleteVariable = useCallback((id: string) => {
        setEnvVariables((prev) => prev.filter((variable) => variable._id !== id));
        toast.success("Environment variable removed");
    }, [setEnvVariables]);


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Value copied to clipboard");
    };
    const toggleShowSecret = (id: string) => {
        setShowSecrets((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    return (
        <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium">
                <div className="col-span-4">Key</div>
                <div className="col-span-6">Value</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
                {filteredVariables.map((variable) => (
                    <div
                        key={variable._id}
                        className="grid grid-cols-12 gap-4 p-4 items-center"
                    >
                        <div className="col-span-4 flex items-center space-x-2">
                            <span className="font-mono text-sm truncate">
                                {variable.key}
                            </span>
                            {variable.isSecret && (
                                <Badge
                                    variant="outline"
                                    className="text-xs bg-amber-100 text-amber-800 border-amber-200"
                                >
                                    Secret
                                </Badge>
                            )}
                        </div>
                        <div className="col-span-6 font-mono text-sm flex items-center space-x-2">
                            {variable.isSecret && !showSecrets[variable._id] ? (
                                <span className="text-muted-foreground">
                                    ••••••••••••••••
                                </span>
                            ) : (
                                <span className="truncate">{variable.value}</span>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(variable.value)}
                            >
                                <Copy className="h-3.5 w-3.5" />
                            </Button>
                            {variable.isSecret && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => toggleShowSecret(variable._id)}
                                >
                                    {showSecrets[variable._id] ? (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                        <Eye className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                            )}
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteVariable(variable._id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EnvVariablesList