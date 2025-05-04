import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, TableContainer } from "@mui/material";


interface CollegeAccount {
    id: number;
    collegeaccountNo: string;
  }

interface College {
    college_id:number;
    collegename: string;
    institutionType:string;
    contactnumber: number;
    accountNumbers: CollegeAccount[];
    email:string
}

const CollegeList: React.FC = () => {
    const [colleges, setColleges] = useState<College[]>([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(()=> {
        const fetchcollege = async()=>{
        // Fetch colleges from the backend
        try{
               const response=await axios.get<College[]>(`${API_BASE_URL}/College/college-list`);
                setColleges(response.data);
                console.log(response.data)
            }
        catch(error){
                console.error("Error fetching colleges:", error);
            }
            };
            fetchcollege()
        }, []);

    return (
       <Box className="box-container">
               <Paper elevation={3} className="paper-container">
            <Typography variant="h6" className="typography" >
                College List
            </Typography>
            <TableContainer component={Paper}sx={{ flex: 1, overflowX:"auto",marginTop:2 }}>
            <Table stickyHeader>
                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                    <TableRow>
                        <TableCell>Sr No.</TableCell>
                        <TableCell>Institution Name</TableCell>
                        <TableCell>College Name</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Account No</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {colleges.map((clg, index) => (
                        <TableRow key={clg.college_id}>
                           <TableCell>{index+1}</TableCell>
                           <TableCell>{clg.institutionType}</TableCell>
                            <TableCell>{clg.collegename}</TableCell>
                            <TableCell>{clg.contactnumber}</TableCell>
                            <TableCell>{clg.email}</TableCell>
                            <TableCell> {clg.accountNumbers.length > 0
                      ? clg.accountNumbers.map((acc) => acc.collegeaccountNo).join(", ")
                      : "No Accounts Available"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Paper>
        </Box>
    );
};

export default CollegeList;
