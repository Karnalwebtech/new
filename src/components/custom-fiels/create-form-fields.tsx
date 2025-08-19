"use client";

import { memo, useState } from "react";
import { Loader2, PlusCircle, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "../ui/scroll-area";
import FormPreview from "./form-preview";
import { FieldType, customFields } from "@/types/custom-field-types";
import { toast } from "sonner";
interface CreateFormFieldsProps {
  handleSubmit: () => void;
  fields: customFields[];
  setFields: (fields: customFields[]) => void;
  isLoading: boolean;
}
const CreateFormFields = ({
  handleSubmit,
  fields,
  setFields,
  isLoading,
}: CreateFormFieldsProps) => {
  const [currentOption, setCurrentOption] = useState("");

  const addField = () => {
    const newField: customFields = {
      id: Date().toString(),
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      options: [],
    };

    setFields([...fields, newField]);
  };

  const updateField = (
    id: string | undefined,
    updates: Partial<customFields>
  ) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (id: string | undefined) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const addOption = (fieldId: string | undefined) => {
    if (!currentOption.trim()) return;
    console.log(fields);
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          const isDuplicate = field.options?.includes(currentOption.trim());
          if (isDuplicate) {
            toast.error("Dublicate entry");
            return field;
          } // Skip adding if duplicate

          return {
            ...field,
            options: [...(field.options || []), currentOption.trim()],
          };
        }
        return field;
      })
    );

    setCurrentOption("");
  };

  const removeOption = (fieldId: string | undefined, option: string) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          return {
            ...field,
            options: (field.options || []).filter((opt) => opt !== option),
          };
        }
        return field;
      })
    );
  };

  return (
    <div className="w-full max-h-[600px] max-w-[1380px] m-auto overflow-hidden">
      <ScrollArea className="h-96 rounded-md border">
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <h1 className="text-3xl font-bold mb-6">Add custom fields</h1>
            <p className="text-red-900">
              * Be careful, after creating, you cannot change it.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Form Fields</h2>

            {fields.length === 0 ? (
              <div className="text-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  No fields added yet. Click the button below to add your first
                  field.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-4">
                <div className="space-y-4 col-span-12 lg:col-span-8">
                  {fields.map((field) => (
                    <Card key={field.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            Field Configuration
                          </CardTitle>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`field-type-${field.id}`}>
                              Field Type
                            </Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) =>
                                updateField(field.id, {
                                  type: value as FieldType,
                                })
                              }
                            >
                              <SelectTrigger id={`field-type-${field.id}`}>
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text Input</SelectItem>
                                <SelectItem value="number">
                                  Text Number
                                </SelectItem>
                                <SelectItem value="email">
                                  Text Email
                                </SelectItem>
                                <SelectItem value="textarea">
                                  Text Area
                                </SelectItem>
                                <SelectItem value="dropdown">
                                  Dropdown
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`field-label-${field.id}`}>
                              Field Label
                            </Label>
                            <Input
                              id={`field-label-${field.id}`}
                              value={field.label}
                              onChange={(e) =>
                                updateField(field.id, { label: e.target.value })
                              }
                              placeholder="Enter field label"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`field-placeholder-${field.id}`}>
                            Placeholder Text
                          </Label>
                          <Input
                            id={`field-placeholder-${field.id}`}
                            value={field.placeholder}
                            onChange={(e) =>
                              updateField(field.id, {
                                placeholder: e.target.value,
                              })
                            }
                            placeholder="Enter placeholder text"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`field-required-${field.id}`}
                            checked={field.required}
                            onCheckedChange={(checked) =>
                              updateField(field.id, { required: checked })
                            }
                          />
                          <Label htmlFor={`field-required-${field.id}`}>
                            Required Field
                          </Label>
                        </div>

                        {field.type === "dropdown" && (
                          <div className="space-y-4">
                            <Label>Dropdown Options</Label>

                            <div className="flex space-x-2">
                              <Input
                                value={currentOption}
                                onChange={(e) =>
                                  setCurrentOption(e.target.value)
                                }
                                placeholder="Enter option text"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => addOption(field.id)}
                              >
                                Add
                              </Button>
                            </div>

                            {field.options && field.options.length > 0 ? (
                              <div className="space-y-2">
                                {field.options.map((option, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-muted p-2 rounded"
                                  >
                                    <span>{option}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        removeOption(field.id, option)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No options added yet
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="hidden lg:block col-span-4">
                  <CardHeader>
                    <CardTitle>Form Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fields.length > 0
                      ? fields.map((field, i) => (
                          <FormPreview key={i} index={i} field={field} />
                        ))
                      : null}
                  </CardContent>
                </Card>
              </div>
            )}

            <Button className="mt-4" variant="outline" onClick={addField}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Form
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default memo(CreateFormFields);
