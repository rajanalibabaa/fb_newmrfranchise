import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Box, Typography, Avatar, IconButton, Divider, CircularProgress 
} from "@mui/material";
import { Business, Favorite, AssignmentTurnedIn, Bookmark, Close } from "@mui/icons-material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import img from "../../assets/Images/logo.png";
import { api } from "../../Api/api";
import { fetchShortListedById } from "../../Redux/Slices/shortlistslice";
import { fetchLikedBrandsById } from "../../Redux/Slices/likeSlice";
import { fetchViewBrandsById,  } from "../../Redux/Slices/viewSlice"; 
import StatCard from "./DashBoardFunctions/StatCard";
import ViewedBrands from "./DashBoardFunctions/ViewedBrands";
import LikedTab from "./DashBoardFunctions/LikedTab";
import AppliedTab from "./DashBoardFunctions/AppliedTab";
import ShortlistedTab from "./DashBoardFunctions/ShortlistedTab";

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
  const [itemsPerPage] = useState(10);
  const [isPaginating, setIsPaginating] = useState(false);

  const investorUUID = useSelector((state) => state.auth?.investorUUID);  
  const AccessToken = useSelector((state) => state.auth?.AccessToken);
  const shortListState = useSelector(state => state.shortList);
  const likedBrandsState = useSelector(state => state.likedBrands);
  const viewBrandsState = useSelector(state => state.viewBrands);

  const { brands: viewedBrands, pagination: viewPagination } = viewBrandsState;
  const shortlistedBrands = Array.isArray(shortListState.brands) ? shortListState.brands : [];
  const likedBrands = Array.isArray(likedBrandsState.brands) ? likedBrandsState.brands : [];

  const isLoading = likedBrandsState.isLoading || shortListState.isLoading || viewBrandsState.isLoading || isPaginating;
  const errorMessage = likedBrandsState.error || shortListState.error || viewBrandsState.error;

  const stats = useMemo(() => ({
    totalViews: viewPagination.totalItems || 0,
    totalLikes: likedBrandsState.pagination?.total || 0,
    totalApplications: appliedBrands.length,
    totalShortlisted: shortListState.pagination?.total || 0
  }), [viewPagination, likedBrandsState, appliedBrands, shortListState]);

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

      // Parallel requests
      const [appliedRes, userRes] = await Promise.all([
        axios.get(`${api.instantApplyApi.get.getInstaApplyById}/${investorUUID}`, config),
        axios.get(`${api.user.get.investor}/${investorUUID}`, config),
      ]);

      // Redux calls
      await Promise.all([
        dispatch(fetchLikedBrandsById({ userId: investorUUID, page: 1, limit: itemsPerPage })),
        dispatch(fetchShortListedById({ investorUUID, page: 1, limit: itemsPerPage })),
        dispatch(fetchViewBrandsById({ userId: investorUUID, page: 1, limit: 10 })),
      ]);

      console.log("✅ User First Name:", userRes.data?.data?.firstName);
      console.log("✅ Full User Object:", userRes.data?.data);

      setAppliedBrands(appliedRes.data?.data || []);
      setUserData(userRes.data?.data || null);

    } catch (error) {
      console.error("❌ Error in fetchData:", error);
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

  // toggleLike, toggleShortlist, toggleViewClose, handleViewDetails, handlePageChange 
  // remain same as your code, no need to duplicate them all again for space.

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
        return <ViewedBrands brands={viewedBrands} currentPage={viewPagination.currentPage} totalPages={viewPagination.totalPages} handlePageChange={() => {}} isLoading={viewBrandsState.isLoading} errorMessage={viewBrandsState.error} />;
      case 1:
        return <LikedTab items={likedBrands} currentPage={currentPage} totalPages={likedBrandsState.pagination?.totalPages || 1} handlePageChange={() => {}} likedStates={likedStates} shortlistedStates={shortlistedStates} onViewDetails={() => {}} onToggleLike={() => {}} onToggleShortlist={() => {}} isPaginating={isPaginating} />;
      case 2:
        return <AppliedTab items={appliedBrands} currentPage={currentPage} itemsPerPage={itemsPerPage} totalPages={Math.max(1, Math.ceil((appliedBrands?.length || 0) / itemsPerPage))} handlePageChange={() => {}} likedStates={likedStates} shortlistedStates={shortlistedStates} onViewDetails={() => {}} onToggleLike={() => {}} onToggleShortlist={() => {}} isPaginating={isPaginating} />;
      case 3:
        return <ShortlistedTab items={shortlistedBrands} currentPage={shortListState.pagination.currentPage} totalPages={shortListState.pagination.totalPages} handlePageChange={() => {}} likedStates={likedStates} shortlistedStates={shortlistedStates} onViewDetails={() => {}} onToggleLike={() => {}} onToggleShortlist={() => {}} isPaginating={isPaginating} isLoading={shortListState.isLoading} errorMessage={shortListState.error} />;
      default:
        return null;
    }
  }, [isLoading, errorMessage, tabValue, currentPage, itemsPerPage, viewedBrands, likedBrands, appliedBrands, shortlistedBrands, likedStates, shortlistedStates, isPaginating, viewPagination, shortListState, viewBrandsState, likedBrandsState.pagination]);

  return (
    <Box>
      {/* ✅ Fixed User Profile Section */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>
        {userData ? (
          <>
            <Avatar
              src={userData?.profileImage || img}
              loading="lazy"
              alt="Profile"
              sx={{
                width: 60,
                height: 60,
                mr: { md: 3 },
                border: "3px solid #689f38",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={600}>
                {userData?.firstName || "Investor"} {userData?.lastName || ""}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData?.inveterID || ""}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Loading profile...
          </Typography>
        )}
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, mt: 3, flexWrap: 'nowrap', overflowX: 'auto', pb: 1, position: 'relative', py: 2 }}>
        <StatCard icon={<Business />} title="Viewed" value={stats.totalViews} color="76, 175, 80" isSelected={tabValue === 0} onClick={() => setTabValue(0)} />
        <StatCard icon={<Favorite />} title="Liked" value={stats.totalLikes} color="244, 67, 54" isSelected={tabValue === 1} onClick={() => setTabValue(1)} />
        <StatCard icon={<AssignmentTurnedIn />} title="Applied" value={stats.totalApplications} color="33, 150, 243" isSelected={tabValue === 2} onClick={() => setTabValue(2)} />
        <StatCard icon={<Bookmark />} title="Shortlisted" value={stats.totalShortlisted} color="156, 39, 176" isSelected={tabValue === 3} onClick={() => setTabValue(3)} />
        <Divider sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderColor: 'divider' }} />
      </Box>

      {/* Remove Message */}
      <Box sx={{ p: 3 }}>
        {removeMsg && (
          <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: '#4caf50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
