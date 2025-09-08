

import React, { useRef, Suspense } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  Slide,
  Skeleton,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Direct (eager) import for critical info
import FranchiseDetailsTable from "./OverTabHandlings.jsx/FranchiseDetailsOverView.jsx";
import BrandDescription from "./OverTabHandlings.jsx/BrandDescriptionsOverView.jsx";
import SupportProvided from "./OverTabHandlings.jsx/SupportProvidedOverView.jsx";

// Lazy loading heavy/offscreen/large sections
const ExpansionLocationGrid = React.lazy(() => import("./OverTabHandlings.jsx/BrandOverViewExpansionLocationDomestic.jsx"));
const ExpansionLocationGridInternational = React.lazy(() => import("./OverTabHandlings.jsx/BrandExpansionLOcationOverviewInternational.jsx"));
const DescriptionIcon = React.lazy(() => import("@mui/icons-material/Description"));

/** Helper: Lightweight skeleton, fallback for Suspense. */
function SectionSkeleton({ lines = 1, height = 28 }) {
  return (
    <Box>
      {[...Array(lines)].map((_, idx) => (
        <Skeleton key={idx} height={height} sx={{ my: 0.5 }} />
      ))}
    </Box>
  );
}

// Lazy-load section that only mounts when scrolled to
function LazyInViewSection({ children, fallback, minHeight = 120, ...props }) {
  const ref = useRef();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "160px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <Box ref={ref} sx={{ minHeight, width: "100%" }} {...props}>
      {visible ? children : fallback || <SectionSkeleton height={minHeight / 3} />}
    </Box>
  );
}

