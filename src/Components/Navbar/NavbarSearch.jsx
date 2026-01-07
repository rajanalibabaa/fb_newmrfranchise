import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";

import CloseIcon from "@mui/icons-material/Close";
import { fetchFilterOptions } from "../../Redux/Slices/filterDropdownData";
import {  resetFilters } from "../../Redux/Slices/FilterBrandSlice";
import Search from "./Search";

// const highlightMatch = (text, searchTerm) => {
//   if (!searchTerm || !text) return text;

//   const regex = new RegExp(`(${searchTerm})`, "gi");
//   const parts = text.split(regex);

//   return parts.map((part, index) =>
//     part.toLowerCase() === searchTerm.toLowerCase() ? (
//       <span
//         key={index}
//         style={{ fontWeight: "bold", backgroundColor: "yellow" }}
//       >
//         {part}
//       </span>
//     ) : (
//       part
//     )
//   );
// };

const NavbarSearch = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get filter options from Redux store
  const {
    mainCategories = [],
    subCategories = [],
    childCategories = [],
    investmentRanges = [],
    states = [],
    districts = [],
    cities = [],
    loading: dropdownLoading,
  } = useSelector((state) => state.filterDropdown);

  // console.log("===mainCategories=== ",subCategories)

  // Selected filters state
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState("");

  // Search terms for filter dropdowns
  const [searchTerms, setSearchTerms] = useState({
    mainCategory: "",
    subCategory: "",
    childCategory: "",
    state: "",
    district: "",
    city: "",
    investment: "",
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch initial filter options when component mounts
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  // Fetch sub-categories when main category is selected
  useEffect(() => {
    if (selectedMainCategory) {
      dispatch(fetchFilterOptions({ main: selectedMainCategory }));
      setSelectedSubCategory("");
      setSelectedChildCategory("");
    }
  }, [selectedMainCategory, dispatch]);

  // Fetch child-categories when sub-category is selected
  useEffect(() => {
    if (selectedSubCategory) {
      dispatch(fetchFilterOptions({ sub: selectedSubCategory }));
      setSelectedChildCategory("");
    }
  }, [selectedSubCategory, dispatch]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState) {
      dispatch(fetchFilterOptions({ state: selectedState }));
      setSelectedDistrict("");
      setSelectedCity("");
    }
  }, [selectedState, dispatch]);

  // Fetch cities when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchFilterOptions({ district: selectedDistrict }));
      setSelectedCity("");
    }
  }, [selectedDistrict, dispatch]);

  // Filter main categories based on search term
  const filteredMainCategories = useMemo(() => {
    const term = searchTerms.mainCategory.toLowerCase();
    return mainCategories
      .filter((cat) => cat.toLowerCase().includes(term))
      .slice(0, 100);
  }, [mainCategories, searchTerms.mainCategory]);

  // Filter sub categories based on selected main category and search term
  const filteredSubCategories = useMemo(() => {
    if (!selectedMainCategory) return [];
    const term = searchTerms.subCategory.toLowerCase();
    return subCategories
      .filter((sub) => sub.toLowerCase().includes(term))
      .slice(0, 100);
  }, [selectedMainCategory, subCategories, searchTerms.subCategory]);

  // Filter child categories based on selected sub category and search term
  const filteredChildCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    const term = searchTerms.childCategory.toLowerCase();
    return childCategories
      .filter((child) => child.toLowerCase().includes(term))
      .slice(0, 100);
  }, [selectedSubCategory, childCategories, searchTerms.childCategory]);

  // Filter states based on search term
  const filteredStates = useMemo(() => {
    const term = searchTerms.state.toLowerCase();
    return states
      .filter((state) => state.toLowerCase().includes(term))
      .slice(0, 100);
  }, [states, searchTerms.state]);

  // Filter districts based on selected state and search term
  const filteredDistricts = useMemo(() => {
    if (!selectedState) return [];
    const term = searchTerms.district.toLowerCase();
    return districts
      .filter((district) => district.toLowerCase().includes(term))
      .slice(0, 100);
  }, [selectedState, districts, searchTerms.district]);

  // Filter cities based on selected district and search term
  const filteredCities = useMemo(() => {
    if (!selectedDistrict) return [];
    const term = searchTerms.city.toLowerCase();
    return cities
      .filter((city) => city.toLowerCase().includes(term))
      .slice(0, 100);
  }, [selectedDistrict, cities, searchTerms.city]);

  // Filter investment ranges based on search term
  const filteredInvestmentRanges = useMemo(() => {
    const term = searchTerms.investment.toLowerCase();
    return investmentRanges
      .filter((range) => range.toLowerCase().includes(term))
      .slice(0, 50);
  }, [investmentRanges, searchTerms.investment]);

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const term = searchTerm.toLowerCase();
    const suggestions = [];

    // Add category suggestions
    mainCategories.forEach((category) => {
      if (category.toLowerCase().includes(term)) {
        suggestions.push({
          type: "Category",
          value: category,
          icon: "🏭",
          searchTerm: term,
          filterType: "maincat",
          filterValue: category,
        });
      }
    });

    subCategories.forEach((sub) => {
      if (sub.toLowerCase().includes(term)) {
        suggestions.push({
          type: "Sub-Category",
          value: sub,
          icon: "🏷️",
          searchTerm: term,
          filterType: "subcat",
          filterValue: sub,
        });
      }
    });

    childCategories.forEach((child) => {
      if (child.toLowerCase().includes(term)) {
        suggestions.push({
          type: "Menu-Tags",
          value: child,
          icon: "🏷️",
          searchTerm: term,
          filterType: "childcat",
          filterValue: child,
        });
      }
    });

    // Add location suggestions
    states.forEach((state) => {
      if (state.toLowerCase().includes(term)) {
        suggestions.push({
          type: "Location",
          value: state,
          icon: "📍",
          searchTerm: term,
          filterType: "state",
          filterValue: state,
        });
      }
    });

    districts.forEach((district) => {
      if (district.toLowerCase().includes(term)) {
        suggestions.push({
          type: "Location",
          value: district,
          icon: "📍",
          searchTerm: term,
          filterType: "district",
          filterValue: district,
        });
      }
    });

    cities.forEach((city) => {
      if (city.toLowerCase().includes(term)) {
        suggestions.push({
          type: "Location",
          value: city,
          icon: "📍",
          searchTerm: term,
          filterType: "city",
          filterValue: city,
        });
      }
    });

    // Add investment range suggestions
    investmentRanges.forEach((range) => {
      if (range.toLowerCase().includes(term)) {
        suggestions.push({
          type: "Investment",
          value: range,
          icon: "💰",
          searchTerm: term,
          filterType: "investmentRange",
          filterValue: range,
        });
      }
    });

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }, [
    searchTerm,
    mainCategories,
    subCategories,
    childCategories,
    states,
    districts,
    cities,
    investmentRanges,
  ]);

  // Handle keyboard navigation for suggestions
  useEffect(() => {
    if (!openSuggestions || searchSuggestions.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (searchSuggestions[activeSuggestion]) {
          handleSuggestionSelect(searchSuggestions[activeSuggestion]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSuggestions, searchSuggestions, activeSuggestion]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleSearchChange = (key, value) => {
    setSearchTerms((prev) => ({ ...prev, [key]: value }));
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.value);
    setOpenSuggestions(false);

    // Set the appropriate filter based on suggestion type
    switch (suggestion.filterType) {
      case "maincat":
        setSelectedMainCategory(suggestion.filterValue);
        setTab(0);
        break;
      case "subcat":
        setSelectedSubCategory(suggestion.filterValue);
        setTab(0);
        break;
      case "childcat":
        setSelectedChildCategory(suggestion.filterValue);
        setTab(0);
        break;
      case "state":
        setSelectedState(suggestion.filterValue);
        setTab(1);
        break;
      case "district":
        setSelectedDistrict(suggestion.filterValue);
        setTab(1);
        break;
      case "city":
        setSelectedCity(suggestion.filterValue);
        setTab(1);
        break;
      case "investmentRange":
        setSelectedInvestmentRange(suggestion.filterValue);
        setTab(2);
        break;
      default:
        break;
    }
  };

  const handleExplore = async () => {
    setLoading(true);

    // Reset filters in Redux (for current tab if needed)
    dispatch(resetFilters());

    // Collect filters into query params
    const queryParams = new URLSearchParams();

    if (searchTerm) queryParams.append("searchTerm", searchTerm);
    if (selectedMainCategory)
      queryParams.append("maincat", selectedMainCategory);
    if (selectedSubCategory) queryParams.append("subcat", selectedSubCategory);
    if (selectedChildCategory)
      queryParams.append("childcat", selectedChildCategory);
    if (selectedState) queryParams.append("state", selectedState);
    if (selectedDistrict) queryParams.append("district", selectedDistrict);
    if (selectedCity) queryParams.append("city", selectedCity);
    if (selectedInvestmentRange)
      queryParams.append("investmentRange", selectedInvestmentRange);

    // ✅ open new tab with filters in URL
    window.open(
      `/brandViewPage?${queryParams.toString()}`,
      "_blank",
      "noopener,noreferrer"
    );

    handleClose();
    setLoading(false);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedMainCategory("");
    setSelectedSubCategory("");
    setSelectedChildCategory("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedInvestmentRange("");
    setSearchTerms({
      mainCategory: "",
      subCategory: "",
      childCategory: "",
      state: "",
      district: "",
      city: "",
      investment: "",
    });
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedMainCategory) count++;
    if (selectedSubCategory) count++;
    if (selectedChildCategory) count++;
    if (selectedState) count++;
    if (selectedDistrict) count++;
    if (selectedCity) count++;
    if (selectedInvestmentRange) count++;
    return count;
  }, [
    searchTerm,
    selectedMainCategory,
    selectedSubCategory,
    selectedChildCategory,
    selectedState,
    selectedDistrict,
    selectedCity,
    selectedInvestmentRange,
  ]);

  const CustomListbox = React.forwardRef(function CustomListbox(props, ref) {
    const { children, ...other } = props;

    return (
      <ul
        ref={ref}
        {...other}
        style={{
          listStyle: "none",
          margin: 0,
          padding: 8,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 1,
          backgroundColor: "#e0e0e0",
          maxHeight: 200,
          overflow: "auto",
        }}
      >
        {children}
      </ul>
    );
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent
        sx={{ p: 3, background: "#d5e7ddac", position: "relative" }}
      >
        {/* Close Button */}
        <Box>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: { xs: -5, md: 8 },
              right: { xs: -5, md: 8 },
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.main",
                color: "#fff",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search Input */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Search handleClose={handleClose} />
        </Box>

        {/* Active Filters */}
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={1}
          mb={2}
        >
          {selectedMainCategory && (
            <Chip
              label={`Industry: ${selectedMainCategory}`}
              onDelete={() => {
                setSelectedMainCategory("");
                setSelectedSubCategory("");
                setSelectedChildCategory("");
              }}
            />
          )}
          {selectedSubCategory && (
            <Chip
              label={`Category: ${selectedSubCategory}`}
              onDelete={() => {
                setSelectedSubCategory("");
                setSelectedChildCategory("");
              }}
            />
          )}
          {selectedChildCategory && (
            <Chip
              label={`Sub-Category: ${selectedChildCategory}`}
              onDelete={() => setSelectedChildCategory("")}
            />
          )}
          {selectedState && (
            <Chip
              label={`State: ${selectedState}`}
              onDelete={() => {
                setSelectedState("");
                setSelectedDistrict("");
                setSelectedCity("");
              }}
            />
          )}
          {selectedDistrict && (
            <Chip
              label={`District: ${selectedDistrict}`}
              onDelete={() => {
                setSelectedDistrict("");
                setSelectedCity("");
              }}
            />
          )}
          {selectedCity && (
            <Chip
              label={`City: ${selectedCity}`}
              onDelete={() => setSelectedCity("")}
            />
          )}
          {selectedInvestmentRange && (
            <Chip
              label={`Investment: ${selectedInvestmentRange}`}
              onDelete={() => setSelectedInvestmentRange("")}
            />
          )}
        </Box>

        <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
          Or Explore By
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          textColor="error"
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              minWidth: "auto",
              px: { xs: 1, md: 5 },
              fontSize: { xs: "0.75rem", md: "1rem" },
            },
          }}
        >
          <Tab label="Categories" />
          <Tab label="Location" />
          <Tab label="Investment" />
        </Tabs>

        {/* TAB 1 — CATEGORIES */}
        {tab === 0 && (
          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
            mb={3}
          >
            <FormControl sx={{ minWidth: { xs: 270, md: 600 } }}>
              <Autocomplete
                options={filteredMainCategories}
                value={selectedMainCategory}
                onChange={(_, v) => {
                  setSelectedMainCategory(v);
                  setSelectedSubCategory("");
                  setSelectedChildCategory("");
                }}
                inputValue={searchTerms.mainCategory}
                onInputChange={(_, v) => handleSearchChange("mainCategory", v)}
                ListboxComponent={CustomListbox}
                renderInput={(params) => (
                  <TextField {...params} label="Industry" />
                )}
              />
            </FormControl>

            <FormControl sx={{ minWidth: { xs: 270, md: 600 } }}>
              <Autocomplete
                options={filteredSubCategories}
                value={selectedSubCategory}
                onChange={(_, v) => {
                  setSelectedSubCategory(v);
                  setSelectedChildCategory("");
                }}
                inputValue={searchTerms.subCategory}
                onInputChange={(_, v) => handleSearchChange("subCategory", v)}
                ListboxComponent={CustomListbox}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    disabled={!selectedMainCategory}
                  />
                )}
              />
            </FormControl>
          </Box>
        )}

        {/* TAB 2 — LOCATION */}
        {tab === 1 && (
          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
            mb={3}
          >
            <FormControl sx={{ minWidth: { xs: 270, md: 600 } }}>
              <Autocomplete
                options={filteredStates}
                value={selectedState}
                onChange={(_, v) => {
                  setSelectedState(v);
                  setSelectedDistrict("");
                  setSelectedCity("");
                }}
                inputValue={searchTerms.state}
                onInputChange={(_, v) => handleSearchChange("state", v)}
                renderInput={(params) => (
                  <TextField {...params} label="State" />
                )}
              />
            </FormControl>

            <FormControl sx={{ minWidth: { xs: 270, md: 600 } }}>
              <Autocomplete
                options={filteredDistricts}
                value={selectedDistrict}
                onChange={(_, v) => {
                  setSelectedDistrict(v);
                  setSelectedCity("");
                }}
                inputValue={searchTerms.district}
                onInputChange={(_, v) => handleSearchChange("district", v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="District"
                    disabled={!selectedState}
                  />
                )}
              />
            </FormControl>
          </Box>
        )}

        {/* TAB 3 — INVESTMENT */}
        {tab === 2 && (
          <Box display="flex" justifyContent="center" mb={3}>
            <FormControl sx={{ minWidth: { xs: 270, md: 600 } }}>
              <Autocomplete
                options={filteredInvestmentRanges}
                value={selectedInvestmentRange}
                onChange={(_, v) => setSelectedInvestmentRange(v)}
                inputValue={searchTerms.investment}
                onInputChange={(_, v) => handleSearchChange("investment", v)}
                renderInput={(params) => (
                  <TextField {...params} label="Investment Range" />
                )}
              />
            </FormControl>
          </Box>
        )}

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            onClick={handleExplore}
            disabled={loading}
            sx={{
              backgroundColor: "#7ad03a",
              "&:hover": { backgroundColor: "rgb(104,159,56)" },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Explore"}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleClearAll}
            disabled={loading}
          >
            Clear All
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NavbarSearch;
