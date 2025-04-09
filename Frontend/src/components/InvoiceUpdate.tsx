// InvoiceList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button, Box, TextField, FormControl, InputLabel, MenuItem, Select, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Grid2 from "@mui/material/Grid2";
import { format } from "date-fns";


// Define the expected user data structure
interface User {
  id: string;
  email: string;
  role: string; // Ensure the role is available
}


interface Invoice {
  id: number; 
  billNo: string;
  date: string;
  status:string;
  Pdf?: string;
  collegename:string;
}

const InvoiceUpdate: React.FC = () => {
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]); // Typed state
  const[search,setsearch]=useState<string>("");
  const[selectedstatus,setselectedstatus]=useState<string>("");
  const status:string[]=["Paid","Pending","Rejected"];
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Items per page
  const navigate = useNavigate();
  const fetched = useRef(false);
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    if (fetched.current) return; // Prevents second API call
    fetched.current = true;
    const fetchinvoice=async()=>{
    // Fetch invoices from the backend
    try{
    const response=await axios.get<Invoice[]>(`${API_BASE_URL}/invoice`);
    console.log("Fetched Invoices:", response.data);  // Debugging
    setInvoiceList(response.data);
      }
    catch(error){
        console.error("Error fetching invoice:", error);
      };
    }
    fetchinvoice();
    }, []);

 

       // Get user data from localStorage
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");


  const handlestatusmapping=async()=>{
    
        if (!search.trim()) {
            alert("Please enter a valid Bill No.");
            return;
          }
          if (!selectedstatus) {
            alert("Please select a status.");
            return;
          }
    try{
        const response=await axios.post<string>(`${API_BASE_URL}/invoice/invoice-update/${search}`,{ status: selectedstatus },
          {
            headers: {
                Authorization: `Bearer ${token}`,  // Send token in headers
            }
          }
        );
        if (response.status === 200) {
            console.log("invoice status updated")
            alert(`Invoice ${search} status updated to ${selectedstatus}`);
             setsearch(""); // Clear input after update
            setselectedstatus(""); // Reset dropdown
            navigate("/invoice-list");
            setInvoiceList((prev) =>
                prev.map((invoice) =>
                    invoice.billNo === search ? { ...invoice, status: selectedstatus } : invoice
                )
            );
        }
        }
    catch(error){
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
        };

  }
  const handleInvoiceEdit=async(id: number)=>{
    if (!window.confirm("Are you sure you want to edit this invoice?")) {
      return; 
    }
    navigate(`/invoice-edit/${id}`)
}
const handleinvoicedelete=async(id:number)=>{
    if (!window.confirm("Are you sure you want to delete this invoice?")) {
        return; // Ask for confirmation before deleting
      }
    try{
     
        const response=await axios.put<string>(`${API_BASE_URL}/invoice/invoice-delete/${id}`,
          {},{
            headers: {
                Authorization: `Bearer ${token}`,  // Send token in headers
            }
          }
        );
        if (response.status === 200) {
            console.log("invoice deleted successfully")
            alert(`Invoice deleted successfully`);
          
            // Remove deleted invoice from state without refreshing
            setInvoiceList((prev) => prev.filter(invoice => invoice.id !== Number(id)));
           
          
        }
        }
    catch(error){
        console.error("Error deleting invoice", error);
        alert("Failed to delete invoice. Please try again.");
        };

}


const filteredinvoice = invoiceList.filter((inv) =>
    search ? inv.billNo.toString().includes(search.toString()) : true
  );


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
    <Paper elevation={3}className="paper-container">
     <Typography variant="h6" className="typography" marginBottom={2}>
          Update Invoice 
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
          <Grid2 size={{ xs: 12, md: 6 }}>
           <FormControl fullWidth >
            <InputLabel>Status</InputLabel>
            <Select
           
            value={selectedstatus}
            onChange={(e)=>setselectedstatus(e.target.value)}>
              {status.map((state, index) => (
                  <MenuItem key={index} value={state}>
                    {state}
                  </MenuItem>
                ))
            }
              
            </Select>
          </FormControl>
          </Grid2>
          
          </Grid2>
            <Box className="button-box">
            <Button 
                
                variant="contained"
               color="secondary" 
               onClick={handlestatusmapping}
               >
                Submit
              </Button>
            </Box>
        <TableContainer component={Paper}sx={{ flex: 1, overflow: "auto" }}>
      <Table stickyHeader>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow >
            <TableCell>Bill No</TableCell>
            <TableCell>College Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {paginatedInvoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.billNo}</TableCell>
            <TableCell>{invoice.collegename}</TableCell>
            <TableCell>{ format(new Date(invoice.date), "dd/MM/yyyy")}</TableCell>
            <TableCell>{invoice.status}</TableCell>
           
            
            <TableCell>
            <Button 
                key={invoice.id}
                onClick={() => {handleInvoiceEdit(invoice.id)}}
               color="secondary" 
               disabled={user?.role === "Admin"}>
               <EditIcon />
              </Button>
              <Button 
                key={invoice.id}
                onClick={() =>handleinvoicedelete(invoice.id)}
               color="secondary"
               disabled={user?.role === "Admin"}>
               <DeleteIcon />
              </Button>
            </TableCell>
            </TableRow>
               ))}
         </TableBody>
      </Table>
      </TableContainer>
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

export default InvoiceUpdate;
