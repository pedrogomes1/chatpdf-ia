"use client";
import { uploadToS3 } from "@/lib/s3";
import { Inbox } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

const FILESIZE_ALLOWED = 10 * 1024 * 1024; //10MB

export function FileUpload() {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    onDrop: async (acceptedFile) => {
      const file = acceptedFile[0];

      if (file.size > FILESIZE_ALLOWED) {
        alert("Please, upload a smaller file");
      }

      try {
        const data = await uploadToS3(file);
        console.log("data", data);
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl w-full">
      <div
        {...getRootProps({
          className:
            "flex-col border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center",
        })}
      >
        <input {...getInputProps()} />

        <Inbox className="w-10 h-10 text-purple-500" />
        <p className="mt-2 text-sm text-slate-400"> Drop PDF Here</p>
      </div>
    </div>
  );
}
