import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, TableContainer } from "@mui/material";

// Define Employee interface
interface Employee {
    employeeCode: string;
    firstName: string;
    email: string;
    role: string;
}

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchemployee=async()=>{
        try{
        // Fetch users from the backend
        const response=await axios.get<Employee[]>(`${API_BASE_URL}/Users/user-list`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Set the token in headers
                },
            }
        );
        setEmployees(response.data);
            }
        catch(error) {
                console.error("Error fetching users:", error);
            };
        }
        fetchemployee()
    }, []);

    return (
        <Box className="box-container">
        <Paper elevation={3} className="paper-container" >
            <Typography variant="h6" className="typography">
                Employee List
            </Typography>
            <TableContainer component={Paper}sx={{ flex: 1, overflowX:"auto",marginTop:2 }}>
                <Table stickyHeader>
                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                    <TableRow>
                        <TableCell>Employee Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((emp) => (
                        <TableRow key={emp.employeeCode}>
                            <TableCell>{emp.employeeCode}</TableCell>
                            <TableCell>{emp.firstName}</TableCell>
                            <TableCell>{emp.email}</TableCell>
                            <TableCell>{emp.role}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Paper>
        </Box>
    );
};

export default EmployeeList;
