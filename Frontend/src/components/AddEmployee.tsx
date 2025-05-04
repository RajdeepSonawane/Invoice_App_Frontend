import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Typography,
    TextField,
    Button,
    Box,
    MenuItem,
    Paper,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { validationSchema } from "../validations/employeeValidation";


// Define the expected user data structure
interface User {
    id: string;
    email: string;
    role: string; // Ensure the role is available
  }

const AddEmployee: React.FC = () => {
    const navigate = useNavigate();
    const roles: string[] = ["Admin", "Super Admin"];

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
  

   // Formik Hook
  const formik = useFormik({
    initialValues: {
      employeeCode: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      currentAddress: "",
      email: "",
      password: "",
      designation: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {

        
        try {
          
          const response = await axios.post(`${API_BASE_URL}/Users/add-user`,
           values,
           {
            headers: {
                Authorization: `Bearer ${token}`,  // Send token in headers
            },
        });
          console.log("Employee added successfully:", response.data);
          navigate("/employee-list");
          resetForm();
        } catch (error) {
          console.error("Error adding employee:", error);
        } finally {
          setSubmitting(false);
        }
      },
    });
 
    return (
        <Box className="box-container">
             {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
            <Paper elevation={3} className="paper-container">     
                <Typography variant="h6" className="typography">
                                Add Employee
                </Typography>
                  
            
                                <form onSubmit={formik.handleSubmit} className="form-container">
                                   
                                    <Grid2 container spacing={2} >
                                        <Grid2 size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Employee Code"
                                                name="employeeCode"
                                                value={formik.values.employeeCode}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.employeeCode && Boolean(formik.errors.employeeCode)}
                                                helperText={formik.touched.employeeCode && formik.errors.employeeCode}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Designation"
                                                name="designation"
                                                value={formik.values.designation}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.designation && Boolean(formik.errors.designation)}
                                                helperText={formik.touched.designation && formik.errors.designation}
                                           
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 6}}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                name="firstName"
                                                value={formik.values.firstName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                                helperText={formik.touched.firstName && formik.errors.firstName}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 6}}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                name="lastName"
                                                value={formik.values.lastName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                                helperText={formik.touched.lastName && formik.errors.lastName}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Contact Number"
                                                name="contactNumber"
                                                
                                                value={formik.values.contactNumber}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                                                helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 6 }}>
                                            <TextField
                                               fullWidth
                                               label="Current Address"
                                               name="currentAddress"
                                               value={formik.values.currentAddress}
                                               onChange={formik.handleChange}
                                               onBlur={formik.handleBlur}
                                               error={formik.touched.currentAddress && Boolean(formik.errors.currentAddress)}
                                               helperText={formik.touched.currentAddress && formik.errors.currentAddress}
                                               
                                                
                                            />
                                        </Grid2>
                                        <Grid2 size={{xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 6}}>
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                name="password"
                                                type="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}
                                         
                                            />
                                        </Grid2>
                                
                                        <Grid2 size={{ xs: 12, md: 6}}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Role"
                                                name="role"
                                                value={formik.values.role}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.role && Boolean(formik.errors.role)}
                                                helperText={formik.touched.role && formik.errors.role}
                                            >
                                            
                                                {roles.map((role) => (
                                                    <MenuItem key={role} value={role}>
                                                        {role}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid2>
                                    </Grid2>
                                
                                
                                    {/* Submit Button */}
                            <Box className="button-box">
                                <Button variant="contained" color="primary" type="submit" disabled={formik.isSubmitting}>
                                        Submit
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                )}

                       
                   
               
            
                
        </Box>
    );
};

export default AddEmployee;
