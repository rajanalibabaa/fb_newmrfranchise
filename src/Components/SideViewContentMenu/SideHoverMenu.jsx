import React, { useState, useEffect, useMemo, useCallback } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
  Divider,
  Chip,
  Tabs,
  Tab,
  AppBar,
  Paper,
  Fade,
  Grow,
  Button,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { categories } from "../../Pages/Registration/BrandLIstingRegister/BrandCategories";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice.jsx";
import { fetchFilterOptions } from "../../Redux/Slices/filterDropdownData.jsx"; // Import for fetching subcategories
import { setFilter, fetchFilteredBrands } from "../../Redux/Slices/filterBrandSlice"; // Import filter actions

// Memoized brand card component with optimized props
const BrandCard = React.memo(
  ({ brand, onClick, isMobile }) => {


    console.log("brandcard", brand)
    const brandName = brand.brandname || "Unknown";
    const brandLogo = brand.logo || "";
    const initial = brandName[0]?.toUpperCase() || "B";

    return (
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Paper
          onClick={onClick}
          elevation={2}
          sx={{
            width: isMobile ? 100 : 100,
            height: isMobile ? 130 : 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: "1px solid #eee",
            backgroundColor: "#fff",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              borderColor: "#ff9800",
            },
          }}
        >
          <Box
            sx={{
              width: isMobile ? 48 : 60,
              height: isMobile ? 48 : 60,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <Avatar
              src={brandLogo}
              alt={brandName}
              sx={{
                width: "100%",
                height: "100%",
                fontSize: isMobile ? 22 : 26,
                bgcolor: "#ffe0b2",
                color: "#ff6d00",
              }}
            >
              {initial}
            </Avatar>
          </Box>
          <Typography
            fontWeight={500}
            textAlign="center"
            noWrap
            sx={{
              fontSize: isMobile ? "0.75rem" : "0.65rem",
              maxWidth: "100%",
              px: 1,
              color: "text.primary",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: 1.3,
            }}
          >
            {brandName}
          </Typography>
        </Paper>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if brand ID changes or mobile status changes
    return (
      prevProps.brand.uuid === nextProps.brand.uuid &&
      prevProps.isMobile === nextProps.isMobile
    );
  }
);

// Skeleton loader for brands
const BrandCardSkeleton = ({ isMobile }) => (
  <Skeleton
    variant="square"
    width={isMobile ? 100 : 100}
    height={isMobile ? 130 : 120}
    sx={{ borderRadius: 2 }}
  />
);

const SideViewContent = ({ hoverCategory, onHoverLeave }) => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [mobileTabValue, setMobileTabValue] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [availableChildCategories, setAvailableChildCategories] = useState([]);

  // Selectors for Redux state
  const { 
    brands, 
    loading, 
    error, 
    pagination,
    filters 
  } = useSelector((state) => state.filterBrands);


  console.log("brands:" ,brands)

  const { 
    subCategories: filterSubCategories,
    childCategories: filterChildCategories,
    loading: filterLoading 
  } = useSelector((state) => state.filterDropdown);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Handle category hover - fetch subcategories for that category
  const handleCategoryHover = useCallback(
    async (index, categoryName) => {
      if (activeCategory !== index) {
        setIsTransitioning(true);
        
        // Clear existing data
        setActiveCategory(index);
        setActiveSubCategory(null);
        setAvailableChildCategories([]);
        
        // Reset brand filters but keep the main category
        dispatch(setFilter({ filterName: "subcat", value: null }));
        dispatch(setFilter({ filterName: "childcat", value: null }));
        
        // Fetch subcategories for the selected category
        try {
          const result = await dispatch(fetchFilterOptions({ main: categoryName }));
          if (result.payload) {
            setAvailableSubCategories(result.payload.subcat || []);
          }
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
        } finally {
          setIsTransitioning(false);
        }
      }
    },
    [activeCategory, dispatch]
  );

  // Handle subcategory hover - fetch child categories and brands
  const handleSubCategoryHover = useCallback(
    async (subCategoryName) => {
      if (activeSubCategory !== subCategoryName) {
        setActiveSubCategory(subCategoryName);
        setIsTransitioning(true);
        
        // Set the subcategory filter
        dispatch(setFilter({ filterName: "subcat", value: subCategoryName }));
        dispatch(setFilter({ filterName: "childcat", value: null }));
        
        // Fetch child categories for this subcategory
        try {
          const result = await dispatch(fetchFilterOptions({ 
            main: categories[activeCategory]?.name || "Food & Beverages",
            sub: subCategoryName 
          }));

          console.log("result",result)
          
          if (result.payload) {
            setAvailableChildCategories(result.payload || []);
          }
          
          // Fetch brands for this subcategory
          await dispatch(fetchFilteredBrands({
            maincat: categories[activeCategory]?.name || "Food & Beverages",
            subcat: subCategoryName,
            page: 1,
            limit: 30
          }));
          
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setIsTransitioning(false);
        }
      }
    },
    [activeCategory, activeSubCategory, dispatch]
  );

  // Handle child category selection
  const handleChildCategoryHover = useCallback(
    async (childCategoryName) => {
      setIsTransitioning(true);
      
      // Set the child category filter
      dispatch(setFilter({ filterName: "childcat", value: childCategoryName }));
      
      // Fetch brands for this child category
      try {
        await dispatch(fetchFilteredBrands({
          maincat: categories[activeCategory]?.name || "Food & Beverages",
          subcat: activeSubCategory,
          childcat: childCategoryName,
          page: 1,
          limit: 30
        }));
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setIsTransitioning(false);
      }
    },
    [activeCategory, activeSubCategory, dispatch]
  );

  const handleBrandClick = useCallback((brand) => {
    dispatch(openBrandDialog(brand));
  }, [dispatch]);

  const handleMobileTabChange = useCallback((event, newValue) => {
    setMobileTabValue(newValue);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNext) {
      dispatch(fetchFilteredBrands({
        ...filters,
        page: pagination.currentPage + 1,
        limit: pagination.limit
      }));
    }
  }, [pagination, filters, dispatch]);

  // Clear brands when drawer closes
  useEffect(() => {
    if (!hoverCategory) {
      setActiveCategory(null);
      setActiveSubCategory(null);
      setMobileTabValue(0);
      setAvailableSubCategories([]);
      setAvailableChildCategories([]);
      // Reset filters
      dispatch(setFilter({ filterName: "subcat", value: null }));
      dispatch(setFilter({ filterName: "childcat", value: null }));
    }
  }, [hoverCategory, dispatch]);

  // Fetch initial subcategories when category is selected
  useEffect(() => {
    if (activeCategory !== null && hoverCategory) {
      const categoryName = categories[activeCategory]?.name;
      if (categoryName) {
        dispatch(fetchFilterOptions({ main: categoryName }))
          .then((result) => {
            if (result.payload) {
              setAvailableSubCategories(result.payload.subcat || []);
            }
          });
      }
    }
  }, [activeCategory, hoverCategory, dispatch]);

  // Memoized mobile tab content
  const getMobileTabContent = useMemo(() => {
    const tabContents = [
      // Categories Tab
      <Box sx={{ p: 2 }}>
        {categories.map((category, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Box
              onClick={() => {
                handleCategoryHover(index, category.name);
                setMobileTabValue(1);
              }}
              sx={{
                cursor: "pointer",
                py: 1.5,
                px: 1.5,
                borderRadius: 2,
                mb: 1,
                color: activeCategory === index ? "white" : "text.primary",
                bgcolor:
                  activeCategory === index
                    ? "primary.main"
                    : "background.paper",
                fontWeight: "medium",
                transition: "all 0.3s ease",
                boxShadow: theme.shadows[1],
                "&:hover": {
                  bgcolor:
                    activeCategory === index ? "primary.dark" : "action.hover",
                },
              }}
            >
              <Typography variant="subtitle1">{category.name}</Typography>
            </Box>
          </motion.div>
        ))}
      </Box>,
      // Subcategories Tab
      <Box sx={{ p: 2 }}>
        <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.98 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              cursor: "pointer",
              p: 1,
              borderRadius: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
            onClick={() => setMobileTabValue(0)}
          >
            <IconButton size="small" sx={{ mr: 1 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Back to Categories
            </Typography>
          </Box>
        </motion.div>
        {availableSubCategories.map((subCategory, idx) => (
          <Grow in={true} timeout={(idx + 1) * 150} key={idx}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Box
                onClick={() => handleSubCategoryHover(subCategory)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  py: 1.5,
                  px: 1.5,
                  borderRadius: 2,
                  gap: 1.5,
                  mb: 1,
                  bgcolor:
                    activeSubCategory === subCategory
                      ? "primary.light"
                      : "background.paper",
                  color:
                    activeSubCategory === subCategory
                      ? "primary.contrastText"
                      : "text.primary",
                  boxShadow: theme.shadows[1],
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor:
                      activeSubCategory === subCategory
                        ? "primary.main"
                        : "action.hover",
                  },
                }}
              >
                <Typography
                  fontWeight={
                    activeSubCategory === subCategory ? "bold" : "medium"
                  }
                >
                  {subCategory}
                </Typography>
              </Box>
            </motion.div>
          </Grow>
        ))}
      </Box>,
    ];

    return tabContents[mobileTabValue] || null;
  }, [
    mobileTabValue,
    activeCategory,
    activeSubCategory,
    availableSubCategories,
    handleCategoryHover,
    handleSubCategoryHover,
    theme.shadows,
  ]);

  // Optimized brands grid rendering with skeleton loading
  const renderBrandsGrid = useMemo(() => {
    // Show loading state during transitions or initial load
    if (isTransitioning || (loading && brands.length === 0)) {
      return (
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
          <Grid container spacing={isMobile ? 1 : 2}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={`initial-skeleton-${index}`}
              >
                <BrandCardSkeleton isMobile={isMobile} />
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }
    
    if (error) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "error.main",
            textAlign: "center",
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Oops! Brands Under Updating Process
          </Typography>
        </Box>
      );
    }

    if (brands.length > 0) {
      // Determine current category name for display
      const currentCategoryName = activeCategory !== null 
        ? categories[activeCategory]?.name 
        : filters.maincat || "Popular Brands";

      return (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              pt: isMobile ? 1 : 0,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                background: " #ff9800",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {currentCategoryName}
              {activeSubCategory && ` - ${activeSubCategory}`}
              {filters.childcat && ` - ${filters.childcat}`}
            </Typography>
            <Chip
              label={`${brands.length} brands`}
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

       
          <Grid container spacing={isMobile ? 1 : 2}>
            {brands.map((brand, index) => {
              const uniqueKey = brand?.uuid
                ? `brand-${brand.uuid}-${index}`
                : `brand-fallback-${index}`;

              return (
                <Grid item xs={12} sm={6} md={3} key={uniqueKey}>
                  <BrandCard
                    brand={brand}
                    onClick={() => handleBrandClick(brand)}
                    isMobile={isMobile}
                  />
                </Grid>
              );
            })}

            {loading && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={`loadmore-skeleton-${index}`}
                  >
                    <BrandCardSkeleton isMobile={isMobile} />
                  </Grid>
                ))}
              </>
            )}
          </Grid>
          
          {pagination.hasNext && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                aria-label="load more brands"
                onClick={handleLoadMore}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </Box>
          )}
        </>
      );
    }

    // Empty state
    return (
      <Fade in={true}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "text.secondary",
            textAlign: "center",
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {activeSubCategory 
              ? `No brands found for "${activeSubCategory}"`
              : "Find Your Dream Franchise Brands"}
          </Typography>
          <Typography variant="body2">
            {isMobile
              ? "Select a category to see brands"
              : activeSubCategory
              ? "Try selecting a different subcategory"
              : "Select a subcategory to see related brands"}
          </Typography>
        </Box>
      </Fade>
    );
  }, [
    brands,
    loading,
    error,
    isMobile,
    pagination,
    filters,
    activeCategory,
    activeSubCategory,
    availableChildCategories,
    handleLoadMore,
    handleBrandClick,
    handleChildCategoryHover,
    isTransitioning,
  ]);

  return (
    <Drawer
      anchor="top"
      open={hoverCategory !== null}
      onClose={onHoverLeave}
      PaperProps={{
        sx: {
          height: isMobile ? "85vh" : isTablet ? "65vh" : 500,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px 0 rgba(60,72,88,0.18)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          border: "1.5px solid rgba(255,255,255,0.25)",
        },
      }}
      SlideProps={{ timeout: 300 }}
    >
      <Box
        onMouseLeave={onHoverLeave}
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Mobile Tabs Navigation */}
        {isMobile && (
          <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{ background: "#ff9800", color: "white" }}
          >
            <Tabs
              value={mobileTabValue}
              onChange={handleMobileTabChange}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="inherit"
              sx={{
                "& .MuiTabs-indicator": { height: 4, backgroundColor: "white" },
              }}
            >
              <Tab
                label="Categories"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  minHeight: 48,
                }}
              />
              <Tab
                label="Subcategories"
                disabled={activeCategory === null}
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  minHeight: 48,
                }}
              />
            </Tabs>
          </AppBar>
        )}

        {/* Desktop View */}
        {!isMobile && (
          <>
            {/* Categories Column - Fixed */}
            <Box
              sx={{
                width: 240,
                borderRight: `1px solid ${theme.palette.divider}`,
                overflowY: "auto",
                px: 2,
                py: 2,
                background:
                  "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
              }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    onMouseEnter={() => handleCategoryHover(index, category.name)}
                    sx={{
                      cursor: "pointer",
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      mb: 1.5,
                      color:
                        activeCategory === index ? "white" : "text.primary",
                      bgcolor:
                        activeCategory === index
                          ? "orange"
                          : "background.paper",
                      fontWeight: "medium",
                      transition: "all 0.3s ease",
                      boxShadow: theme.shadows[1],
                      "&:hover": {
                        bgcolor:
                          activeCategory === index ? "orange" : "action.hover",
                      },
                    }}
                  >
                    <Typography variant="subtitle1">{category.name}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {/* Subcategories Column - Fixed */}
            {activeCategory !== null && (
              <Box
                sx={{
                  width: 260,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  overflowY: "auto",
                  px: 2,
                  py: 2,
                  background:
                    "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                  color="text.secondary"
                >
                  {categories[activeCategory]?.name || "Select Category"}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {availableSubCategories.length > 0 ? (
                  availableSubCategories.map((subCategory, idx) => (
                    <Grow in={true} timeout={(idx + 1) * 150} key={idx}>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Box
                          onMouseEnter={() => handleSubCategoryHover(subCategory)}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            py: 1.5,
                            px: 2,
                            borderRadius: 2,
                            gap: 1.5,
                            mb: 1.5,
                            bgcolor:
                              activeSubCategory === subCategory
                                ? "orange"
                                : "background.paper",
                            color:
                              activeSubCategory === subCategory
                                ? "primary.contrastText"
                                : "text.primary",
                            boxShadow: theme.shadows[1],
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor:
                                activeSubCategory === subCategory
                                  ? "orange"
                                  : "action.hover",
                            },
                          }}
                        >
                          <Typography
                            fontWeight={
                              activeSubCategory === subCategory
                                ? "bold"
                                : "medium"
                            }
                          >
                            {subCategory}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grow>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No subcategories available
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}

        {/* Mobile Tab Content */}
        {isMobile && (
          <Box
            sx={{ flex: 1, overflowY: "auto", bgcolor: "background.default" }}
          >
            {getMobileTabContent}
          </Box>
        )}

        {/* Brands Grid - Common for both mobile and desktop */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: isMobile ? 1 : 3,
            py: 2,
            bgcolor: "background.paper",
            borderTop: isMobile ? `1px solid ${theme.palette.divider}` : "none",
          }}
        >
          {renderBrandsGrid}
        </Box>
      </Box>
    </Drawer>
  );
};

export default React.memo(SideViewContent);