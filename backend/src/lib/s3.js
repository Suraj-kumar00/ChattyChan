import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file to S3
 * @param {string} base64Image - Base64 encoded image string
 * @param {string} fileName - Name of the file to be uploaded
 * @returns {Promise<string>} - Returns the URL of the uploaded file
 */
export const uploadToS3 = async (base64Image, fileName) => {
  try {
    // Validate environment variables
    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured");
    }

    // Extract image type and validate base64 string
    const matches = base64Image.match(/^data:image\/([a-zA-Z+]+);base64,/);
    if (!matches) {
      throw new Error("Invalid image format");
    }

    const imageType = matches[1];
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique key for the file
    const key = `uploads/${Date.now()}-${fileName}.${imageType}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: `image/${imageType}`,
      // Remove ACL setting since it's not supported
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct the URL
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    
    // Provide more specific error messages
    if (error.Code === "AccessDenied") {
      throw new Error("Access denied to S3 bucket. Check your AWS credentials and bucket permissions.");
    } else if (error.Code === "NoSuchBucket") {
      throw new Error("S3 bucket not found. Check your AWS_S3_BUCKET_NAME configuration.");
    } else if (error.message === "Invalid image format") {
      throw new Error("Invalid image format. Please upload a valid image file.");
    } else {
      throw new Error("Failed to upload image to S3. Please try again later.");
    }
  }
};

export default s3Client; 