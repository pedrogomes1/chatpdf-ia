"use client";
import React, { useState } from "react";
import axios from "axios";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FILESIZE_ALLOWED = 10 * 1024 * 1024; //10MB

export function FileUpload() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    onDrop: async (acceptedFile) => {
      const file = acceptedFile[0];

      if (file.size > FILESIZE_ALLOWED) {
        return toast.error("Please, upload a smaller file");
      }

      try {
        setIsUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          return toast.error('Something went wrong"');
        }

        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat successful created");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");
          },
        });
      } catch (error) {
        toast.error("Error to upload pdf");
      } finally {
        setIsUploading(false);
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
        {isLoading || isUploading ? (
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        ) : (
          <>
            <Inbox className="w-10 h-10 text-purple-500" />
            <p className="mt-2 text-sm text-slate-400"> Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
}
