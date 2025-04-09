// LedgerList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, TableContainer } from "@mui/material";

interface Subledger{
  id: number;
  subLedger:string;
}

// Define the structure for a ledger
interface Ledger {
  ledger_id:number;
  ledgername: string;
  subledger: Subledger[]; // Sub-ledgers might be an array (optional)
}

const LedgerList: React.FC = () => {
  const [ledgerList, setLedgerList] = useState<Ledger[]>([]); // Typed state
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    // Fetch ledger from the backend
    axios
      .get<Ledger[]>(`${API_BASE_URL}/ledger/ledger-list`)
      .then((response) => {
        setLedgerList(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching Ledger:", error);
      });
  }, []);

  return (
    <Box className="box-container">
    <Paper  elevation={3}className="paper-container" >
      <Typography variant="h6" className="typography">
        Ledger List
      </Typography>
      <TableContainer component={Paper} sx={{ flex: 1, overflowX:"auto",marginTop:2 }}>
      <Table stickyHeader>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Ledger</TableCell>
            <TableCell>Sub Ledger</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ledgerList.map((led, index) => (
            <TableRow key={index }>
              <TableCell>{led.ledger_id}</TableCell>
              <TableCell>{led.ledgername}</TableCell>
              <TableCell>{led.subledger?.length >0
                ? led.subledger?.map((subled)=>subled.subLedger).join(", ")
              : "No Sub-Ledger Available"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </Paper>
    </Box>
  );
};

export default LedgerList;
