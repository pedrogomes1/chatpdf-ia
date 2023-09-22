import AWS from "aws-sdk";
import fs from "fs";

export async function downloadFromS3(fileKey: string) {
  try {
    AWS.config.update({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_KEY!,
      },
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: fileKey,
    };

    const obj = await s3.getObject(params).promise();

    const file_name = `/tmp/pdf-${Date.now()}.pdf`;
    fs.writeFileSync(file_name, obj.Body as Buffer);

    return file_name;
  } catch (error) {
    console.error(error);
    return null;
  }
}
