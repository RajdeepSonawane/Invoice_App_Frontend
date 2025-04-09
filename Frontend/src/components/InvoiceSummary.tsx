
import React, { useState, useEffect } from "react";

import axios from "axios";

import Grid2 from "@mui/material/Grid2";
import { Paper, Typography, Autocomplete, TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
interface College {
    collegename: string;
    contactnumber: number;
    collegeaccountNo: number;
}
interface formData{
    selectedCollege:String,
    fromDate:string,
    toDate:string
}

const InvoiceSummary: React.FC = () => {
    const [collegeList, setCollegeList] = useState<College[]>([]);
    const [selectedCollege, setSelectedCollege] = useState<string >("");
    const [fromDate, setfromDate] = useState<string >("");
    const [toDate, settoDate] = useState<string >("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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


    const handleexcelinvoice=async()=>{

            try{
            const formData:formData={
                selectedCollege,
                fromDate,
                toDate
            }
            console.log(formData)
            const response = await axios.post(`${API_BASE_URL}/invoice/invoice-summary`, formData, {
                responseType: "blob", 
            });
    

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });


            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "invoice_summary.xlsx"); // Set filename
            document.body.appendChild(link);
            link.click();
    
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading invoice summary:", error);
        }
    }
    

        

        return (
            <Box className="box-container">
                <Paper elevation={3} className="paper-container">
                    <Typography variant="h6" className="typography" marginBottom={2}>
                         Invoice Summary
                    </Typography>
        
                    <Grid2 container spacing={2} >
                
                        <Box marginTop={2} width="100%">
                            <Autocomplete
                                fullWidth
                                options={collegeList.map((clg) => clg.collegename)}
                                value={selectedCollege}
                                onChange={(_e, newValue) => {setSelectedCollege(String(newValue))}}
                                
                                renderInput={(params) => <TextField {...params} label="Select College" variant="outlined" />}
                                sx={{ width: "100%" }} 
                                />
                        </Box>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField
                                      
                                      label="Date"
                                      type="date"
                                      name="date"
                                      value={fromDate}
                                      onChange={(e)=>setfromDate(e.target.value)}
                                      InputLabelProps={{ shrink: true }}
                                    />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField
                                      
                                      label="Date"
                                      type="date"
                                      name="date"
                                      value={toDate}
                                      onChange={(e)=>settoDate(e.target.value)}
                                      InputLabelProps={{ shrink: true }}
                                    />
                        </Grid2>

                    </Grid2>
                    <Box className="button-box">
            <Button variant="contained" color="primary" type="submit" onClick={handleexcelinvoice}>
                Download
            </Button>
            </Box>
                  
           
             
                </Paper>
            </Box>
          );    

}
export default InvoiceSummary;