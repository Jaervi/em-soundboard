const config = require("../utils/config");
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const router = require("express").Router();

const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

router.post("/generate-presigned-url", async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    const ext = fileName.split(".").pop(); // File extension
    const uniqueName = `${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: uniqueName,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.json({ url, fileKey: uniqueName });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Error generating URL" });
  }
});

router.get("/sounds/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;

    const command = new GetObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: fileName,
    });

    const url = await getSignedUrl(s3, command);
    res.json({ url });
  } catch (error) {
    console.error("Error generating download URL:", error);
    res.status(500).json({ error: "Error generating URL" });
  }
});

router.delete("/sounds/:fileName", async (req, res) => {
  const { fileName } = req.params;

  const params = {
    Bucket: config.S3_BUCKET_NAME,
    Key: fileName,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    // Respond with a success message
    res.json({ message: "File successfully deleted from S3" });
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    res.status(500).json({ error: "Error deleting file from S3" });
  }
});

module.exports = router;
