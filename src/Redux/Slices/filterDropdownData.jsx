import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://mrfranchisebackend.mrfranchise.in/api/v1/';

// --- Async thunk for fetching filter options ---
export const fetchFilterOptions = createAsyncThunk(
  'filterDropdown/fetchFilterOptions',
  async (params = {}, { rejectWithValue }) => {
    try {
      // ✅ Include areaRequired in destructuring
      const { sub, state, district, main, areaRequired } = params;

      const queryParams = new URLSearchParams();

      if (sub) queryParams.append('sub', sub);
      if (state) queryParams.append('state', state);
      if (district) queryParams.append('district', district);
      if (areaRequired) queryParams.append('areaRequired', areaRequired);
      if (main) queryParams.append('main', main);
      else queryParams.append('main', 'Food & Beverages'); // default fallback

      const response = await axios.post(
        `${API_BASE_URL}filter/getAllBrandFiltersdata?${queryParams.toString()}`
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Initial State ---
const initialState = {
  mainCategories: [],
  subCategories: [],
  childCategories: [],
  investmentRanges: [],
  franchiseModels: [],
  areaRequired: [], // ✅ already exists in your state
  states: [],
  districts: [],
  cities: [],

  // Loading states
  loading: false,
  loadingChildCategories: false,
  loadingDistricts: false,
  loadingCities: false,

  // Error states
  error: null,
  childCategoriesError: null,
  districtsError: null,
  citiesError: null,
};

// --- Slice ---
const filterDropdownSlice = createSlice({
  name: 'filterDropdown',
  initialState,
  reducers: {
    resetChildCategories: (state) => {
      state.childCategories = [];
    },
    resetDistricts: (state) => {
      state.districts = [];
    },
    resetCities: (state) => {
      state.cities = [];
    },
    clearErrors: (state) => {
      state.error = null;
      state.childCategoriesError = null;
      state.districtsError = null;
      state.citiesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Pending ---
      .addCase(fetchFilterOptions.pending, (state, action) => {
        const params = action.meta.arg || {};

        if (params.main) state.loading = true;
        if (params.sub) state.loadingChildCategories = true;
        if (params.state) state.loadingDistricts = true;
        if (params.areaRequired) state.loading = true;
        if (params.district) state.loadingCities = true;
        if (!action.meta.arg) state.loading = true;
      })

      // --- Fulfilled ---
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        const params = action.meta.arg || {};

        if (params.sub) {
          // Child categories
          state.childCategories = action.payload;
          state.loadingChildCategories = false;
        } else if (params.state) {
          // Districts
          state.districts = action.payload;
          state.loadingDistricts = false;
        } else if (params.district) {
          // Cities
          state.cities = action.payload;
          state.loadingCities = false;
        } else if (params.areaRequired) {
          // ✅ Area required filter results — keep separately
          state.areaRequired =
            action.payload.areaRequired || action.payload || [];
          state.loading = false;
        } else if (params.main) {
          // ✅ Main filter-specific updates
          state.subCategories = action.payload.subcat || [];
          state.investmentRanges = action.payload.investmentRange || [];
          state.franchiseModels = action.payload.franchiseModel || [];
          state.states = action.payload.states || [];
          state.areaRequired = action.payload.areaRequired || []; // ✅ Added this
          state.loading = false;
        } else {
          // Full list (default initial load)
          state.mainCategories = action.payload.maincat || [];
          state.subCategories = action.payload.subcat || [];
          state.investmentRanges = action.payload.investmentRange || [];
          state.franchiseModels = action.payload.franchiseModel || [];
          state.states = action.payload.states || [];
          state.areaRequired = action.payload.areaRequired || []; // ✅ Added this
          state.loading = false;

        }
      })

      // --- Rejected ---
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        const params = action.meta.arg || {};

        if (params.sub) {
          state.childCategoriesError = action.payload;
          state.loadingChildCategories = false;
        } else if (params.state) {
          state.districtsError = action.payload;
          state.loadingDistricts = false;
        } else if (params.district) {
          state.citiesError = action.payload;
          state.loadingCities = false;
        } else if (params.areaRequired) {
          state.error = action.payload;
          state.loading = false;
        } else if (params.main) {
          state.error = action.payload;
          state.loading = false;
        } else {
          state.error = action.payload;
          state.loading = false;
        }
      });
  },
});

export const {
  resetChildCategories,
  resetDistricts,
  resetCities,
  clearErrors,
} = filterDropdownSlice.actions;

export default filterDropdownSlice.reducer;
 