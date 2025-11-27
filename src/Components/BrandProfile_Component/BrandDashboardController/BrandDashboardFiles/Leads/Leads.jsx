import { useEffect, useState } from "react";
import { useLocation,  } from "react-router-dom";

import { Box, Typography, CircularProgress } from "@mui/material";
import { GetApiCall } from "../../../../../Api/DefaultApi";
import { api } from "../../../../../Api/api";
import PackageCard from "../../../../../ui/cards/PackageCard"
import LeadsTableOutlet from "../../../../../ui/tables/LeadsTableOutlet"


const Leads = () => {
   const { search } = useLocation();

  const query = new URLSearchParams(search);

  const id = query.get("id");

  const [brandPackage, setBrandPackage] = useState(null);
  const [leads, setLeads] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {

    (async () => {
      try {
        const res = await GetApiCall(
          `${api.allBrandsApi.get.getBrandByID}/${id}`,
          { paymentHistory: true }
        );

        const responseData = res?.data;
        console.log("responseData :",responseData)
        setBrandPackage(responseData?.data || null);

        if (responseData?.statuscode === 200) {
          const res2 = await GetApiCall(
            `${api.allBrandsApi.get.getleadsbybrandid}/${id}`,
            {
              packageStartDate:
                responseData?.data?.activePackage?.packageUpdatedTime,
            }
          );

          if (res2?.data?.statuscode === 200) {
            setLeads(res2?.data?.data.leads);
            setPagination(res2?.data?.data.pagination);
            setHasMore(true);
          }
        }
      } catch (error) {
        console.error("Error fetching brand:", error);
      }
    })();
  }, [id,]);

  if (!brandPackage)
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  const handlePackageClick = async (pkg) => {
    setSelectedPackage(pkg);

    let queryParams = {};
    if (pkg.packageType === "free") {
      queryParams = {
        status: pkg?.isActive,
        leadType: pkg?.packageType,
      };
    } else {
      queryParams = {
        packageStartDate: pkg?.packageUpdatedTime || pkg.packageStartTime,
        status: pkg?.isActive,
        leadType: "paid",
      };
    }

    const res2 = await GetApiCall(
      `${api.allBrandsApi.get.getleadsbybrandid}/${id}`,
      queryParams
    );

    if (res2?.data?.statuscode === 200) {
      setLeads(res2?.data?.data?.leads);
      setPagination(res2?.data?.data?.pagination);
      setHasMore(true);
    }
  };

  const loadMore = async () => {
    if (!pagination) return;

    const nextPage = pagination.currentPage + 1;

    if (nextPage >= pagination.totalPages) {
      setHasMore(false);
      return;
    }

    let queryParams = {
      page: nextPage,
      limit: pagination.pageSize,
    };

    if (selectedPackage) {
      if (selectedPackage?.packageType === "free") {
        queryParams.status = selectedPackage?.isActive;
        queryParams.leadType = "free";
      } else {
        queryParams.packageStartDate =
          selectedPackage?.packageUpdatedTime ||
          selectedPackage?.packageStartTime;
        queryParams.status = selectedPackage?.isActive;
        queryParams.leadType = "paid";
      }
    }

    try {
      const res = await GetApiCall(
        `${api.allBrandsApi.get.getleadsbybrandid}/${id}`,
        queryParams
      );

      if (res?.data?.statuscode === 200) {
        setLeads((prev) => [...prev, ...res.data.data.leads]);
        setPagination(res.data.data.pagination);
      }
    } catch (e) {
      console.error("LoadMore Error:", e);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="600" mb={2}>
        Packages
      </Typography>

      <Box
        display="flex"
        gap={2}
        sx={{
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { background: "#ccc", borderRadius: 2 },
        }}
      >
        {brandPackage?.activePackage && (
          <Box
            sx={{
              cursor: "pointer",
              border:
                selectedPackage === brandPackage?.activePackage
                  ? "2px solid #08612c"
                  : "2px solid transparent",
              borderRadius: 2,
            }}
            onClick={() => handlePackageClick(brandPackage.activePackage)}
          >
            <PackageCard
              data={brandPackage.activePackage}
              background="#08612cff"
              color="white"
            />
          </Box>
        )}

        {brandPackage?.oldPackageHistory?.length > 0 &&
          brandPackage?.oldPackageHistory.map((pkg, i) => (
            <Box
              key={i}
              sx={{
                cursor: "pointer",
                border:
                  selectedPackage === pkg
                    ? "2px solid #08612c"
                    : "2px solid transparent",
                borderRadius: 2,
              }}
              onClick={() => handlePackageClick(pkg)}
            >
              <PackageCard data={pkg} />
            </Box>
          ))}
      </Box>

      <Box mt={4}>
        {Array.isArray(leads) && leads.length > 0 ? (
          <LeadsTableOutlet
            leads={leads}
            pagination={pagination}
            loadMore={loadMore}
            hasMore={hasMore}
          />
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            mt={3}
          >
            No leads found
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Leads;
