import React from "react";
import { Container } from "@mui/material";
import CreateRequestForm from "./CreateRequestForm";
import RequestList from "./RequestList";

const Dashboard = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CreateRequestForm />
      <RequestList />
    </Container>
  );
};

export default Dashboard;
