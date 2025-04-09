import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid2 from "@mui/material/Grid2";
import "./styles.css";

interface TdsData {
  name: string;
  rate: number;
}

// Define the expected user data structure
interface User {
  id: string;
  email: string;
  role: string; // Ensure the role is available
}

const AddTds: React.FC = () => {
  const [tdsData, setTdsData] = useState<TdsData>({ name: "", rate: 0 });
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Get user data from localStorage
    const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  
    useEffect(() => {
      if (!user || user.role !== "Super Admin") {
        navigate("/");
      }
      else {
        setLoading(false); // Show content only if user is super_admin
      }
    }, [user, navigate]);
   
  

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTdsData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation check
    if (!tdsData.name || !tdsData.rate) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setError(""); // Clear previous errors
      const response = await axios.post(`${API_BASE_URL}/tds/add-tds`, tdsData,
        {
          headers: {
              Authorization: `Bearer ${token}`,  // Send token in headers
          }
        }  
      );
      if (response.status === 201) { // Adjust status code based on your backend
        setSuccessMessage("TDS added successfully!");
        setOpenSnackbar(true);
        navigate("/tds-list");
      }
      
      // Reset the form
      setTdsData({ name: "", rate:0 });
    } catch (error) {
      console.error("Error adding TDS:", error);
      setError("Failed to add TDS. Please try again.");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box  className="box-container">
       {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
      <Paper elevation={3} className="paper-container">
      <Typography variant="h6" className="typography">
        Add TDS
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit} className="form-container">
      <Grid2 container spacing={2} >
      <Grid2 size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="name"
          label="TDS Section"
          value={tdsData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="rate"
          label="TDS Rate"
          value={tdsData.rate}
          onChange={handleChange}
          margin="normal"
          required
        />
           </Grid2>
           </Grid2>
        
        <Box className="button-box">
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
        </Box>
      </form>
      
      </Paper>)}
      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </Box>
  );
};

export default AddTds;
