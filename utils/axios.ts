import axios from "axios";
import router from "next/router";

export const baseURL = "http://localhost:5001";

export const axiosWithoutToken = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
});

export const axiosWithToken = () => {
  const apiKey = process.env.NEXT_PUBLIC_BLNK_API_KEY;

  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Blnk-Key": apiKey,
    }
  });
};

export const handleAxiosError = (err: any, thunkAPI: any) => {
  const { message, status } = err.toJSON();

  if (status === 401) {
    router.push("/auth/sign-in");
    router.reload();
  }

  if (message === "Network Error") {
    throw thunkAPI.rejectWithValue({
      status: 500,
      message: "You are offline",
    });
  } else {
    throw thunkAPI.rejectWithValue({
      status: err.response?.status || 0,
      message: err.response?.data?.message || "An error occurred",
    });
  }
};
