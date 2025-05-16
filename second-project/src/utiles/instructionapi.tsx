import AxiosInstance from "./axiosInstance";

const Instructionapi = async () => {
  const token = localStorage.getItem("access_token");
  const res = await AxiosInstance.get("/question/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export default Instructionapi;
