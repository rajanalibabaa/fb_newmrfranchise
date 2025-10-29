import React from 'react';
import { Box, Typography, Divider, Grid, Chip } from '@mui/material';

const FranchiseTagsOverView = ({ franchiseTagsDetails }) => {
  if (!franchiseTagsDetails) return null;

  const tagSections = [
        { key: 'PrimaryClassifications', label: 'Primary Classifications' },
    { key: 'ProductServiceTypes', label: 'Product & Service Types' },
    { key: 'TargetAudience', label: 'Target Audience' },
    { key: 'ServiceModel', label: 'Service Model' },
    { key: 'PricingValue', label: 'Pricing & Value' },
    { key: 'AmbienceExperience', label: 'Ambience & Experience' },
    { key: 'FeaturesAmenities', label: 'Features & Amenities' },
    { key: 'TechnologyIntegration', label: 'Technology Integration' },
    { key: 'BusinessOperations', label: 'Business Operations' },
    { key: 'SustainabilityEthics', label: 'Sustainability & Ethics' },
  ];

  return (
    <Box
      sx={{
        mt: 3,
        borderRadius: 2,
        // boxShadow: 1,
        // bgcolor: '#fff',
        width: '100%',
      }}
    >
      <Typography
        variant="h6" fontWeight={700} sx={{ mb: 2, color: "#7ad03a" }}
      >
        Brand Overview Tags
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: 'table',
          width: '100%',
          borderCollapse: 'collapse',

        }}
      >
        {tagSections.map((section, index) => {
          const items = franchiseTagsDetails[section.key] || [];
          if (!items || items.length === 0) return null;

          return (
            <Box
              key={section.key}
              sx={{
                display: 'table-row',
                borderBottom:
                  index !== tagSections.length - 1 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              {/* Left column - Label */}
              <Box
                sx={{
                  display: 'table-cell',
                  width: { xs: '30%', sm: '30%', md: '25%' },
                  verticalAlign: 'top',
                  py: 0.8,
                  px: 1,
                  textAlign: { xs: 'left', sm: 'left' },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#333',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                  }}
                >
                  {section.label} 
                </Typography>
              </Box>
:
              {/* Right column - Tags */}
              <Box
                sx={{
                  display: 'table-cell',
                  width: { xs: '60%', sm: '70%', md: '75%' },
                  verticalAlign: 'top',
                  py: 0.8,
                  px: 1,
                  textAlign: { xs: 'left', sm: 'left' },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.8,
                  }}
                >
                  {items.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag}
                       size="small"
                  variant="outlined"
                  sx={{
                    // fontSize: isMobile ? "0.65rem" : "0.75rem",
                    height: "24px",
                    backgroundColor: "#f8f9fa",
                    borderColor: "#7AD03A",
                    color: "black",
                    "& .MuiChip-label": {
                      padding: "0 8px",
                      whiteSpace: "nowrap",
                    }
                  }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
            <Divider sx={{ mb: 2 }} />

    </Box>
  );
};

export default FranchiseTagsOverView;
