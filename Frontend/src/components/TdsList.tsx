import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box } from "@mui/material";

// Define TypeScript interface for TDS data
interface Tds {
  id: string;  // Assuming 'id' exists for unique key
  name: string;
  rate: number;
}

const TdsList: React.FC = () => {
  const [tdsList, setTdsList] = useState<Tds[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    // Fetch TDS data from backend
    axios
      .get<Tds[]>(`${API_BASE_URL}/tds/tds-list`)
      .then((response) => {
        setTdsList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching TDS:", error);
      });
  }, []);

  return (
    <Box className="box-container">
    <Paper elevation={3}className="paper-container">
      <Typography variant="h6" className="typography">
        TDS List
      </Typography>
      <Table>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tdsList.length > 0 ? (
            tdsList.map((tds) => (
              <TableRow key={tds.id || tds.name}>
                <TableCell>{tds.name}</TableCell>
                <TableCell>{tds.rate}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No TDS records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
    </Box>
  );
};

export default TdsList;
