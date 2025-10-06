
export const API_BASE_URL =  "https://mrfranchisebackend.mrfranchise.in/api/v1";

// API Endpoints
export const api = {
  allBrandsApi : {
    get : {
      defaultBrands : `${API_BASE_URL}/brandlisting/getAllBrandListing`,
      likeAndUnlikeBrands :`${API_BASE_URL}/like/favbrands/getAllLikedAndUnlikedBrand`
    }
  },

  viewApi: {
    post: `${API_BASE_URL}/view/postViewBrands`,
    get: {
      getAllViewBrandByID: `${API_BASE_URL}/view/getAllViewBrandByID`,
      getBrandViews: `${API_BASE_URL}/view/getAllViewBrands`,
    },
    delete: `${API_BASE_URL}/view/deleteViewBrandByID`
  },
  
  likeApi: {
    post: `${API_BASE_URL}/like/post-favbrands`,
    get: `${API_BASE_URL}/like/get-favbrands`,
    delete: `${API_BASE_URL}/like/delete-favbrand`,
    // getBrandLikedByAll: `${API_BASE_URL}/like/getBrandLikedByAll`,
  },
///v1/instantapply/getAllInstaApply/:id
  instantApplyApi: {
    post: `${API_BASE_URL}/instantapply/postInstaApply`,
    get: {
      getInstaApplyById: `${API_BASE_URL}/instantapply/getInstaApplyById`,
      getAllInstaApply: `${API_BASE_URL}/instantapply/getAllInstaApply`,
      getAllLeads: `${API_BASE_URL}/instantapply/getAllLeads`,
    }
  },
  user: {
    get: {
      investor: `${API_BASE_URL}/investor/getInvestorByUUID`,
      brand : `${API_BASE_URL}/brandlisting/getBrandListingByUUID`,
    }
  },

  shortListApi : {
      post : `${API_BASE_URL}/shortList/post`,
      get : `${API_BASE_URL}/shortList/getShortListedById`,
      getDataForBrandOwner : `${API_BASE_URL}/shortList/getShortListedDataForOwner`,
   
  }
};