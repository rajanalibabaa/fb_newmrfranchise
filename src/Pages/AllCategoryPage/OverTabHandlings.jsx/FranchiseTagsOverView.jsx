// import React from "react";
// import { Box, Typography, Divider, Chip } from "@mui/material";

// const FranchiseTagsOverView = ({ serviceTags }) => {
//   if (!Array.isArray(serviceTags) || serviceTags.length === 0) return null;

//   console.log("serviceTags", serviceTags);

//   return (
//     <Box
//       sx={{
//         mt: 3,
//         borderRadius: 2,
//         width: "100%",
//       }}
//     >
//       <Typography
//         variant="h6"
//         fontWeight={700}
//         sx={{ mb: 2, color: "#7ad03a" }}
//       >
//          Tags
//       </Typography>

//       <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 1)" }} />

//       {/* TABLE STYLE LAYOUT */}
//       <Box
//         sx={{
//           // display: "table",
//           width: "100%",
//           // border: "3px solid #7ad03a",
//           // borderRadius: ,
//           // borderCollapse: "collapse",

//         }}
//       >
//         {serviceTags.map((item, index) => {
//           const tags = Array.isArray(item?.tags) ? item.tags : [];
//           if (tags.length === 0) return null;

//           return (
//             <Box
//               key={item._id || index}
//               sx={{
//                 display: "table-row",

//               }}
//             >
//               {/* LEFT COLUMN – PARENT */}
//               <Box
//                 sx={{
//                   display: "table-cell",
//                   width: { xs: "35%", sm: "30%", md: "25%" },
//                   verticalAlign: "top",
//                   py: 1,
//                   px: 4,
// background: `linear-gradient(to right,
//   #ffffff 0%,
//   #ffffff calc(100% - 18px),
//   #ff9800 calc(100% - 18px),
//   #ff9800 calc(100% - 9px),
//   #26d023ff calc(100% - 18px),
//   #26d023ff 100%
// )`,

//                 }}
//               >
//                 <Typography
//                   variant="body"
//                   sx={{
//                     fontWeight: 600,
//                     color: "#000000ff",
//                     // fontSize: "0.75rem",
//                     lineHeight: 1,
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   {item.parent}
//                 </Typography>
//               </Box>

//               {/* RIGHT COLUMN – TAGS */}
//               <Box
//                 sx={{
//                   display: "table-cell",
//                   width: { xs: "65%", sm: "70%", md: "75%" },
//                   verticalAlign: "top",
//                   py: 1,
//                   px: 1,
//                   backgroundColor: "#ffffffff",
//                    // borderBottom:
//                 //   index !== serviceTags.length - 1
//                 //     ? "1px solid #ffffffff"
//                 //     : "none",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: 0.8,
//                   }}
//                 >
//                   {tags.map((tag, i) => (
//                     <Chip
//                       key={i}
//                       label={tag}
//                       size="small"
//                       variant="outlined"
//                       sx={{
//                         height: "24px",
//                         backgroundColor: "#f8f9fa",
//                         // borderColor: "#7AD03A",
//                         color: "black",
//                         "& .MuiChip-label": {
//                           padding: "0 8px",
//                           whiteSpace: "nowrap",
//                         },
//                       }}
//                     />
//                   ))}
//                 </Box>
//               </Box>
//             </Box>
//           );
//         })}
//       </Box>

//       <Divider sx={{ mt: 2 }} />
//     </Box>
//   );
// };

// export default FranchiseTagsOverView;
import React from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const FranchiseTagsOverView = ({ serviceTags }) => {
  if (!Array.isArray(serviceTags) || serviceTags.length === 0) return null;

  console.log("serviceTags", serviceTags);

  return (
    <Box
      sx={{
        mb: 2,
        borderRadius: 2,
        width: "100%",
      }}
    >
      {/* <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 1.5, color: "#7ad03a" }}
      >
        Tags
      </Typography>
 <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#000000ff",background:'#eaf6df',padding:'10px',borderRadius:'5px' }}>
        Tags
      </Typography> */}
      {/* <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 1)" }} /> */}

      {/* PROPER TABLE COMPONENT */}
      <Box
        // component={Paper}
        sx={{
          // border: "3px solid #7ad03a",
          borderRadius: 4,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box sx={{ minWidth: 650 }}>
          <Box>
            {serviceTags.map((item, index) => {
              const tags = Array.isArray(item?.tags) ? item.tags : [];
              if (tags.length === 0) return null;

              return (
                <Box
                  key={item._id || index}
                  sx={{
                    "&:last-child td, &:last-child th": { borderBottom: 0 },
                    backgroundColor: index % 2 === 0 ? "#eedbbcff" : "#eaf6df",
                    "&:hover": {
                      // backgroundColor: "#f0f8ff",
                      cursor: "pointer",
                    },
                    display: "flex",
                  }}
                >
                  {/* LEFT CELL - PARENT/CATEGORY */}
                  <Box
                    sx={{
                      width: { xs: "35%", sm: "30%", md: "25%" },
                      py: 2,
                      px: 3,

                      // backgroundColor: "#ffffff",
                      border: "none",
                      // borderLeft: "2px solid #26d023", // left accent border
                      borderRight: "1px solid #e0e0e0",

                      fontWeight: 600,
                      color: "#000000",
                      textTransform: "capitalize",
                      verticalAlign: "top",
                    }}
                  >
                    <Box
                      size="small"
                      variant="outlined"
                      sx={{
                        height: "38px",
                        backgroundColor: "white",
                        border: "none", // remove default border
                        borderLeft: "5px solid #7ad03a", // left border only
                        borderRadius: "4px", // box shape
                        color: "#000000ff",
                        fontWeight: 500,
                        alignContent: "center",
                        pl: 2,

                        "&:hover": {
                          backgroundColor: "#ffffffff",
                          color: "#000000ff",
                          borderLeft: "2px solid #5fb52a",
                        },

                        "& .MuiChip-label": {
                          padding: "0 10px",
                          whiteSpace: "nowrap",
                          fontSize: "0.8125rem",
                        },
                      }}
                    >
                      {" "}
                      {item.parent}
                    </Box>
                  </Box>

                  {/* RIGHT CELL - TAGS */}
                  <Box
                    sx={{
                      width: { xs: "65%", sm: "70%", md: "75%" },
                      py: 2,
                      px: 3,
                      verticalAlign: "top",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      {tags.map((tag, i) => (
                        <Chip
                          key={i}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: "38px",
                            backgroundColor: "#ffffffff",
                            border: "none", // remove default border
                            borderLeft: "5px solid #ff9800", // left border only
                            borderRadius: "4px", // box shape
                            color: "#000000ff",
                            fontWeight: 500,

                            "&:hover": {
                              backgroundColor: "#fff3e0",
                              color: "#333333",
                              borderLeft: "2px solid #ff9800",
                            },

                            "& .MuiChip-label": {
                              padding: "0 10px",
                              whiteSpace: "nowrap",
                              fontSize: "0.8125rem",
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
        </Box>
      </Box>

      {/* <Divider sx={{ mt: 2 }} /> */}
    </Box>
  );
};

export default FranchiseTagsOverView;
