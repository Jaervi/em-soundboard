import axios from "axios";
const apiURL = import.meta.env.VITE_API_URL;
const baseUrl = `${apiURL}/files`;

const uploadFile = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }
  const { data } = await axios.post(`${baseUrl}/generate-presigned-url`, {
    fileName: file.name,
    fileType: file.type,
  });

  //console.log(data)

  await axios.put(data.url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
  return data.fileKey;
};

const getFileURL = async (fileName) => {
  const response = await axios.get(`${baseUrl}/sounds/${fileName}`);
  //console.log(response)
  return response.data.url;
};

const removeFile = async (fileName) => {
  try {
    const response = await axios.delete(`${baseUrl}/sounds/${fileName}`);

    console.log(response.data.message);
  } catch (error) {
    console.error(
      "Error deleting file:",
      error.response?.data?.error || error.message
    );
  }
};

export default { uploadFile, getFileURL, removeFile };
