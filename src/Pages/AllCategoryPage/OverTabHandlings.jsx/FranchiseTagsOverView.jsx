import React from "react";
import { Box, Typography, Divider, Chip } from "@mui/material";

const FranchiseTagsOverView = ({ serviceTags }) => {
  if (!Array.isArray(serviceTags) || serviceTags.length === 0) return null;

  console.log("serviceTags", serviceTags);

  return (
    <Box
      sx={{
        mt: 3,
        borderRadius: 2,
        width: "100%",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 2, color: "#7ad03a" }}
      >
        Service Tags
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* TABLE STYLE LAYOUT */}
      <Box
        sx={{
          display: "table",
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        {serviceTags.map((item, index) => {
          const tags = Array.isArray(item?.tags) ? item.tags : [];
          if (tags.length === 0) return null;

          return (
            <Box
              key={item._id || index}
              sx={{
                display: "table-row",
                borderBottom:
                  index !== serviceTags.length - 1
                    ? "1px solid #e0e0e0"
                    : "none",
              }}
            >
              {/* LEFT COLUMN – PARENT */}
              <Box
                sx={{
                  display: "table-cell",
                  width: { xs: "35%", sm: "30%", md: "25%" },
                  verticalAlign: "top",
                  py: 1,
                  px: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#333",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    textTransform: "capitalize",
                  }}
                >
                  {item.parent}
                </Typography>
              </Box>

              {/* RIGHT COLUMN – TAGS */}
              <Box
                sx={{
                  display: "table-cell",
                  width: { xs: "65%", sm: "70%", md: "75%" },
                  verticalAlign: "top",
                  py: 1,
                  px: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.8,
                  }}
                >
                  {tags.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: "24px",
                        backgroundColor: "#f8f9fa",
                        borderColor: "#7AD03A",
                        color: "black",
                        "& .MuiChip-label": {
                          padding: "0 8px",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default FranchiseTagsOverView;
