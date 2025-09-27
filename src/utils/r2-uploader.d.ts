export interface UploadResult {
  _id: string;
  key: string;
  url: string;
}

export interface FileObject {
  name?: string;
  type?: string;
  size?: number;
}

export declare const uploadToR2: (file: File | Buffer | FileObject, fileName?: string | null) => Promise<UploadResult>;
export declare const deleteFromR2: (fileKey: string) => Promise<any>;
export declare const multiFileUploader: (files: (File | Buffer | FileObject)[]) => Promise<UploadResult[]>;
export declare const singleFileUploader: (file: File | Buffer | FileObject) => Promise<UploadResult>;
export declare const singleFileDelete: (fileKey: string) => Promise<any>;
export declare const multiFilesDelete: (fileKeys: Array<{ _id: string } | string>) => Promise<any[]>;
