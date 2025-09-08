import { createSlice } from '@reduxjs/toolkit';

// let id 
// console.log("iddddddddddd: ",id)
const tokenFromStorage = localStorage.getItem("accessToken");
const investorFromStorage = localStorage.getItem("investorUUID");
const brandFromStorage = localStorage.getItem("brandUUID");
// const tokenFromStorage = localStorage.getItem(`accessToken ${id}`);
// const investorFromStorage = localStorage.getItem(`investorUUID ${id}`);
// const brandFromStorage = localStorage.getItem(`brandUUID ${id}`);

// console.log(" == 0 == :",brandFromStorage,investorFromStorage,tokenFromStorage )





const initialState = {
  investorUUID: investorFromStorage || null, 
  brandUUID: brandFromStorage || null,
  AccessToken: tokenFromStorage || null,  
  isLogin: !!tokenFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUUIDandTOKEN: (state, action) => {
      const { investorUUID, brandUUID, token, userData } = action.payload;
      state.investorUUID = investorUUID;
      state.brandUUID = brandUUID;
      state.AccessToken = token;
      state.isLogin = true;
      // state.userData = userData;
      // console.log(userData)

      //  id = investorUUID || brandUUID

      if (token) {
        localStorage.setItem("accessToken", token);
        if (investorUUID) localStorage.setItem("investorUUID", investorUUID);
        if (brandUUID) localStorage.setItem("brandUUID", brandUUID);
      //    localStorage.setItem(`accessToken ${id}`, token);
      //   if (investorUUID) localStorage.setItem(`investorUUID ${id}`, investorUUID);
      //   if (brandUUID) localStorage.setItem(`brandUUID ${id}`, brandUUID);
      }
    },
    logout: (state) => {
      state.investorUUID = null;
      state.brandUUID = null;
      state.AccessToken = null;
      state.isLogin = false;
      // state.userData = null


      localStorage.removeItem("accessToken");
      localStorage.removeItem("investorUUID");
      localStorage.removeItem("brandUUID");
      localStorage.removeItem("logoutTimestamp");
      // localStorage.removeItem(`accessToken ${id}`);
      // localStorage.removeItem(`investorUUID ${id}`);
      // localStorage.removeItem(`brandUUID ${id}`);
      // localStorage.removeItem(`logoutTimestamp ${id}`);
    },
  },
});

export const { setUUIDandTOKEN, logout } = authSlice.actions;
export default authSlice.reducer;