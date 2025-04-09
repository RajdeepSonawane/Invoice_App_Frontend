import React, {  useCallback, useEffect, useMemo, useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";

import {
 
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Grid2 from "@mui/material/Grid2";
import "./styles.css";



interface CollegeAccount {
  id: number;
  collegeaccountNo: string;
}

// Define types
interface College {
  collegename: string;
  accountNumbers: CollegeAccount[] ;
  college_id:number;
}



interface Vendor {
  vendorname: string;
  id:number;
}

interface TDS {
  id:number;
  name: string;
}

interface Sub_ledger{
  id:number,
  subLedger:string;
}

interface Ledger {
  ledger_id:number;
  ledgername: string;
  subledger: Sub_ledger[];
}

interface Invoice {
  invoiceNo: string;
  date: string;
  vendorId: number;
  advance: number;
  basic: number;
  gross: number;
  taxAmount: number;
  tdsSecId: number;
  tdsRate: number;
  tds: number;
  payment: number;
  ledgerId: number;
  subledgerId: number;
  remark: string;
}

const InvoiceGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    collegeId:0,
    date:"",
    billNo:0,
    AccountNumberId: 0,
    AmountTransfer: "",
    invoices: [] as Invoice[],
    ImageFiles:[] as File[],
    status:"Pending",
  });

  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({
    invoiceNo: "",
    date: "",
    vendorId:0,
    advance:0,
    basic:0,
    gross: 0,
    taxAmount: 0,
    tdsSecId:0,
    tdsRate: 0,
    tds: 0,
    payment:0,
    ledgerId: 0,
    subledgerId:0,
    remark: "",
  });
  const [selectedfiles,setselectedfiles]=useState<File[]>([]);

  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [collegeList, setCollegeList] = useState<College[]>([]);
  const [matchCollege, setMatchCollege] = useState<College | null >(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchcollege=async()=>{
      try{
    const response=await axios.get<College[]>(`${API_BASE_URL}/college/view-college`);
    console.log("Fetched Colleges:", response.data);
    
    setCollegeList(response.data)
      }catch(error){
         console.error("Error fetching college list:", error);
      }};
      fetchcollege();
      }, []);

      useEffect(() => {

        const matched = collegeList.find(clg => clg.collegename === selectedCollege?.collegename) || null;
       
        setMatchCollege(matched || null)
      }, [selectedCollege, collegeList]);

  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  useEffect(() => {
    const fetchvendor=async()=>{
      try{
    const response=await axios.get<Vendor[]>(`${API_BASE_URL}/vendor/vendor-list`)
    setVendorList(response.data)
      }catch(error)
      {console.error("Error Fetching Vendors", error);
      }}
      fetchvendor()}, []);

  const [tdsList, setTdsList] = useState<TDS[]>([]);
  useEffect(() => {
    axios.get<TDS[]>(`${API_BASE_URL}/tds/tds-List`)
      .then(response => setTdsList(response.data))
      .catch(error => console.error("Error Fetching TDS", error));
  }, []);

  const [LedgerList, setLedgerList] = useState<Ledger[]>([]);
  const [selectedLedger, setSelectedLedger] = useState<Ledger|null>(null);
  const [matchedLedger, setMatchedLedger] = useState<Ledger | null>(null);

  useEffect(() => {
    axios.get<Ledger[]>(`${API_BASE_URL}/ledger/ledger-list`)
      .then(response => setLedgerList(response.data))
      .catch(error => console.error("Error fetching ledger list:", error));
  }, []);

  useMemo(() => {
    const matched = LedgerList.find(led => led.ledgername === selectedLedger?.ledgername) || null;
    setMatchedLedger(matched);
  }, [selectedLedger, LedgerList]);

  const handleInvoiceChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCurrentInvoice(prevState => ({
      ...prevState,
      [name]: ["advance", "basic", "gross", "taxAmount", "tds", "payment"].includes(name) ? Number(value) : value,
      
      
    }));
    
  },[]);

  
  
  
  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles =e.target.files
      setselectedfiles((prevFiles) => [...prevFiles, ...newFiles]);;
    }
  
  },[])
  
  const addInvoice = async () => {
    try {
      console.log(currentInvoice)
      const response = await axios.post(`${API_BASE_URL}/invoice/calculate`, currentInvoice);
      console.log(response.data)
      if (response.status === 200) {
        setFormData(prev => ({
          ...prev,
          invoices: [...prev.invoices, response.data],
        }));
        setCurrentInvoice({
          invoiceNo: "",
          date: "",
          vendorId:0,
          advance:0,
          basic: 0,
          gross: 0,
          taxAmount: 0,
          tdsSecId:0,
          tdsRate:0,
          tds: 0,
          payment: 0,
          ledgerId:0,
          subledgerId: 0,
          remark: "",
        });
        setSelectedLedger(null);
      }
    } catch (error) {
      console.error("Error creating  invoice");
    }
  };

  const handleGenerateInvoice = async () => {
    try {

      setLoading(true);
      console.log(formData.invoices)
      const formdata = new FormData();
      console.log("Form Data Before Submission:", formData);
      /// Ensure invoices is always an array
    const invoiceData = {
      collegeId: formData.collegeId || 0,
      date: formData.date || "",
      billNo:formData.billNo||0,
      AccountNumberId: formData.AccountNumberId || 0,
      AmountTransfer: formData.AmountTransfer || 0,
      invoices: Array.isArray(formData.invoices) ? formData.invoices : [],
      status:formData.status ||"",
    };
      // Append full invoice data as JSON
    formdata.append("invoice", JSON.stringify(invoiceData));
       // Append files
    selectedfiles.forEach((file) => {
      formdata.append("ImageFiles", file);
    });

      console.log(selectedfiles);
      const response = await axios.post(`${API_BASE_URL}/invoice/generate`,
       formdata,
       {
        headers: {
            Authorization: `Bearer ${token}`,  // Send token in headers
        },
        responseType: "blob",
      }
      );
      if (response.status === 200 || response.status === 201) {
        alert("Invoice generated successfully!");
        const blob = new Blob([response.data], { type: "text/csv" });



      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "vendor_details.csv"); // Set filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
        setFormData({ collegeId:0, AccountNumberId: 0, AmountTransfer:"" , invoices: [],ImageFiles:[],status:"",date:"",billNo:0 });
      }
    } catch (error) {
      console.error("Error generating invoice", error);
    }finally {
      setLoading(false); // Hide loading screen after request completion
  }
  };

  if (loading) {
      return (
          <Box
              sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
          >
              <CircularProgress />
          </Box>
      );
  }


  return (
   
      <Box className="box-container">
      <Paper elevation={3} className="paper-container">
      <Typography variant="h6"className="typography" marginBottom={2}>
        Generate Invoice
      </Typography>
  
      {/* College Selection */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 1 }}>
        <Autocomplete
          options={collegeList} 
          getOptionLabel={(option) => option.collegename}
          value={collegeList.find((clg) => clg.collegename === selectedCollege?.collegename) || null} 
          onChange={(_e, newValue) => {
            setSelectedCollege(newValue); // Store only the name for display
            setFormData((prev) => ({
              ...prev,
              collegeId: newValue?.college_id  || 0 , // Store only the collegeId
              AccountNumber: 0,
            }));
            console.log(newValue?.college_id)
          }}
          renderInput={(params) => <TextField {...params} label="Select College" variant="outlined" />}
          sx={{ width: 300 }}
        />
      </Box>
      <Divider/>

      <Box sx={{ display:"flex" , justifyContent:"end",p:2}}>
      <TextField
          
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={(e)=>setFormData((prev)=>({...prev,date:e.target.value}))}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
  
      {/* Invoice Form */}
      <Grid2 container spacing={2} >
      
      <Grid2 size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Account Number</InputLabel>
          <Select
            value={formData.AccountNumberId || ""}
            onChange={(e) => {
              
              const selectedId = Number(e.target.value); // Store the account ID

               setFormData((prev) => ({
                    ...prev,
                    AccountNumberId: selectedId, // Store only the ID in formData
                  }));
                 
                }}
            MenuProps={{
              disablePortal: true, 
            }}
          >
            {matchCollege && matchCollege.accountNumbers.length > 0 ? (
              matchCollege.accountNumbers.map((accnt) => (
                <MenuItem key={accnt.id} value={accnt.id}>
                    {accnt.collegeaccountNo}
                 </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No accounts available</MenuItem>
            )}
          </Select>
        </FormControl>
        </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
        <TextField
          label="RTGS/ NEFT/ Cheque No"
          fullWidth
          name="AmountTransfer"
          value={formData.AmountTransfer || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, AmountTransfer: (e.target.value)}))}
        />
      </Grid2>
      </Grid2>
  
      {/* Invoice Entry */}
      <Paper elevation={6} sx={{ padding: 4 ,marginTop:2}} >
        <Typography variant="h6" align="center" mb={1}>Add Invoice</Typography>
        <Grid2 container spacing={2} >
          <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField 
          label="Invoice No" 
          fullWidth name="invoiceNo" 
          value={currentInvoice.invoiceNo} 
          onChange={handleInvoiceChange} 
          />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField 
          label="Date" 
          type="date" 
          fullWidth 
          name="date" 
          value={currentInvoice.date} 
          onChange={handleInvoiceChange} 
          InputLabelProps={{ shrink: true }} 
          />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Autocomplete
              fullWidth
              options={vendorList}
              getOptionLabel={(option) => option.vendorname}
              value={vendorList.find((vendor) => vendor.id === currentInvoice.vendorId) || null}
              onChange={(_e, newValue) => {
                
                setCurrentInvoice((prev) => ({
                  ...prev,
                  vendorId:newValue?.id || 0,
                }));
     
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select Vendor" variant="outlined" />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField 
          label="Advance" 
          fullWidth 
          name="advance" 
          value={currentInvoice.advance} 
          onChange={handleInvoiceChange} 
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField 
          label="Basic" 
          fullWidth 
          name="basic" 
          value={currentInvoice.basic} 
          onChange={handleInvoiceChange} 
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField 
          label="Gross" 
          fullWidth 
          name="gross" 
          value={currentInvoice.gross} 
          onChange={handleInvoiceChange} 
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField 
          select 
          label="TDS Section" 
          fullWidth 
          name="tdsSec" 
          value={currentInvoice.tdsSecId || ""} 
          onChange={(e)=>{

            const selectId=Number(e.target.value)
            setCurrentInvoice((prev) => ({
              ...prev,
              tdsSecId:selectId || 0,
            }));
            console.log(selectId)
          }}
          >
            {tdsList.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.name}
              </MenuItem>
            ))}
          </TextField>
          </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          {/* Ledger Selection */}
          <Autocomplete
             options={LedgerList} 
             getOptionLabel={(option) => option.ledgername}
             value={LedgerList.find((led) => led.ledgername === selectedLedger?.ledgername) || null}
            onChange={(_e, newValue) => {
                
                setSelectedLedger(newValue);
                setCurrentInvoice((prev) => ({
                  ...prev,
                  ledgerId: newValue?.ledger_id || 0,
                }))
                console.log(newValue?.ledger_id)
              }}
            renderInput={(params) => <TextField {...params} label="Select Ledger" variant="outlined" />}
          />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
  
          {/* Sub Ledger Selection */}
          <FormControl fullWidth>
            <InputLabel>Sub Ledger</InputLabel>
            <Select 
            name="subledger" 
            value={currentInvoice.subledgerId || ""} 
            onChange={(e)=>{

              const selectId=Number(e.target.value)
              setCurrentInvoice((prev) => ({
                ...prev,
                subledgerId:selectId || 0,
              }));
              console.log(selectId)
            }}
            MenuProps={{
              disablePortal: true,

            }}>
              
              {matchedLedger&&matchedLedger?.subledger?.length > 0 ? (
                matchedLedger.subledger.map((subled) => (
                  <MenuItem key={subled.id} value={subled.id}>
                    {subled.subLedger}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Subledger available</MenuItem>
              )}
            </Select>
          </FormControl>
          </Grid2>
          
          <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField label="Remark" fullWidth name="remark" value={currentInvoice.remark} onChange={handleInvoiceChange} />
          </Grid2>
          </Grid2>
        
  
        {/* Add Invoice Button */}
        <Box className="button-box">
        <Button variant="contained" color="primary" onClick={addInvoice} >
          Add Invoice
        </Button>
        </Box>
      </Paper>
  
      {/* Invoice Table */}
      <Box mt={4}>
        <Paper elevation={3} sx={{ overflow: "hidden", borderRadius: 2,p:2 }}>
        <TableContainer>
        <Typography variant="h6" align="center">Invoices</Typography>
          <Table>
            
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Invoice No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Vendor Name</TableCell>
                <TableCell>Basic</TableCell>
                <TableCell>Gross</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.invoices.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{invoice.invoiceNo}</TableCell>
                  <TableCell>{ invoice.date}</TableCell>

                  <TableCell>{vendorList.find((vendor)=>vendor.id===invoice.vendorId)?.vendorname }</TableCell>
                  <TableCell>{invoice.basic}</TableCell>
                  <TableCell>{invoice.gross}</TableCell>
                  <TableCell>{invoice.payment}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setFormData((prev) => ({ ...prev, invoices: prev.invoices.filter((_, i) => i !== index) }))}
                    >
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
      </Box>

      <Box mt={4}>
      <Paper elevation={3} sx={{ pt: 2, p: 3, mx: "auto"}}>
      
      <Typography variant="h6" align="center" gutterBottom>Upload Files</Typography>
      
      <TableContainer >
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Document Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedfiles.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell><img src={URL.createObjectURL(file)} alt="preview" width={50} height={50} /></TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setselectedfiles((prev) => prev.filter((_, i) => i !== index)) }
                    >
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      <input type="file" multiple onChange={handleFiles} />
      </Paper>
      </Box>
  
      {/* Generate Invoice Button */}
      <Box mt={4}>
        <Button
          onClick={handleGenerateInvoice}
          disabled={formData.invoices.length === 0}
          variant="contained"
          fullWidth
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: formData.invoices.length === 0 ? "#ccc" : "#4CAF50",
            color: "white",
            "&:hover": { backgroundColor: formData.invoices.length === 0 ? "#ccc" : "#45a049" },
            cursor: formData.invoices.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Generate Invoice
        </Button>
      </Box>
      </Paper>
      </Box>
  
  );
  
};

export default InvoiceGenerator;