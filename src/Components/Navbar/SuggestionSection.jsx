import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const SuggestionSection = ({ title, items = [], labelKey,handleSelectedSuggestionData  }) => {
  if (!items.length) return null;

 
  return (
    <>
    <Box
      sx={{ mt: 1,px:2}}
    >

   
      <Typography
        variant="caption"
        sx={{ px: 2, pt: 1, fontWeight: 600 ,color:"#f79f24ff",fontSize:"1rem"}}
      >
        {title}
      </Typography>

      {items.map((item, index) => (
        <ListItem
          key={`${title}-${index}`}
          button
          onClick={() => handleSelectedSuggestionData(item)}
        >
          {item.logo && (
            <ListItemAvatar>
              <Avatar src={item.logo} alt={item[labelKey]} />
            </ListItemAvatar>
          )}
          <ListItemText primary={item[labelKey]} />
        </ListItem>
      ))}

      <Divider />
       </Box>
    </>
  );
};

export default SuggestionSection;
