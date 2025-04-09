import { Box, Typography } from "@mui/material";
import React from "react";
import logo from "../assets/Lord_V_Services.svg";
import "./styles.css";

const HomePage: React.FC = () => {
  return (
    <Box className="box-container">
      <Typography variant="h4" >
        Welcome to <span className="brown-text">Lord V Services Pvt. Ltd.</span>
      </Typography>

      <img src={logo} alt="Logo" className="logo" />

      <Typography >Innovative Solutions for Optimal Operations
      </Typography>
    </Box>
  );
};

export default HomePage;
