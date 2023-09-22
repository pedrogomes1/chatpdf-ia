import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_KEY!,
  },
});

export async function uploadToS3(file: File) {
  const FILE_KEY =
    "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: FILE_KEY,
    Body: file,
  });

  try {
    await client.send(command);
    return {
      file_key: FILE_KEY,
      file_name: file.name,
    };
  } catch (error) {
    console.error("error upload", error);
  }
}

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${fileKey}`;

  return url;
}
