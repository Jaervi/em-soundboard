import axios from "axios"

const apiURL = import.meta.env.VITE_API_URL
const baseUrl = `${apiURL}/login`

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
