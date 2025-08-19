export interface ParsedEmail {
  subject: string;
  html: string;
  text: string;
  date?: Date;
}


export interface EmailHeader {
    subject: string[]
    from: string[]
    to: string[]
    date: string[]
  }
  interface Attributes {
    date:string
  }
export  interface Email {
    id: number
    header: EmailHeader
    attributes:Attributes
    body: string
    hasAttachment:boolean;
    flags: string[]
  }
  
export  interface GetEmailResponse {
    success:boolean;
    result: Email[]
  }
  export  interface GetEmailDetailsResponse {
    success:boolean;
    result: Email
  }
  export  interface DeleteEmailResponse {
    success:boolean;
    message:string
  }