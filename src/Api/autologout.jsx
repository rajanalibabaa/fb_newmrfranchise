// File: ./Api/autologout.jsx
import { logout } from "../Redux/Slices/AuthSlice/authSlice";
import { api } from "./api";
import { postApi } from "./DefaultApi";

export const autoLogOut = async (dispatch) => {
  const investorUUID = localStorage.getItem("investorUUID");
  const brandUUID = localStorage.getItem("brandUUID");
  const id = investorUUID || brandUUID;

  if (!id) return;

  try {
    const autoLogOutResponse = await postApi(`${api.logout.post.autoLogout}/${id}`);

    if (
      autoLogOutResponse?.data?.statuscode === 409 ||
      autoLogOutResponse?.data?.statuscode === 401
    ) {
      console.log("Auto logout response:", autoLogOutResponse.data);
      dispatch(logout());
      window.location.href = '/';
    }
  } catch (error) {
    console.error("Auto logout failed:", error);
  }
};
