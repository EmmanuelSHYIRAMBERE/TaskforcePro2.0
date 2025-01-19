import axios from "axios";
import useSWR from "swr";
import { SERVER_BASE_URL } from "@/constansts/constants";

// Function to fetch data using

const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};

const useFetch = (path: string) => {
  const url = `${SERVER_BASE_URL}${path}`;
  const { data, error, isLoading } = useSWR(url, fetchData);

  return { data, error, isLoading };
};

export default useFetch;
