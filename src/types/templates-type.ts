export interface TemplateTypeForm {
    name: string;
    subject?: string;
    content: string;
    type: string;
    id?: string;
}
export interface TemplateResult {
    name: string;
    _id: string;
    subject?: string;
    content: string;
    type: string;
}
export interface getTemplatesResponse {
    success: boolean;
    result: TemplateResult[];
    dataCounter: number;
}
export interface getTemplateDetailsResponse {
    success: boolean;
    result: TemplateResult;
}