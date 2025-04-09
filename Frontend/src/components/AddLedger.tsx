import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,

  Snackbar,
 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid2 from "@mui/material/Grid2";
import "./styles.css";
import { useFormik } from "formik";
import { validationSchema } from "../validations/ledgerValidation";

interface SubLedger {
  subLedger: string;
}

// Define the expected user data structure////
interface User {
  id: string;
  email: string;
  role: string; // Ensure the role is available
}

const AddLedger: React.FC = () => {
  const [subledger, setSubledger] = useState<string>("");

  const [selectedSubLedger, setSelectedSubLedger] = useState<SubLedger[]>([]);

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
   
  

  


  const formik=useFormik({
    initialValues:{
      ledgername: "",
    },
    validationSchema:validationSchema,
    onSubmit:async (values,{setSubmitting,resetForm}) => {
  
      const dataToSubmit = {
        ...values,
        subLedger: selectedSubLedger, // Include selected subledger in the submission
      };
  
      try {
        setError(""); // Clear previous errors
        const response = await axios.post(
          `${API_BASE_URL}/ledger/add-ledger`,
          dataToSubmit,
          {
            headers: {
                Authorization: `Bearer ${token}`,  // Send token in headers
            }
          }  
        );
        if (response.status === 201) {
          setSuccessMessage("Ledger added successfully!");
          setOpenSnackbar(true);
          navigate("/ledger-list");
        }
  
        // Reset the form
        resetForm();
        setSelectedSubLedger([]);
      } catch (error) {
        console.error("Error adding Ledger:", error);
        setError("Failed to add Ledger. Please try again.");
      }finally {
        setSubmitting(false);
      }
    }
  })





  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubledgerChange = async () => {
    if (subledger.trim() !== "") {
      // Add the new sub-ledger to the selectedSubLedger array
      setSelectedSubLedger((prev) => [...prev, { subLedger: subledger }]);
        setSubledger( "");
      }
  };

  return (
    <Box className="box-container">
       {loading ? (
      <Typography>Loading...</Typography>
    ) : (
       <Paper elevation={3} className="paper-container">
      <Typography variant="h6" className="typography">
        Add Ledger
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit} className="form-container">
      <Grid2 container spacing={2} >
      <Grid2 size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="ledgername"
          label="Ledger Name"
          value={formik.values.ledgername}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.ledgername && Boolean(formik.errors.ledgername)}
          helperText={formik.touched.ledgername && formik.errors.ledgername}
          required
        />
        </Grid2>
        </Grid2>
        <Box>
                      <Paper elevation={4} style={{ padding: "16px", marginTop: "16px"}}>
                        <Typography variant="h6" align="center" marginBottom={2}>Add Sub Ledger</Typography>
                        <Grid2 container  columnSpacing={1} alignItems="center">
                        <Grid2 size={{ xs: 12, md: 6}}>
        
                                <TextField
                                  fullWidth
                                  name="subLedger"
                                  label="Sub-Ledger Name"
                                  value={subledger}
                                  onChange={(e) => setSubledger(e.target.value)}
                                  
                                />
                                </Grid2>
                                <Grid2 size={{ xs: 12, md: 6}} sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button
                                variant="contained"
                                color="secondary"
                               
                                onClick={handleSubledgerChange}
                            
                              >
                                Add Sub Ledger
                              </Button>
                              </Grid2>
                            </Grid2>
                            
                      </Paper>
                    </Box>
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table sx={{ width: "100%" }} aria-label="accounts table">
                        
                        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                          <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>Sub Ledger</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedSubLedger.map((subled, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{subled.subLedger}</TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  
                                  style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    fontSize: "12px",
                                    padding: "6px 8px",
                                    minWidth: "5px",
                                    height: "36px",
                                  }}
                                  onClick={() => setSelectedSubLedger((prev) => prev.filter((_, i) => i !== index))}
                                >
                                  X
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
        
          
         

         
        
        <Box className="button-box">
        <Button variant="contained" color="primary" type="submit" disabled={formik.isSubmitting}>
          Submit
        </Button>
        </Box>
       
      </form>
      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
      </Paper>
    )}
    </Box>
  );
};

export default AddLedger;
