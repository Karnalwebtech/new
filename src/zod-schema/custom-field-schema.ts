import { customFields } from "@/types/custom-field-types";
import { z } from "zod";

export const generateDynamicSchema = (customFields: customFields[]) => {
    if (!Array.isArray(customFields)) {
      throw new Error("Invalid custom fields data. Expected an array.");
    }
  
    const schema = customFields.reduce((acc, field) => {
      let fieldType: z.ZodTypeAny = z.string();
  
      switch (field.type) {
        case "number":
          fieldType = z.coerce.number().min(1, `${field.label} must be a valid number`);
          break;
  
        case "email":
          fieldType = z.string().email(`${field.label} must be a valid email`);
          break;
  
        case "textarea":
          fieldType = z.string().min(5, `${field.label} must be at least 5 characters`);
          break;
  
          case "dropdown":
            if (Array.isArray(field.options) && field.options.length > 0) {
              fieldType = z.enum(field.options as [string, ...string[]]);
            } else {
              fieldType = z.string().min(1, `${field.label} selection is required`);
            }
          break;
  
        // case "boolean":
        //   fieldType = z.boolean();
        //   break;
  
        // case "date":
        //   fieldType = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, `${field.label} must be a valid date (YYYY-MM-DD)`);
        //   break;
  
        default:
          fieldType = z.string();
      }
  
      // Apply required validation properly
      if (field.required) {
        if (fieldType instanceof z.ZodString) {
          fieldType = fieldType.nonempty(`${field.label} is required`);
        } else if (fieldType instanceof z.ZodNumber) {
          fieldType = fieldType.min(1, `${field.label} is required and must be a valid number`);
        } else if (fieldType instanceof z.ZodBoolean) {
          fieldType = fieldType.default(false);
        }
      } else {
        fieldType = fieldType.optional();
      }
  
      return {
        ...acc,
        [field.label.replace(/\s+/g, "_").toLowerCase()]: fieldType,
      };
    }, {} as Record<string, z.ZodTypeAny>);
  
    return z.object(schema);
  };