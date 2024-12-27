import axios from "axios"

const apiURL = import.meta.env.VITE_API_URL
const baseUrl = `${apiURL}/entries`

let token = null;

const setToken = (newToken) => {
  //console.log(`Setting token Bearer ${newToken}`);
  if (newToken === null) {
    token = null;
  } else {
    token = `Bearer ${newToken}`;
  }
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject,config)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`,config)
  return response.data
}



export default { getAll, create, update, remove, setToken }