import React, { useEffect, useState,  } from "react";
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
import { useFormik } from "formik";
import { validationSchema } from "../validations/collegeValidation";

interface AccountDetails {
  collegeaccountNo: string;
  bankName: string;
  branch: string;
  bankIfsc: string;
}





// Define the expected user data structure
interface User {
  id: string;
  email: string;
  role: string; // Ensure the role is available
}

const AddCollege: React.FC = () => {
  //const [accountNo, setAccountNo] = useState<number>(0);
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    collegeaccountNo:"",
    bankName: "",
    branch: "",
    bankIfsc: "",
  });

  const [acct, setAcct] = useState<AccountDetails[]>([]);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



  const navigate = useNavigate();
  // Get user data from localStorage
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

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
      InstitutionType: "",
      collegename: "",
      collegeshortname:"",
      contactnumber: "",
      collegeaddress: "",
      state: "",
      statecode: "",
      email: "",
      collegeaccountNo: [],
    },
    validationSchema:validationSchema,
    onSubmit:async (values,{setSubmitting,resetForm}) => {
      
  
     
      const dataToSubmit = {
        ...values,
        collegeaccountNo: acct // Include selected accounts in the submission
      };
      
  
      try {
        console.log(dataToSubmit.collegeaccountNo)
        setError(""); // Clear previous errors
        const response = await axios.post(
          `${API_BASE_URL}/College/add-college`,
          dataToSubmit,
          {
            headers: {
                Authorization: `Bearer ${token}`,  // Send token in headers
            },
          }
        );
       
  
        if (response.status === 201) {
          setSuccessMessage("College added successfully!");
          setOpenSnackbar(true);
          navigate("/college-list");
        }
        
        resetForm();
      } catch (error) {
        console.error("Error adding college:", error);
        setError("Failed to add college. Please try again.");
      }
      finally {
        setSubmitting(false);
      }
    }
  })





  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  



  const handleAccountChange = async () => {

    if (
      accountDetails.collegeaccountNo &&
      accountDetails.bankName &&
      accountDetails.branch &&
      accountDetails.bankIfsc
    ) {
      // Add the new account to the accounts list
      setAcct((prevAccounts) => [...prevAccounts, accountDetails]);

      
      
        setAccountDetails({
          collegeaccountNo:"",
          bankName: "",
          branch: "",
          bankIfsc: "",
        });
      }
  
  };

  return (
    <Box className="box-container">
      {loading ? (
            <Typography>Loading...</Typography>
          ) : (
      <Paper elevation={0} className="paper-container">
        <Typography variant="h6" className="typography">
          Add College
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
                name="InstitutionType"
                label="Institution Type"
                value={formik.values.InstitutionType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.InstitutionType && Boolean(formik.errors.InstitutionType)}
                helperText={formik.touched.InstitutionType && formik.errors.InstitutionType}
               
                required
              />
             </Grid2>
             <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="collegename"
                label="College Name"
                value={formik.values.collegename}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.collegename && Boolean(formik.errors.collegename)}
                helperText={formik.touched.collegename && formik.errors.collegename}
                required
              />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="collegeshortname"
                label="College Short Name"
                value={formik.values.collegeshortname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.collegeshortname && Boolean(formik.errors.collegeshortname)}
                helperText={formik.touched.collegeshortname && formik.errors.collegeshortname}
                required
              />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="contactnumber"
                label="Contact Number"
                value={formik.values.contactnumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactnumber && Boolean(formik.errors.contactnumber)}
                helperText={formik.touched.contactnumber && formik.errors.contactnumber}
                required
              />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="collegeaddress"
                label="College Address"
                value={formik.values.collegeaddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.collegeaddress && Boolean(formik.errors.collegeaddress)}
                helperText={formik.touched.collegeaddress && formik.errors.collegeaddress}
                required
              />
              </Grid2>
              
            
           
            

           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="state"
                label="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
                required
              />
               </Grid2>
               <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="statecode"
                label="State Code"
                type="number"
                value={formik.values.statecode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.statecode && Boolean(formik.errors.statecode)}
                helperText={formik.touched.statecode && formik.errors.statecode}
                required
              />
               </Grid2>
               <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                required
              />
              </Grid2>
              <Box>
              <Paper elevation={4} style={{ padding: "16px", marginTop: "8px" }}>
                <Typography variant="h6" align="center">Add Account Details</Typography>
                <Grid2 container  columnSpacing={1} >
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="collegeaccountNo"
                      label="Account No."
                      value={accountDetails.collegeaccountNo||""}
                      onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        collegeaccountNo: e.target.value === "" ? "" : e.target.value,
                        })
                        }
                      margin="normal"
                    />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="bankName"
                      label="Bank Name"
                      value={accountDetails.bankName}
                      onChange={(e) =>
                      setAccountDetails({
                      ...accountDetails,
                      bankName: e.target.value,
                        })
                        }
                      margin="normal"
                    />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="branch"
                      label="Branch"
                      value={accountDetails.branch}
                      onChange={(e) =>
                      setAccountDetails({
                      ...accountDetails,
                      branch: e.target.value,
                      })
                      }
                      margin="normal"
                    />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="bankIfsc"
                      label="IFSC Code"
                      value={accountDetails.bankIfsc}
                      onChange={(e) =>
                      setAccountDetails({
                      ...accountDetails,
                      bankIfsc: e.target.value,
                        })
                        }
                      margin="normal"
                    />
                    </Grid2>
                    </Grid2>
                    <Box className="button-box">
                    <Button variant="contained" color="secondary" onClick={handleAccountChange}>
                      Add Account
                    </Button>
                    </Box>
              </Paper>
            </Box>
            
                    
                    <TableContainer component={Paper}>
                    <Table sx={{ width: "100%" }} aria-label="accounts table">
                        
                        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                          <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>Account No.</TableCell>
                            <TableCell>Bank Name</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>IFSC Code</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {acct.map((accnt, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{accnt.collegeaccountNo}</TableCell>
                              <TableCell>{accnt.bankName}</TableCell>
            
                              <TableCell>{accnt.branch}</TableCell>
                              <TableCell>{accnt.bankIfsc}</TableCell>
                      
                              
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => setAcct((prev) => prev.filter((_, i) => i !== index))}
                                >
                                  X
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
               
              
              </Grid2>
            <Box className="button-box" >
              <Button variant="contained" color="primary" type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Box>
           
        </form>
        </Paper>)}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    
    </Box>
  );
};

export default AddCollege;
