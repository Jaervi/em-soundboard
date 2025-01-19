import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;
const baseUrl = `${apiURL}/users`;

const getConfig = (user) => ({
  headers: { Authorization: `Bearer ${user.token}` },
});

const promoteUser = async (username, user) => {
  const config = getConfig(user);
  const response = await axios.post(`${baseUrl}/${username}/makeadmin`,{},config); //Empty data so config is relayed onto real config params
  return response.data;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (content) => {
  const response = await axios.post(baseUrl, content);
  return response.data;
};

const remove = async (username, user) => {
  const config = getConfig(user);
  const response = await axios.delete(`${baseUrl}/${username}`, config);
  return response.data;
};
export default { promoteUser, getAll, remove, create };
