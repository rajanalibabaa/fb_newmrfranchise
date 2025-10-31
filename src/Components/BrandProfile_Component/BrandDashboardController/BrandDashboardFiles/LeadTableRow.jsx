// components/LeadTableRow.js
import React from "react";
import { TableRow, TableCell, Button } from "@mui/material";

const LeadTableRow = ({ lead, index, isMobile, isTablet, onViewDetails }) => {
  return (
    <TableRow key={lead.uuid || lead._id || index}>
      <TableCell>{lead.fullName || "Unknown"}</TableCell>
      {!isMobile && <TableCell>{lead.investorMobileNumber || "N/A"}</TableCell>}
      <TableCell>
        {[lead.state, lead.district].filter(Boolean).join(", ") || "N/A"}
      </TableCell>
      {!isTablet && <TableCell>{lead.category || lead.subCategory || "N/A"}</TableCell>}
      {!isTablet && <TableCell>{lead.investmentRange || "N/A"}</TableCell>}
      <TableCell align="right">
        <Button
          onClick={() => onViewDetails(lead)}
          variant="outlined"
          size="small"
          sx={{
            color: "black",
            backgroundColor: "success.light",
            "&:hover": {
              backgroundColor: "success.light",
            },
          }}
        >
          Details
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default LeadTableRow;