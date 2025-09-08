import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Typography, Avatar, IconButton, Divider, CircularProgress } from "@mui/material";
import { Business, Favorite, AssignmentTurnedIn, Bookmark, Close } from "@mui/icons-material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import img from "../../assets/Images/logo.png";
import { api } from "../../Api/api";
import { fetchShortListedById } from "../../Redux/Slices/shortlistslice";
import { fetchLikedBrandsById } from "../../Redux/Slices/likeSlice";
import { fetchViewBrandsById, removeviewBrand } from "../../Redux/Slices/viewSlice"; 
import { handleShortList } from "../../Api/shortListApi";
import { likeApiFunction } from "../../Api/likeApi";
import StatCard from "./DashBoardFunctions/StatCard";
import ViewedBrands from "./DashBoardFunctions/ViewedBrands";
import LikedTab from "./DashBoardFunctions/LikedTab";
import AppliedTab from "./DashBoardFunctions/AppliedTab";
import ShortlistedTab from "./DashBoardFunctions/ShortlistedTab";
import {useNavigate} from "react-router-dom";
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [likedStates, setLikedStates] = useState({});
  const [shortlistedStates, setShortlistedStates] = useState({});
  const [removeMsg, setRemoveMsg] = useState("");
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isPaginating, setIsPaginating] = useState(false);

  const investorUUID = useSelector((state) => state.auth?.investorUUID);  
  const AccessToken = useSelector((state) => state.auth?.AccessToken);
  const shortListState = useSelector(state => state.shortList);
  const likedBrandsState = useSelector(state => state.likedBrands);
  const viewBrandsState = useSelector(state => state.viewBrands);

  const { brands: viewedBrands, pagination: viewPagination } = viewBrandsState;
  const shortlistedBrands = Array.isArray(shortListState.brands) ? shortListState.brands : [];
  const likedBrands = Array.isArray(likedBrandsState.brands) ? likedBrandsState.brands : [];

  const isLoading = likedBrandsState.isLoading || shortListState.isLoading || isPaginating;
  const errorMessage = likedBrandsState.error || shortListState.error;

  const stats = useMemo(() => ({
    totalViews: viewPagination?.totalItems || viewedBrands?.length || 0,
    totalLikes: likedBrands.length,
    totalApplications: appliedBrands.length,
    totalShortlisted: shortListState?.pagination?.total || shortlistedBrands.length
  }), [viewedBrands, viewPagination, likedBrands, appliedBrands, shortlistedBrands, shortListState]);

  const fetchBrandDetails = async (brandId, config) => {
    try {
      const response = await axios.get(
        `${api.user.get.brand}/${brandId}`,
        config
      );
      return {
        ...response.data.data,
        businessType: response.data.data.businessType || response.data.data.category || 'Not specified'
      };
    } catch (error) {
      console.error(`Error fetching brand ${brandId}:`, error);
      return null;
    }
  };

  const fetchData = useCallback(async () => {
    if (!investorUUID || !AccessToken) return;

    try {
      setIsPaginating(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccessToken}`,
        }
      };

      const [likedRes, shortlistRes, viewRes, appliedRes, userRes] = await Promise.all([
        dispatch(fetchLikedBrandsById({ userId: investorUUID })),
        dispatch(fetchShortListedById({ 
          investorUUID, 
          page: 1, 
          limit: itemsPerPage 
        })),     
        dispatch(fetchViewBrandsById({ userId: investorUUID })),
        axios.get(`${api.instantApplyApi.get.getInstaApplyById}/${investorUUID}`, config),
        axios.get(`${api.user.get.investor}/${investorUUID}`, config)
      ]);

      // Enhance applied brands with additional details
      const enhancedAppliedBrands = await Promise.all(
        appliedRes.data?.data?.map(async (item) => {
          if (!item.application?.brandId) return item;
          
          const brandDetails = await fetchBrandDetails(item.application.brandId, config);
          return {
            ...item,
            brandDetails: brandDetails || {}
          };
        }) || []
      );

      setAppliedBrands(enhancedAppliedBrands);
      setUserData(userRes.data?.data || null);
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      setIsPaginating(false);
    }
  }, [investorUUID, AccessToken, dispatch, itemsPerPage]);

  useEffect(() => {
    const initialLiked = {};
    likedBrands.forEach(item => {
      const brandId = item.uuid || item.brandID?.uuid || item.brandID;
      if (brandId) initialLiked[brandId] = true;
    });
    setLikedStates(initialLiked);

    const initialShortlisted = {};
    shortlistedBrands.forEach(item => {
      const brandId = item.uuid || item.brandID?.uuid || item.brandID;
      if (brandId) initialShortlisted[brandId] = true;
    });
    setShortlistedStates(initialShortlisted);
  }, [likedBrands, shortlistedBrands]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tabValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleLike = useCallback(async (brandId) => {
    if (!brandId) return;

    const brandToRemove = likedBrands.find(brand =>
      brand.uuid === brandId ||
      brand.brandID?.uuid === brandId ||
      brand.brandID === brandId
    );

    if (!brandToRemove) return;

    const apiBrandId = brandToRemove.uuid || brandToRemove.brandID?.uuid || brandToRemove.brandID;

    setLikedStates(prev => {
      const newState = { ...prev };
      delete newState[brandId];
      return newState;
    });

    try {
      await likeApiFunction(apiBrandId);
      setRemoveMsg("Brand removed successfully");
      setTimeout(() => setRemoveMsg(""), 3000);
      dispatch(fetchLikedBrandsById({ userId: investorUUID }));
    } catch (error) {
      console.error("Remove like error:", error);
      setRemoveMsg(error.message || "Failed to remove brand");
      setLikedStates(prev => ({ ...prev, [brandId]: true }));
    }
  }, [investorUUID, dispatch, likedBrands]);

  const toggleShortlist = useCallback(async (brandId) => {
    if (!brandId) return;

    try {
      setIsPaginating(true);
      setShortlistedStates(prev => ({
        ...prev,
        [brandId]: !prev[brandId]
      }));

      await handleShortList(brandId);
      
      const response = await dispatch(fetchShortListedById({
        investorUUID,
        page: currentPage,
        limit: itemsPerPage
      }));

      if (response?.payload?.brands) {
        const updatedStates = {};
        response.payload.brands.forEach(brand => {
          const id = brand.uuid || brand.brandID?.uuid || brand.brandID;
          if (id) updatedStates[id] = true;
        });
        setShortlistedStates(updatedStates);
      }

      setRemoveMsg(shortlistedStates[brandId] 
        ? "Brand removed from shortlist" 
        : "Brand added to shortlist");
      
      setTimeout(() => setRemoveMsg(""), 3000);
    } catch (error) {
      setShortlistedStates(prev => ({
        ...prev,
        [brandId]: !prev[brandId]
      }));
      console.error("Shortlist toggle error:", error);
      setRemoveMsg(error.message || "Failed to update shortlist");
    } finally {
      setIsPaginating(false);
    }
  }, [investorUUID, dispatch, shortlistedStates, currentPage, itemsPerPage]);

  const toggleViewClose = useCallback(async (brandId) => {
    if (!investorUUID || !AccessToken || !brandId) return;

    try {
      setIsPaginating(true);
      await dispatch(removeviewBrand({
        userId: investorUUID,
        brandId,
        token: AccessToken
      })).unwrap();

      setRemoveMsg("Brand removed from view history");
      setTimeout(() => setRemoveMsg(""), 3000);
      dispatch(fetchViewBrandsById({ userId: investorUUID }));
    } catch (error) {
      console.error("Error removing viewed brand:", error);
      setRemoveMsg(error.message || "Failed to remove brand from view history");
    } finally {
      setIsPaginating(false);
    }
  }, [investorUUID, AccessToken, dispatch]);

const handleViewDetails = useCallback((brand) => {
  // Try to get brandId from multiple possible locations
  const brandId = brand?.uuid || brand?.brandID?.uuid || brand?.brandID || brand?.originalItem?.brandDetails?.uuid;
  
  if (brandId) {
    navigate(`/brands/${brandId}`);
    // or window.open(`/brands/${brandId}`, '_blank') for new tab
  } else {
    console.error('Brand ID not found:', brand);
    // Fallback to dialog or other action
  }
}, [navigate]);

  const handlePageChange = async (event, value) => {
    try {
      setIsPaginating(true);
      setCurrentPage(value);
      
      if (tabValue === 3) {
        await dispatch(fetchShortListedById({
          investorUUID,
          page: value,
          limit: itemsPerPage
        }));
      }
    } catch (error) {
      console.error("Page change error:", error);
    } finally {
      setIsPaginating(false);
    }
  };

  const renderTabContent = useMemo(() => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (errorMessage) {
      return (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      );
    }

    switch(tabValue) {
      case 0:
        return (
          <ViewedBrands
            brands={viewedBrands}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={Math.max(1, Math.ceil((viewedBrands?.length || 0) / itemsPerPage))}
            handlePageChange={handlePageChange}
            likedStates={likedStates}
            shortlistedStates={shortlistedStates}
            onViewDetails={handleViewDetails}
            onToggleLike={toggleLike}
            onToggleShortlist={toggleShortlist}
            onToggleViewClose={toggleViewClose}
            isPaginating={isPaginating}
          />
        );
      case 1:
        return (
          <LikedTab
            items={likedBrands}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={Math.max(1, Math.ceil((likedBrands?.length || 0) / itemsPerPage))}
            handlePageChange={handlePageChange}
            likedStates={likedStates}
            shortlistedStates={shortlistedStates}
            onViewDetails={handleViewDetails}
            onToggleLike={toggleLike}
            onToggleShortlist={toggleShortlist}
            isPaginating={isPaginating}
          />
        );
      case 2:
        return (
          <AppliedTab
            items={appliedBrands}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={Math.max(1, Math.ceil((appliedBrands?.length || 0) / itemsPerPage))}
            handlePageChange={handlePageChange}
            likedStates={likedStates}
            shortlistedStates={shortlistedStates}
            onViewDetails={handleViewDetails}
            onToggleLike={toggleLike}
            onToggleShortlist={toggleShortlist}
            isPaginating={isPaginating}
          />
        );
      case 3:
        return (
          <ShortlistedTab
            items={shortlistedBrands}
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil((shortListState?.pagination?.total || 0) / itemsPerPage))}
            handlePageChange={handlePageChange}
            likedStates={likedStates}
            shortlistedStates={shortlistedStates}
            onViewDetails={handleViewDetails}
            onToggleLike={toggleLike}
            onToggleShortlist={toggleShortlist}
            isPaginating={isPaginating}
          />
        );
      default:
        return null;
    }
  }, [
    isLoading, errorMessage, tabValue, currentPage, itemsPerPage,
    viewedBrands, likedBrands, appliedBrands, shortlistedBrands,
    likedStates, shortlistedStates, handleViewDetails, 
    toggleLike, toggleShortlist, toggleViewClose, isPaginating,
    shortListState?.pagination?.total
  ]);

  return (
    <Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        gap: 2
      }}>
        <Avatar
          src={userData?.profileImage || img}
          loading="lazy"
          alt="Profile"
          sx={{
            width: 60,
            height: 60,
            mr: { md: 3 },
            border: '3px solid #689f38'
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            {userData?.firstName || 'Investor'} {userData?.lastName || ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData?.inveterID || ''}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        justifyContent: { xs: 'center', md: 'flex-start' },
        mt: 3,
        flexWrap: 'nowrap',
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { height: '6px' },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
        },
        position: 'relative', 
        py: 2  
      }}>
        <StatCard 
          icon={<Business />} 
          title="Viewed" 
          value={stats.totalViews} 
          color="76, 175, 80"
          isSelected={tabValue === 0}
          onClick={() => setTabValue(0)}
        />
        <StatCard 
          icon={<Favorite />} 
          title="Liked" 
          value={stats.totalLikes} 
          color="244, 67, 54"
          isSelected={tabValue === 1}
          onClick={() => setTabValue(1)}
        />
        <StatCard 
          icon={<AssignmentTurnedIn />} 
          title="Applied" 
          value={stats.totalApplications} 
          color="33, 150, 243"
          isSelected={tabValue === 2}
          onClick={() => setTabValue(2)}
        />
        <StatCard 
          icon={<Bookmark />}  
          title="Shortlisted" 
          value={stats.totalShortlisted} 
          color="156, 39, 176"  
          isSelected={tabValue === 3} 
          onClick={() => setTabValue(3)}
        />
        
        <Divider 
          sx={{ 
            position: 'absolute', 
            bottom: 0,
            left: 0, 
            right: 0, 
            borderColor: 'divider' 
          }} 
        />
      </Box>

      <Box sx={{ p: 3 }}>
        {removeMsg && (
          <Box 
            sx={{ 
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#4caf50',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography>{removeMsg}</Typography>
            <IconButton size="small" onClick={() => setRemoveMsg("")}>
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        )}
        
        {renderTabContent}
      </Box>
    </Box>
  );
};

export default Dashboard;