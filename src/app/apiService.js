import axios from "axios";

const apiService = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
});

/**
 * console.log all requests and responses
 */
apiService.interceptors.request.use(
  (request) => {
    console.log("Starting Request", request);
    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  function (error) {
    console.log("RESPONSE ERROR", error);
    const message = error.response?.data?.errors?.message || "Unknown Error";
    return Promise.reject({ message });
  }
);

export default apiService;
