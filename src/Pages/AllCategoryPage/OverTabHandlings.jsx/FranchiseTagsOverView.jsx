import React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';

const FranchiseTagsOverView = ({ franchiseTagsDetails }) => {
  if (!franchiseTagsDetails) return null;

  const tagSections = [
    { key: 'AmbienceExperience', label: 'Ambience & Experience' },
    { key: 'BusinessOperations', label: 'Business Operations' },
    { key: 'FeaturesAmenities', label: 'Features & Amenities' },
    { key: 'PricingValue', label: 'Pricing & Value' },
    { key: 'PrimaryClassifications', label: 'Primary Classifications' },
    { key: 'ProductServiceTypes', label: 'Product & Service Types' },
    { key: 'ServiceModel', label: 'Service Model' },
    { key: 'SustainabilityEthics', label: 'Sustainability & Ethics' },
    { key: 'TargetAudience', label: 'Target Audience' },
    { key: 'TechnologyIntegration', label: 'Technology Integration' },
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
          const items = franchiseTagsDetails[section.key];
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
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        borderRadius: 1,
                        px: 1,
                        py: 0.3,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tag}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default FranchiseTagsOverView;
