import React, { useState, useMemo, useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  fetchFilterOptions,
  resetChildCategories,
  resetDistricts,
  resetCities,
} from "../../Redux/Slices/filterDropdownData";

const FilterPanel = React.memo(
  ({
    filters,
    onFilterChange,
    onClearFilters,
    activeFilterCount,
    resultStats = { showing: 0, total: 0 },
  }) => {
    const dispatch = useDispatch();
    const {
      mainCategories,
      subCategories,
      childCategories,
      franchiseModels,
      investmentRanges,
      areaRequired,
      states,
      districts,
      cities,
      loading,
      loadingChildCategories,
      loadingDistricts,
      loadingCities,
    } = useSelector((state) => state.filterDropdown);


 const mainCategoryRef = useRef(null);
    const subCategoryRef = useRef(null);
    const modelTypeRef = useRef(null);
    const locationRef = useRef(null);
    const investmentRef = useRef(null);
    const areaRequiredRef = useRef(null);


    const [searchTerms, setSearchTerms] = useState({
      mainCategory: "",
      subCategory: "",
      modelType: "",
      investmentRange: "",
      areaRequired: "",
      state: "",
      district: "",
      city: "",
    });

    const [expandedSections, setExpandedSections] = useState({
      mainCategory: true,
      subCategory: true,
      modelType: true,
      location: true,
      investment: true,
    });

    // Fetch initial filter data
    useEffect(() => {
      dispatch(fetchFilterOptions());
    }, [dispatch]);

    // Fetch subcategories and child categories when main category changes
    useEffect(() => {
      if (filters.maincat) {
        dispatch(fetchFilterOptions({ main: filters.maincat }));
        dispatch(resetChildCategories()); // Reset child categories when main category changes
      } else {
        dispatch(fetchFilterOptions()); // Fetch all filters if main category is cleared
      }
    }, [dispatch, filters.maincat]);

    // Fetch child categories when subcategory changes
    useEffect(() => {
      if (filters.subcat) {
        dispatch(fetchFilterOptions({ sub: filters.subcat }));
      }
    }, [dispatch, filters.subcat]);

    // Fetch districts when state changes
    useEffect(() => {
      if (filters.state) {
        dispatch(fetchFilterOptions({ state: filters.state }));
        dispatch(resetCities()); // Reset cities when state changes
      } else {
        dispatch(resetDistricts()); // Reset districts and cities when state is cleared
      }
    }, [dispatch, filters.state]);

    // Fetch cities when district changes
    useEffect(() => {
      if (filters.district) {
        dispatch(fetchFilterOptions({ district: filters.district }));
      }
    }, [dispatch, filters.district]);

    // Read URL parameters on mount
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const maincat = params.get("maincat");
      const subcat = params.get("subcat");
      const state = params.get("state");
      const investmentRange = params.get("investmentRange");
const areaRequired = params.get("areaRequired");

      if (maincat) onFilterChange("maincat", maincat);
      if (subcat) onFilterChange("subcat", subcat);
      if (state) onFilterChange("state", state);
      if (investmentRange) onFilterChange("investmentRange", investmentRange);
      if (areaRequired) onFilterChange("areaRequired", areaRequired);
    }, [onFilterChange]);

    const toggleSection = (section) => {
      setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSearchTermChange = (field) => (e) => {
      setSearchTerms((prev) => ({ ...prev, [field]: e.target.value }));
    };

    // Filter options based on search terms
    const filteredMainCategories = useMemo(() => {
      const term = searchTerms.mainCategory.toLowerCase();
      return mainCategories
        .filter((main) => main?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [mainCategories, searchTerms.mainCategory]);

    const filteredSubCategories = useMemo(() => {
      const term = searchTerms.subCategory.toLowerCase();
      return subCategories
        .filter((sub) => sub?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [subCategories, searchTerms.subCategory]);

    const filteredModelTypes = useMemo(() => {
      const term = searchTerms.modelType.toLowerCase().trim();
      return franchiseModels.filter((type) =>
        type?.toLowerCase().includes(term)
      );
    }, [franchiseModels, searchTerms.modelType]);

    const filteredInvestmentRanges = useMemo(() => {
      const term = searchTerms.investmentRange.toLowerCase();
      return investmentRanges
        .filter((range) => range?.toLowerCase().includes(term))
        .slice(0, 50);
    }, [investmentRanges, searchTerms.investmentRange]);

    const filteredAreaRequired = useMemo(() => {
      const term = searchTerms.areaRequired.toLowerCase();
      return areaRequired
        .filter((area) => area?.toLowerCase().includes(term))
        .slice(0, 50);
    }, [areaRequired, searchTerms.areaRequired]);



    const filteredStates = useMemo(() => {
      const term = searchTerms.state.toLowerCase();
      return states
        .filter((state) => state?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [states, searchTerms.state]);

    const filteredDistricts = useMemo(() => {
      if (!filters.state) return [];
      const term = searchTerms.district.toLowerCase();
      return districts
        .filter((d) => d?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [filters.state, districts, searchTerms.district]);

    const filteredCities = useMemo(() => {
      if (!filters.district) return [];
      const term = searchTerms.city.toLowerCase();
      return cities
        .filter((c) => c?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [filters.district, cities, searchTerms.city]);
    
const scrollToSection = (ref) => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    return (
      <Box sx={{ pr: 2, height: "calc(100vh - 120px)", overflowY: "auto" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Filters</Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            startIcon={<ClearIcon />}
            sx={{ color: "#ff9800" }}
          >
            Clear
          </Button>
        </Box>
<Breadcrumbs
          separator="|"
          sx={{ mb: 2, fontSize: "0.875rem" }}
          aria-label="filter sections"
        >
         
          <Link
            underline="hover"
            color="black"
            onClick={() => scrollToSection(subCategoryRef)}
            sx={{ cursor: "pointer" }}
          >
            Category
          </Link>
          <Link
            underline="hover"
            color="black"
            onClick={() => scrollToSection(modelTypeRef)}
            sx={{ cursor: "pointer" }}
          >
            Model Type
          </Link>
          <Link
            underline="hover"
            color="black"
            onClick={() => scrollToSection(locationRef)}
            sx={{ cursor: "pointer" }}
          >
            Location
          </Link>
          <Link
            underline="hover"
            color="black"
            onClick={() => scrollToSection(investmentRef)}
            sx={{ cursor: "pointer" }}
          >
            Investment
          </Link>
          <Link
            underline="hover"
            color="black"
            onClick={() => scrollToSection(areaRequiredRef)}
            sx={{ cursor: "pointer" }}
          >
            Area Required
          </Link>
        </Breadcrumbs>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search brands..."
          value={filters.serchterm || ""}
          onChange={(e) => onFilterChange("serchterm", e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "#ff9800" }} />,
          }}
          sx={{ mb: 3 }}
        />

        {/* Main Category Filter */}
        {/* <Accordion
          expanded={expandedSections.mainCategory}
          onChange={() => toggleSection("mainCategory")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Main Category
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search main categories..."
                value={searchTerms.mainCategory}
                onChange={handleSearchTermChange("mainCategory")}
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "#ff9800" }} />,
                }}
              />
              {loading ? (
                <Box sx={{ p: 2 }}>
                  <CircularProgress size={20} sx={{ color: "#ff9800" }} />
                </Box>
              ) : (
                <RadioGroup
                  value={filters.maincat || ""}
                  onChange={(e) => {
                    onFilterChange("maincat", e.target.value);
                    if (!e.target.value) {
                      dispatch(resetChildCategories());
                      dispatch(fetchFilterOptions()); // Fetch all filters when main category is cleared
                    }
                  }}
                >
                  <FormControlLabel
                    value=""
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": { color: "#4caf50" },
                          padding: "6px",
                        }}
                      />
                    }
                    label={<Typography fontSize="0.8125rem">All Categories</Typography>}
                    sx={{ mb: 0, mr: 0 }}
                  />
                  {filteredMainCategories.map((category) => (
                    <FormControlLabel
                      key={`cat-${category}`}
                      value={category}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            color: "#ff9800",
                            "&.Mui-checked": { color: "#4caf50" },
                            padding: "6px",
                          }}
                        />
                      }
                      label={<Typography fontSize="0.8125rem">{category}</Typography>}
                      sx={{ mb: 0, mr: 0 }}
                    />
                  ))}
                </RadioGroup>
              )}
            </Box>
          </AccordionDetails>
        </Accordion> */}

      {/* Sub Category Filter */}
<Accordion
  ref={subCategoryRef}
  expanded={expandedSections.subCategory}
  onChange={() => toggleSection("subCategory")}
  disableGutters
  elevation={0}
  sx={{ mb: 2, "&:before": { display: "none" } }}
>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
    sx={{
      px: 1,
      "&.Mui-expanded": { minHeight: "48px" },
    }}
  >
    <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
      Category
    </Typography>
  </AccordionSummary>

  <AccordionDetails sx={{ p: 0 }}>
    <Box sx={{ px: 1 }}>
      {loading ? (
        <Box sx={{ p: 2 }}>
          <CircularProgress size={20} sx={{ color: "#ff9800" }} />
        </Box>
      ) : (
        <RadioGroup
          value={filters.subcat || ""}
          onChange={(e) => {
            onFilterChange("subcat", e.target.value);
            if (!e.target.value) {
              dispatch(resetChildCategories());
            }
          }}
        >
          {/* 🔤 Sort subcategories alphabetically */}
          {[...filteredSubCategories]
            .sort((a, b) => a.localeCompare(b))
            .map((subCategory) => (
              <Box key={`subcat-container-${subCategory}`} sx={{ mb: 0 }}>
                <FormControlLabel
                  key={`subcat-${subCategory}`}
                  value={subCategory}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#ff9800",
                        "&.Mui-checked": { color: "#4caf50" },
                        padding: "6px",
                      }}
                    />
                  }
                  label={<Typography fontSize="0.8125rem">{subCategory}</Typography>}
                  sx={{ mb: 0, mr: 0 }}
                />

                {filters.subcat === subCategory && (
                  <Collapse in={filters.subcat === subCategory}>
                    <Accordion
                      expanded={expandedSections.subCategory}
                      disableGutters
                      elevation={0}
                      sx={{
                        ml: 3,
                        mt: 0.5,
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          minHeight: "10px",
                          px: 1,
                          "& .MuiAccordionSummary-content": { my: "2px" },
                        }}
                      />

                      <AccordionDetails sx={{ pt: 0, px: 1 }}>
                        {loadingChildCategories ? (
                          <Box sx={{ p: 2 }}>
                            <CircularProgress size={20} sx={{ color: "#ff9800" }} />
                          </Box>
                        ) : (
                          <RadioGroup
                            value={filters.childcat || ""}
                            onChange={(e) => onFilterChange("childcat", e.target.value)}
                          >
                            {/* 🔤 Sort child categories alphabetically */}
                            {[...childCategories]
                              .sort((a, b) => a.localeCompare(b))
                              .map((childCategory) => (
                                <FormControlLabel
                                  key={`childcat-${childCategory}`}
                                  value={childCategory}
                                  control={
                                    <Radio
                                      size="small"
                                      sx={{
                                        color: "#ff9800",
                                        "&.Mui-checked": { color: "#4caf50" },
                                        padding: "6px",
                                      }}
                                    />
                                  }
                                  label={
                                    <Typography fontSize="0.8125rem">
                                      {childCategory}
                                    </Typography>
                                  }
                                  sx={{ mb: 0, mr: 0 }}
                                />
                              ))}
                          </RadioGroup>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Collapse>
                )}
              </Box>
            ))}
        </RadioGroup>
      )}
    </Box>
  </AccordionDetails>
</Accordion>


       {/* Model Type Filter */}
<Accordion
  ref={modelTypeRef}
  expanded={expandedSections.modelType}
  onChange={() => toggleSection("modelType")}
  disableGutters
  elevation={0}
  sx={{ mb: 2, "&:before": { display: "none" } }}
>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
    sx={{
      px: 1,
      "&.Mui-expanded": { minHeight: "48px" },
    }}
  >
    <Typography
      sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}
    >
      Model Type
    </Typography>
  </AccordionSummary>

  <AccordionDetails sx={{ p: 0 }}>
    <Box sx={{ px: 1 }}>
      <RadioGroup
        value={filters.modelType || ""}
        onChange={(e) => onFilterChange("modelType", e.target.value)}
      >
        {/* Default all option */}
        <FormControlLabel
          value=""
          control={
            <Radio
              size="small"
              sx={{
                color: "#ff9800",
                "&.Mui-checked": { color: "#4caf50" },
                padding: "6px",
              }}
            />
          }
          label={
            <Typography fontSize="0.8125rem">All Model Types</Typography>
          }
          sx={{ mb: 0, mr: 0 }}
        />

        {/* 🔠 Sort alphabetically before mapping */}
        {[...filteredModelTypes]
          .sort((a, b) => a.localeCompare(b))
          .map((type) => (
            <FormControlLabel
              key={`modeltype-${type}`}
              value={type}
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#ff9800",
                    "&.Mui-checked": { color: "#4caf50" },
                    padding: "6px",
                  }}
                />
              }
              label={
                <Typography fontSize="0.8125rem">{type}</Typography>
              }
              sx={{ mb: 0, mr: 0 }}
            />
          ))}
      </RadioGroup>
    </Box>
  </AccordionDetails>
</Accordion>


        {/* Investment Range Filter */}
        <Accordion
          ref={investmentRef}
          expanded={expandedSections.investment}
          onChange={() => toggleSection("investment")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Investment Range
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              {/* <TextField
                fullWidth
                size="small"
                placeholder="Search investment ranges..."
                value={searchTerms.investmentRange}
                onChange={handleSearchTermChange("investmentRange")}
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "#ff9800" }}
                    />
                  ),
                }}
              /> */}
              <RadioGroup
                value={filters.investmentRange || ""}
                onChange={(e) => onFilterChange("investmentRange", e.target.value)}
              >
                <FormControlLabel
                  value=""
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#ff9800",
                        "&.Mui-checked": { color: "#4caf50" },
                        padding: "6px",
                      }}
                    />
                  }
                  label={<Typography fontSize="0.8125rem">All Ranges</Typography>}
                  sx={{ mb: 0, mr: 0 }}
                />
                {filteredInvestmentRanges
                  .slice()
                  .sort((a, b) => {
                    const priorityMap = {
                      "Below - 50,000": 0,
                      "Rs. 50,000 - 2 L": 1,
                      "Rs. 2 L - 5 L": 2,
                      "Rs. 5 L - 10 L": 3,
                      "Rs. 10 L - 20 L": 4,
                      "Rs. 20 L - 30 L": 5,
                      "Rs. 30 L - 50 L": 6,
                      "Rs. 50 L - 1 Cr": 7,
                      "Rs. 1 Cr - 2 Crs": 8,
                      "Rs. 2 Crs - 5 Crs": 9,
                    };

                    if (priorityMap[a] !== undefined && priorityMap[b] !== undefined) {
                      return priorityMap[a] - priorityMap[b];
                    }

                    const getValue = (range) => {
                      if (range.includes("Below")) return 0;
                      const match = range.match(/(\d[\d,.]*)/);
                      if (!match) return 0;
                      const num = parseFloat(match[0].replace(/,/g, ""));
                      if (range.includes("Cr")) return num * 10000000;
                      if (range.includes("L")) return num * 100000;
                      return num;
                    };

                    return getValue(a) - getValue(b);
                  })
                  .map((range) => (
                    <FormControlLabel
                      key={`range-${range}`}
                      value={range}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            color: "#ff9800",
                            "&.Mui-checked": { color: "#4caf50" },
                            padding: "6px",
                          }}
                        />
                      }
                      label={<Typography fontSize="0.8125rem">{range}</Typography>}
                      sx={{ mb: 0, mr: 0 }}
                    />
                  ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Area Required Filter */}

{/* Area Required Filter */}
<Accordion
  ref={areaRequiredRef}
  expanded={expandedSections.areaRequired || false}
  onChange={() => toggleSection("areaRequired")}
  disableGutters
  elevation={0}
  sx={{ mb: 2, "&:before": { display: "none" } }}
>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
    sx={{
      px: 1,
      "&.Mui-expanded": { minHeight: "48px" },
    }}
  >
    <Typography
      sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}
    >
      Area Required
    </Typography>
  </AccordionSummary>

  <AccordionDetails sx={{ p: 0 }}>
    <Box sx={{ px: 1 }}>
      <RadioGroup
        value={filters.areaRequired || ""}
        onChange={(e) => onFilterChange("areaRequired", e.target.value)}
      >
        <FormControlLabel
          value=""
          control={
            <Radio
              size="small"
              sx={{
                color: "#ff9800",
                "&.Mui-checked": { color: "#4caf50" },
                padding: "6px",
              }}
            />
          }
          label={<Typography fontSize="0.8125rem">All Areas</Typography>}
          sx={{ mb: 0, mr: 0 }}
        />

        {[...filteredAreaRequired]
          .slice()
          .sort((a, b) => {
            /**
             * Helper to extract numeric area (in sq ft)
             * Handles formats like "500 - 1000 sq ft", "800 SQ.FT", "1,000 Sq.Ft.", etc.
             */
            const extractNumber = (text) => {
              if (!text) return 0;
              const match = text.match(/\d[\d,]*/g);
              if (!match) return 0;
              const numbers = match.map((n) => parseFloat(n.replace(/,/g, "")));
              return numbers.length === 2
                ? (numbers[0] + numbers[1]) / 2 // take average of range
                : numbers[0];
            };

            return extractNumber(a) - extractNumber(b);
          })
          .map((area) => (
            <FormControlLabel
              key={`area-${area}`}
              value={area}
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#ff9800",
                    "&.Mui-checked": { color: "#4caf50" },
                    padding: "6px",
                  }}
                />
              }
              label={<Typography fontSize="0.8125rem">{area}</Typography>}
              sx={{ mb: 0, mr: 0 }}
            />
          ))}
      </RadioGroup>
    </Box>
  </AccordionDetails>
