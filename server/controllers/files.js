const config = require("../utils/config");
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const router = require("express").Router();
const { execSync } = require('node:child_process');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

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

router.post("/download-content", async (req, res) => {
  try {
    const { link, start, end } = req.body;
    const downloadDir = path.resolve(__dirname, '..', 'cache');
    const input = `yt-dlp -P "${downloadDir}" --external-downloader "ffmpeg" --external-downloader-args "-ss ${start} -to ${end}" -i -f "ba[ext=m4a]" "${link}"`
    const workingDir = path.resolve(__dirname, '..', 'downloader');
    // Uses yt-dlp in workingDirectory to download audio
    execSync(input, { cwd: workingDir }, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    })
    // Audio filepath in cache (includes file name and extension)
    const filePath = path.resolve(__dirname, '..', 'cache', fs.readdirSync(downloadDir)[0]);

    try {
      const fileName = path.basename(filePath)
      //console.log("Filename in cache ", fileName);
      const fileType = "audio/m4a"
  
      const ext = fileName.split(".").pop(); // File extension
      const uniqueName = `${crypto.randomUUID()}.${ext}`;
      
      const command = new PutObjectCommand({
        Bucket: config.S3_BUCKET_NAME,
        Key: uniqueName,
        ContentType: fileType,
      });
  
      const url = await getSignedUrl(s3, command, { expiresIn: 60 });
      
      const file = fs.readFileSync(filePath);

      await axios.put(url, file, {
        headers: {
          "Content-Type": fileType,
        },
      });

      // Removes file from cache
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log(filePath, ' was deleted');
      }); 

      res.json({ url, fileKey: uniqueName });

    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Error generating URL" });
    }

  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Error downloading file" });
  }
})

module.exports = router;
