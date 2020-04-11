import axios from "axios";

const BASE_URL = "http://localhost:3030/api";
const PERSONS_URL = `${BASE_URL}/persons`;

const getAll = () => {
  return axios.get(PERSONS_URL).then((res) => res.data);
};

const create = (payload) => {
  return axios.post(PERSONS_URL, payload).then((res) => res.data);
};

const update = (payload) => {
  return axios
    .put(`${PERSONS_URL}/${payload.id}`, payload)
    .then((res) => res.data);
};

const remove = (id) => {
  return axios.delete(`${PERSONS_URL}/${id}`);
};

export default { getAll, create, delete: remove, update };