</Accordion>


  {/* Location Filters */}
<Accordion
  ref={locationRef}
  expanded={expandedSections.location}
  onChange={() => toggleSection("location")}
  disableGutters
  elevation={0}
  sx={{ mb: 2, "&:before": { display: "none" } }}
>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
    sx={{
      px: 1,
      "&.Mui-expanded": { minHeight: "48px" },
    }}
  >
    <Typography
      sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}
    >
      Location Filters
    </Typography>
  </AccordionSummary>

  <AccordionDetails sx={{ p: 0 }}>
    {/* ----- STATE FILTER ----- */}
    <Box sx={{ px: 1, mb: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search states..."
        value={searchTerms.state}
        onChange={handleSearchTermChange("state")}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: (
            <SearchIcon fontSize="small" sx={{ mr: 1, color: "#ff9800" }} />
          ),
        }}
      />

      <RadioGroup
        value={filters.state || ""}
        onChange={(e) => {
          onFilterChange("state", e.target.value);
          if (!e.target.value) {
            dispatch(resetDistricts());
          }
        }}
      >
        {/* All states option */}
        <FormControlLabel
          value=""
          control={
            <Radio
              size="small"
              sx={{
                color: "#ff9800",
                "&.Mui-checked": { color: "#4caf50" },
                padding: "6px",
              }}
            />
          }
          label={<Typography fontSize="0.8125rem">All States</Typography>}
          sx={{ mb: 0, mr: 0 }}
        />

        {/* 🔠 Sorted States */}
        {[...filteredStates]
          .sort((a, b) => a.localeCompare(b))
          .map((state) => (
            <Box key={`state-container-${state}`} sx={{ mb: 0 }}>
              <FormControlLabel
                key={`state-${state}`}
                value={state}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "#ff9800",
                      "&.Mui-checked": { color: "#4caf50" },
                      padding: "6px",
                    }}
                  />
                }
                label={
                  <Typography fontSize="0.8125rem" fontWeight="500">
                    {state}
                  </Typography>
                }
                sx={{ mb: 0, mr: 0 }}
              />

              {/* Nested Region: District Filter appears when this state is selected */}
              {filters.state === state && (
                <Collapse in={filters.state === state} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      borderLeft: "2px solid #e0e0e0",
                      ml: 3,
                      pl: 2,
                      mt: 1,
                      backgroundColor: "rgba(0,0,0,0.02)",
                      borderRadius: 1,
                      py: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        fontSize: "0.8rem",
                        color: "black",
                      }}
                    >
                      cities
                    </Typography>

                    {loadingDistricts ? (
                      <Box sx={{ p: 2 }}>
                        <CircularProgress size={20} sx={{ color: "#ff9800" }} />
                      </Box>
                    ) : (
                      <RadioGroup
                        value={filters.district || ""}
                        onChange={(e) => {
                          onFilterChange("district", e.target.value);
                        }}
                      >
                        {/* <FormControlLabel
                          value=""
                          control={
                            <Radio
                              size="small"
                              sx={{
                                color: "#ff9800",
                                "&.Mui-checked": { color: "#4caf50" },
                                padding: "6px",
                              }}
                            />
                          }
                          label={
                            <Typography fontSize="0.8125rem">
                              All Districts
                            </Typography>
                          }
                          sx={{ mb: 0 }}
                        /> */}

                        {/* 🔠 Sorted Districts */}
                        {[...filteredDistricts]
                          .sort((a, b) => a.localeCompare(b))
                          .map((district) => (
                            <Box key={`district-container-${district}`} sx={{ mb: 0 }}>
                              <FormControlLabel
                                key={`district-${district}`}
                                value={district}
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      color: "#ff9800",
                                      "&.Mui-checked": { color: "#4caf50" },
                                      padding: "6px",
                                    }}
                                  />
                                }
                                label={
                                  <Typography fontSize="0.8125rem">
                                    {district}
                                  </Typography>
                                }
                                sx={{ mb: 0, mr: 0 }}
                              />

                              {/* Optional: Nested Cities under each District */}
                              {filters.district === district && (
                                <Collapse in={filters.district === district}>
                                  <Box
                                    sx={{
                                      borderLeft: "2px dashed #c8e6c9",
                                      ml: 3,
                                      pl: 2,
                                      mt: 0.5,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: "bold",
                                        fontSize: "0.75rem",
                                        color: "#4caf50",
                                        mb: 0.5,
                                      }}
                                    >
                                      Cities
                                    </Typography>

                                    {loadingCities ? (
                                      <Box sx={{ p: 2 }}>
                                        <CircularProgress
                                          size={18}
                                          sx={{ color: "#ff9800" }}
                                        />
                                      </Box>
                                    ) : (
                                      <RadioGroup
                                        value={filters.city || ""}
                                        onChange={(e) =>
                                          onFilterChange("city", e.target.value)
                                        }
                                      >
                                        <FormControlLabel
                                          value=""
                                          control={
                                            <Radio
                                              size="small"
                                              sx={{
                                                color: "#ff9800",
                                                "&.Mui-checked": {
                                                  color: "#4caf50",
                                                },
                                                padding: "6px",
                                              }}
                                            />
                                          }
                                          label={
                                            <Typography fontSize="0.8125rem">
                                              All Cities
                                            </Typography>
                                          }
                                          sx={{ mb: 0, mr: 0 }}
                                        />

                                        {/* 🔠 Sorted Cities */}
                                        {[...filteredCities]
                                          .sort((a, b) => a.localeCompare(b))
                                          .map((city) => (
                                            <FormControlLabel
                                              key={`city-${city}`}
                                              value={city}
                                              control={
                                                <Radio
                                                  size="small"
                                                  sx={{
                                                    color: "#ff9800",
                                                    "&.Mui-checked": {
                                                      color: "#4caf50",
                                                    },
                                                    padding: "6px",
                                                  }}
                                                />
                                              }
                                              label={
                                                <Typography fontSize="0.8125rem">
                                                  {city}
                                                </Typography>
                                              }
                                              sx={{ mb: 0, mr: 0 }}
                                            />
                                          ))}
                                      </RadioGroup>
                                    )}
                                  </Box>
                                </Collapse>
                              )}
                            </Box>
                          ))}
                      </RadioGroup>
                    )}
                  </Box>
                </Collapse>
              )}
            </Box>
          ))}
      </RadioGroup>
    </Box>
  </AccordionDetails>
</Accordion>




        <Divider sx={{ my: 2 }} />
        <Typography
          variant="body2"
          sx={{ color: "#4caf50", textAlign: "center" }}
        >
          Showing {resultStats.showing || 0} of {resultStats.total || 0} brands
        </Typography>
      </Box>
    );
  }
);

export default FilterPanel;
