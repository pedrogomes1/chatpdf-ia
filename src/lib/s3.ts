import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_KEY!,
      },
    });

    const FILE_KEY =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: FILE_KEY,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (event) => {
        console.log(event);
      })
      .promise();

    await upload.then((data) => {
      console.log("aheo");
    });

    return Promise.resolve({
      file_key: FILE_KEY,
      file_name: file.name,
    });
  } catch (error) {
    console.error("error upload", error);
  }
}

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${fileKey}`;

  return url;
}
