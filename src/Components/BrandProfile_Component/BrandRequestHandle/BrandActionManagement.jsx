import React from "react";
import  Container  from "@mui/material/Container";
import CreateRequestForm from "./CreateRequestForm";
import RequestList from "./RequestList.jsx";

const Dashboard = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CreateRequestForm />
      <RequestList />
    </Container>
  );
};

export default Dashboard;
