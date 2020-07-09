import axios from 'axios';

let baseUrl = "http://localhost:3333/";

export default axios.create({ baseURL: baseUrl });
