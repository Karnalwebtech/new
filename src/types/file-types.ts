import { User } from "./user-type";

export interface IFile extends File {
  path: string;
  relativePath: string;
  lastModified: number;
  name: string;
  size: number;
  type: string;
}
export interface FileData {
  no?: number,
  originalname: string,
  public_id: string,
  encoding: string,
  mimetype: string,
  title: string,
  category: string,
  caption?:string;
  size: number | string,
  width?: number,
  height?: number,
  signature?: string;
  _id: string,
  altText?: string;
  user: User;
  is_active?: boolean;
  createdAt: string,
  updatedAt: string,
  __v?: number,
}
export interface FileForm {
  title: string,
  caption: string,
  width?: number,
  height?: number,
  signature?: string;
  altText?: string;
  id?:string;
}
export interface UploadFileResponse {
  success: boolean,
  result: FileData,
}
export interface GetFileDetailsResponse {
  success: boolean,
  result: FileData,
}
export interface GetFileResponse {
  success: boolean,
  result: FileData[],
  dataCounter: number,
}
