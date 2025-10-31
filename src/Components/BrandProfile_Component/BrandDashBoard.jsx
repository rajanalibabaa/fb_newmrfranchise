// BrandDashboard.js
import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import BrandHeader from "./BrandDashboardController/BrandDashboardFiles/BrandHeader";
import DashboardTabs from "./BrandDashboardController/BrandDashboardFiles/DashboardTabs";
import TabContent from "./BrandDashboardController/BrandDashboardFiles/TabContent";
import LeadDetailDialog from "./BrandDashboardController/BrandDashboardFiles/LeadDetailDialog";

const API_BASE_URL = "http://localhost:5000/api/v1";

const BrandDashboard = ({ selectedSection, sectionContent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [brandData, setBrandData] = useState({});
  const [applyData, setApplyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Leads, setLeads] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const brandUUID = useSelector((state) => state.auth.brandUUID);
  const token = useSelector((state) => state.auth.AccessToken);

  const fetchData = async () => {
    if (!brandUUID || !token) return;
    
    try {
      setLoading(true);
      setError(null);

      const brandApiCall = axios.get(`${API_BASE_URL}/brandlisting/getBrandById/${brandUUID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const applyApiCall = axios.get(
        `${API_BASE_URL}/instantapply/getInstantApplyLocationLeadControllerById/${brandUUID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const leadsApiCall = axios.get(
        `${API_BASE_URL}/instantapply/leads/brand-all-industries/${brandUUID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const [brandRes, applyRes, leadsRes] = await Promise.allSettled([brandApiCall, applyApiCall, leadsApiCall]);

      if (brandRes.status === 'fulfilled' && brandRes.value.data?.success) {
        setBrandData(brandRes.value.data.data || {});
      } else {
        console.warn('Brand data fetch failed');
        setBrandData({});
      }

      if (applyRes.status === 'fulfilled' && applyRes.value.data?.success) {
        setApplyData(applyRes.value.data.data || []);
      } else {
        console.warn('Apply data fetch failed');
        setApplyData([]);
      }

      if (leadsRes.status === 'fulfilled') {
        const leadsResponse = leadsRes.value.data;
        if (leadsResponse?.data?.data && Array.isArray(leadsResponse.data.data)) {
          setLeads(leadsResponse.data.data);
        } else if (leadsResponse?.data && Array.isArray(leadsResponse.data)) {
          setLeads(leadsResponse.data);
        } else if (leadsResponse?.success && Array.isArray(leadsResponse.data)) {
          setLeads(leadsResponse.data);
        } else {
          setLeads([]);
        }
      } else {
        setLeads([]);
      }

    } catch (err) {
      console.error('Unexpected error in fetchData:', err);
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [brandUUID, token]);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
  };

  if (selectedSection) {
    return sectionContent[selectedSection];
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", pb: 4 }}>
      <Box sx={{ px: isMobile ? 1 : 3, maxWidth: 1400, mx: "auto", p: 3 }}>
        <BrandHeader brandData={brandData} />
        <DashboardTabs
          brandData={brandData}
          Leads={Leads}
          loading={loading}
          error={error}
          onRetry={fetchData}
          onViewDetails={handleViewDetails}
        />
        
        <LeadDetailDialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          selectedItem={selectedItem}
        />
      </Box>
    </Box>
  );
};

export default BrandDashboard;