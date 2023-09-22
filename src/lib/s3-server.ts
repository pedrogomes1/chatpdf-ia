import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_KEY!,
  },
});

export async function downloadFromS3(fileKey: string) {
  return new Promise(async (resolve, reject) => {
    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });

    try {
      const { Body } = await client.send(command);

      const file_name = `/tmp/pdf-${Date.now().toString()}.pdf`;

      if (Body instanceof require("stream").Readable) {
        const file = fs.createWriteStream(file_name);
        file.on("open", function (fd) {
          // @ts-ignore
          Body?.pipe(file).on("finish", () => {
            return resolve(file_name);
          });
        });
      }

      return file_name;
    } catch (error) {
      console.error("ERROR DOWNLOAD FROM S3", error);
      return null;
    }
  });
}