const OverviewTab = ({ brand }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const overviewRef = useRef(null);

  const formatCurrency = (value) => {
    const number = Number(value);
    return isNaN(number) ? "N/A" : `₹${number.toLocaleString("en-IN")}`;
  };

  const hasData = (sectionData) => {
    if (Array.isArray(sectionData)) {
      return sectionData.length > 0;
    }
    return !!sectionData;
  };

  const franchiseDetails = brand?.[0]?.brandfranchisedetails?.franchiseDetails || {};
  const expansionLocationData = brand?.[0]?.brandexpansionlocationdatas || {};
  const uploads = brand?.[0]?.uploads || {};

  return (
    <Box ref={overviewRef}>
      {/* Franchise Details: Render instantly */}
      {hasData(franchiseDetails.fico) && (
        <FranchiseDetailsTable
          ficoDetails={franchiseDetails.fico}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Brand Description: Render instantly */}
      {franchiseDetails.brandDescription && (
        <BrandDescription
          brandDescription={franchiseDetails.brandDescription}
          uniqueSellingPoints={franchiseDetails.uniqueSellingPoints}
        />
      )}

      {/* Support Provided: Render instantly */}
      {(hasData(franchiseDetails.trainingSupport) ||
        franchiseDetails.aidFinancing ||
        hasData(franchiseDetails.uniqueSellingPoints)) && (
        <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
          <Grid item xs={12} md={6}>
            <SupportProvided
              trainingSupport={franchiseDetails.trainingSupport}
              aidFinancing={franchiseDetails.aidFinancing}
              isInternationalExpansion={franchiseDetails.isInternationalExpansion}
            />
          </Grid>
        </Grid>
      )}

     <Box display={{ sm: 'none', md: 'flex', }} >
       {/* OUTLET GRIDS: Lazy-load (domestic, international) */}
      {hasData(expansionLocationData.currentOutletLocations?.domestic?.locations) && (
        <LazyInViewSection minHeight={180}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Current Outlets (India)
          </Typography>
          <Suspense fallback={<SectionSkeleton lines={2} height={36} />}>
            <ExpansionLocationGrid
              data={expansionLocationData.currentOutletLocations.domestic}
            />
          </Suspense>
        </LazyInViewSection>
      )}

       {hasData(expansionLocationData.expansionLocations?.domestic?.locations) && (
        <LazyInViewSection minHeight={180}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }} id="expansion-location">
            Expansion Locations (India)
          </Typography>
          <Suspense fallback={<SectionSkeleton lines={2} height={36} />}>
            <ExpansionLocationGrid data={expansionLocationData.expansionLocations.domestic} />
          </Suspense>
        </LazyInViewSection>
      )}
     </Box>

      {hasData(expansionLocationData.currentOutletLocations?.international?.country) && (
        <LazyInViewSection minHeight={160}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Current Outlets (International)
          </Typography>
          <Suspense fallback={<SectionSkeleton lines={2} height={36} />}>
            <ExpansionLocationGridInternational
              data={expansionLocationData.currentOutletLocations.international}
            />
          </Suspense>
        </LazyInViewSection>
      )}

     

      {hasData(expansionLocationData.expansionLocations?.international?.country) && (
        <LazyInViewSection minHeight={160}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Expansion Locations (International)
          </Typography>
          <Suspense fallback={<SectionSkeleton lines={2} height={36} />}>
            <ExpansionLocationGridInternational
              data={expansionLocationData.expansionLocations.international}
            />
          </Suspense>
        </LazyInViewSection>
      )}

      {/* Awards: Lazy-load only when scrolled into view. */}
      {hasData(uploads.awards) && (
        <LazyInViewSection minHeight={120}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4, color: "#7ad03a" }}>
            Awards
          </Typography>
          {uploads.awards.length ? (
            <Grid container spacing={2}>
              {uploads.awards.map((award, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Slide direction="up" in={true} timeout={idx * 200}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 2,
                        p: 2,
                        borderRadius: "12px",
                        background: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      {award.awardImage ? (
                        <img
                          src={award.awardImage}
                          loading="lazy"
                          alt={`Award ${idx + 1}`}
                          style={{
                            width: "100%",
                            maxWidth: 180,
                            height: 120,
                            borderRadius: 8,
                            marginBottom: 12,
                            objectFit: "cover",
                            background: "#f0f0f0",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            maxWidth: 180,
                            height: 120,
                            borderRadius: 2,
                            background: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            No Image
                          </Typography>
                        </Box>
                      )}
                      <Typography variant="body2" align="center" sx={{ color: "#212121" }}>
                        {award.awardDescription || "No Description"}
                      </Typography>
                    </Box>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No awards available.
            </Typography>
          )}
        </LazyInViewSection>
      )}

      {/* Business Plan Documentation: Lazy-loaded */}
      {hasData(uploads.businessPlan) && (
        <LazyInViewSection minHeight={120}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4, color: "#7ad03a" }}>
            Business Plan Documentation
          </Typography>
          <Grid container spacing={2}>
            {uploads.businessPlan.map((doc, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Slide direction="up" in={true} timeout={idx * 200}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 2,
                      p: 2,
                      borderRadius: "12px",
                      background: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Suspense fallback={<SectionSkeleton height={60} />}>
                      <DescriptionIcon
                        sx={{
                          fontSize: 60,
                          color: "#3f51b5",
                          mb: 1,
                        }}
                      />
                    </Suspense>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{
                        color: "#212121",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {doc.title || "Business Document"}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#ff9800",
                        color: "white",
                        mt: 1,
                      }}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </Button>
                  </Box>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </LazyInViewSection>
      )}

      {/* Disclaimer: Instantly rendered */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: "12px",
          bgcolor: "rgba(244, 67, 54, 0.05)",
        }}
      >
        <Typography variant="body1" fontWeight={700} color="#f44336">
          Disclaimer:
        </Typography>
        {!isMobile ? (
          <Typography variant="caption" color="#212121">
            Mr Franchise and the site sponsors accept no liability for the
            accuracy of any information contained on this site or on other
            linked sites. We recommend you take advice from a lawyer,
            accountant and franchise consultant experienced in franchising
            before you commit yourself. It is user's responsibility to satisfy
            yourself as to the accuracy and reliability of the information
            supplied. Please read the terms & conditions on MrFranchise.in
          </Typography>
        ) : (
          <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', minWidth: '300px', py: 1 }}>
            <Typography variant="caption" color="#212121">
              Mr Franchise and the site sponsors accept no liability for the
              accuracy of any information contained on this site or on other
              linked sites. We recommend you take advice from a lawyer,
              accountant and franchise consultant experienced in franchising
              before you commit yourself. It is user's responsibility to satisfy
              yourself as to the accuracy and reliability of the information
              supplied. Please read the terms & conditions on MrFranchise.in
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(OverviewTab);
