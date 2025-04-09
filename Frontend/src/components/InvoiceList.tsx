// InvoiceList.tsx
import React, { useState, useEffect } from "react";

import axios from "axios";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button,  TableContainer, Box, TextField,TablePagination, FormControl, InputLabel, MenuItem, Select, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid2";

import { format } from "date-fns";
// Define the invoice structure
interface Invoice {
  id: number; 
  billNo: string;
  date: string;
  status:string;
  Pdf: string;
  collegename:string;
}

interface College {
  collegename: string;
  collegeaccountNo: number[];
}

const InvoiceList: React.FC = () => {
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]); // Typed state
  const[search,setsearch]=useState<string>("");
  const[selectedstatus,setselectedstatus]=useState<string>("");
  const status:string[]=["Done","Pending","Revert"];
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Items per page
  const [selectedCollege, setSelectedCollege] = useState<string | null>("");
  const [collegeList, setCollegeList] = useState<College[]>([]);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    const fetchinvoice=async()=>{
    // Fetch invoices from the backend
    try{
    const response=await axios.get<Invoice[]>(`${API_BASE_URL}/invoice`);
    setInvoiceList(response.data);
      }
    catch(error){
        console.error("Error fetching invoice:", error);
      };
    }
    fetchinvoice();
    }, []);

    useEffect(() => {
      const fetchcollege=async()=>{
        try{
      const response=await axios.get<College[]>(`${API_BASE_URL}/college/view-college`);
      setCollegeList(response.data)
        }catch(error){
           console.error("Error fetching college list:", error);
        }};
        fetchcollege();
        }, []);
  
  

   
  
    const filteredinvoice = invoiceList.filter((inv) => {
      const matchesSearch = search ? inv.billNo?.toString().includes(search.toString()) : true;
      const matchesStatus = selectedstatus ? inv.status?.toString().includes(selectedstatus.toString()) : true;
      const matchesCollege = selectedCollege ? inv.collegename?.toString().includes(selectedCollege.toString()) : true;
      return matchesSearch && matchesStatus && matchesCollege;
    });

 

  // Pagination handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedInvoices = filteredinvoice.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  

  return (
    <Box className="box-container">
    <Paper elevation={3} className="paper-container">
     <Typography variant="h6" className="typography" marginBottom={2}>
          Invoice List
        </Typography>

        <Grid2 container spacing={2} >
        <Grid2 size={{ xs: 12, md: 6 }}>
          {/* Search Bar */}
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setsearch(e.target.value)}
           
          />
          </Grid2>
          <Grid2  size={{ xs: 12, md: 6 }}>
           <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              fullWidth
              value={selectedstatus}
              onChange={(e) => setselectedstatus(e.target.value)}
            >
                {status.map((state, index) => (
                  <MenuItem key={index} value={state}>
                    {state}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
            </Grid2>
            </Grid2>
            <Box marginTop={2} width="100%">
            <Autocomplete
                      fullWidth
                      options={collegeList.map((clg) => clg.collegename)}
                      value={selectedCollege}
                      onChange={(_e, newValue) => {setSelectedCollege(newValue)}}
                    
                      renderInput={(params) => <TextField {...params} label="Select College" variant="outlined" />}
                      sx={{ width: "100%" }} 
                    />
          </Box>
          
    <TableContainer component={Paper}sx={{ flex: 1, overflow: "auto",marginTop:2 }}>
      <Table stickyHeader>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>Bill No</TableCell>
            <TableCell>College Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>View Invoice</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {paginatedInvoices.map((invoice) => (
         <TableRow key={invoice.id}>
            <TableCell>{invoice.billNo}</TableCell>
            <TableCell>{invoice.collegename}</TableCell>
            <TableCell>{ format(new Date(invoice.date), "dd/MM/yyyy")}</TableCell>
            <TableCell onClick={() => navigate("/invoice-update")}
            sx={{ cursor: "pointer" }}
            >{invoice.status}</TableCell>
            <TableCell>
                    <Button 
                      
                      color="secondary" 
                      onClick={() => window.open(invoice.Pdf, "_blank")}
                      sx={{ mr: 1 }}
                    >
                      <ListAltIcon />
                    </Button>
            </TableCell>
            </TableRow>
          ))}
         </TableBody>
      </Table>
      </TableContainer>
      {/* Pagination Component */}
      <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={filteredinvoice.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      </Box>
  );
};

export default InvoiceList;
