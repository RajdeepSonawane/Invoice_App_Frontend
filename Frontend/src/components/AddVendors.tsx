import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Box, Snackbar, Paper} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Grid2 from "@mui/material/Grid2";
import { useFormik } from "formik";
import { validationSchema } from "../validations/vendorValidation";



// Define the expected user data structure
interface User {
  id: string;
  email: string;
  role: string; // Ensure the role is available
}

const AddVendors: React.FC = () => {
  const navigate = useNavigate();
  

  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        vendorname: "",
        ownerName:"",
        contactnumber: 0,
        currentaddress: "",
        GstNo: "",
        PanNo: "",
        email: "",
        state: "",
        accountNo: 0,
        branch: "",
        bankName: "",
        ifscCode: "",
      },
      validationSchema: validationSchema,
      onSubmit:async (values, { setSubmitting, resetForm }) => {
      
      
        try {
          setError("");
          const response = await axios.post(`${API_BASE_URL}/vendor/add-vendor`, values,
            {
              headers: {
                  Authorization: `Bearer ${token}`,  // Send token in headers
              }
            }
          );
          console.log("Vendors added successfully:", response.data);
          setSuccessMessage("Vendors added successfully!");
          setOpenSnackbar(true);
          navigate("/vendor-list");
          resetForm();
        } catch (error) {
          console.error("Error adding Vendor:", error);
          setError("Failed to add vendor. Please try again.");
        }
        finally {
          setSubmitting(false);
        }
      },
    })
  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    
    <Box className="box-container">
       {loading ? (
            <Typography>Loading...</Typography>
          ) : (
      <Paper elevation={3} className="paper-container">
        <Typography variant="h6" className="typography">
            Add Vendors
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
                            label="Vendor Name"
                            name="vendorname" 
                            value={formik.values.vendorname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.vendorname && Boolean(formik.errors.vendorname)}
                            helperText={formik.touched.vendorname && formik.errors.vendorname}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <TextField
                              fullWidth
                              label="Owner Name"
                              name="ownerName"
                              value={formik.values.ownerName}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
                              helperText={formik.touched.ownerName && formik.errors.ownerName}
                              />
                          </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Contact Number"
                            name="contactnumber" 
                            value={formik.values.contactnumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.contactnumber && Boolean(formik.errors.contactnumber)}
                            helperText={formik.touched.contactnumber && formik.errors.contactnumber} 
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Current Address"
                            name="currentaddress" 
                            value={formik.values.currentaddress}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.currentaddress && Boolean(formik.errors.currentaddress)}
                            helperText={formik.touched.currentaddress && formik.errors.currentaddress} 
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <TextField
                              fullWidth
                              label="Gst No."
                              name="GstNo" 
                              value={formik.values.GstNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.GstNo && Boolean(formik.errors.GstNo)}
                            helperText={formik.touched.GstNo && formik.errors.GstNo}  
                              />
                              </Grid2>
                 <Grid2 size={{ xs: 12, md: 6 }}>
             <TextField
                fullWidth
                label="Pan No." 
                name="PanNo" 
                value={formik.values.PanNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.PanNo && Boolean(formik.errors.PanNo)}
                helperText={formik.touched.PanNo && formik.errors.PanNo}  
                  />
                
                 </Grid2>
                 <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Email"
                name="email" 
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}  
                 />
                 </Grid2>
                 <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="State"
                name="state" 
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}  
                />
                 </Grid2>
                
                 <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Account No."
                name="accountNo"
                value={formik.values.accountNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.accountNo && Boolean(formik.errors.accountNo)}
                helperText={formik.touched.accountNo && formik.errors.accountNo}  
                 />
                 </Grid2>
                 <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Branch"
                name="branch"
                value={formik.values.branch}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.branch && Boolean(formik.errors.branch)}
                helperText={formik.touched.branch && formik.errors.branch}  
                 /> 
                 </Grid2>
                 <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Bank Name"
                name="bankName"
                value={formik.values.bankName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.bankName&& Boolean(formik.errors.bankName)}
                helperText={formik.touched.bankName && formik.errors.bankName}  
                />
                 </Grid2>
                 <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="IFSC Code"
                name="ifscCode"
                value={formik.values.ifscCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ifscCode && Boolean(formik.errors.ifscCode)}
                helperText={formik.touched.ifscCode && formik.errors.ifscCode}  
                />
                 </Grid2>
                 </Grid2>

            
            <Box className="button-box">
            <Button variant="contained" color="primary" type="submit" disabled={formik.isSubmitting}>
                Submit
            </Button>
            </Box>
           
        </form>
        
                    </Paper>
          )}
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

export default AddVendors;
