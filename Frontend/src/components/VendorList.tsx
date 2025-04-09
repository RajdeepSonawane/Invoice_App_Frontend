import React, { useEffect, useState } from "react";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, TableContainer } from "@mui/material";
import axios from "axios";

// Define Vendor interface
interface Vendor {
  id: string;  // Assuming 'id' exists for unique key
  vendorname: string;
  contactnumber: string;
}

const VendorList: React.FC = () => {
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    axios
      .get<Vendor[]>(`${API_BASE_URL}/vendor/vendor-list`)
      .then((response) => {
        setVendorList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
      });
  }, []);

  return (
    <Box className="box-container">
    <Paper elevation={3} className="paper-container">
      <Typography variant="h6"  className="typography">
        Vendor List
      </Typography>
      <TableContainer component={Paper} sx={{ flex: 1, overflowX:"auto",marginTop:2 }}>
      <Table stickyHeader>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Contact</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendorList.length > 0 ? (
            vendorList.map((vendor) => (
              <TableRow key={vendor.id || vendor.vendorname}>
                <TableCell>{vendor.vendorname}</TableCell>
                <TableCell>{vendor.contactnumber}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No Vendors Found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </TableContainer>
    </Paper>
    </Box>
  );
};

export default VendorList;
