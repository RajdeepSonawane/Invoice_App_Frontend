import React, { useEffect, useMemo, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { format} from "date-fns";

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
  itemId?:number;
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

interface img{
  id:number,
  filename:string,
  mimetype:string,
  file_url:string
}

const InvoiceEdit: React.FC = () => {
  
  const [formData, setFormData] = useState({
    college: "",
    billNo:0,
    date:"",
    AccountNumber: 0,
    AmountTransfer: 0,
    invoices: [] as Invoice[],
    ImageFiles:[] as img[],
    status:"",
    createdBy:""
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

  const [selectednewinvoices,  setselectednewinvoices]=useState<Invoice[] | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [selectedCollege, setSelectedCollege] = useState<string | null>("");
  const token = localStorage.getItem("token");
  const [collegeList, setCollegeList] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [matchCollege, setMatchCollege] = useState<College | null>(null);
  const navigate = useNavigate();

 
  const { id } = useParams(); // Get invoice ID from URL
  // Fetch Invoice Data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
       
        const response = await axios.get(`${API_BASE_URL}/invoice/${id}`);
       
        setFormData({
          ...response.data,
          date: response.data.date ? format(new Date(response.data.date), "yyyy-MM-dd") : "",
        });
       
      } catch(error){
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoice();
  }, [id]);

 
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

      useEffect(() => {
        if (formData.college) {
          setSelectedCollege(formData.college); 
        }
      }, [formData.college]);

  useEffect(() => {
    if (selectedCollege && collegeList.length > 0) {
      const matched = collegeList.find(clg => clg.collegename === selectedCollege) || null;
      setMatchCollege(matched);
    }
    }, [selectedCollege, collegeList]);

 
// Log the updated currentInvoice separately
useEffect(() => {
  console.log("Updated currentInvoice:", currentInvoice);
}, [currentInvoice]);



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
    console.log("matched",matched)
  }, [selectedLedger, LedgerList]);

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCurrentInvoice(prevState => ({
      ...prevState,
      [name]: ["advance", "basic", "gross", "taxAmount", "tds", "payment"].includes(name) ? Number(value) : value,
    }));
    
  };
  
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files) {
      const newFiles =Array.from(e.target.files);
      setselectedfiles((prevFiles) => [...prevFiles, ...newFiles]);;
    }
  
  }

  const handleRemoveExistingFile = async (id: number) => {
    try {
      if (!window.confirm("Are you sure you want to delete  this file?")) {
        return; 
      }
  
      // Send request to backend to delete file
      const response=await axios.put(`${API_BASE_URL}/invoice/invoice-file-delete/${id}`);
      
      if (response.status === 201) {
        console.log("invoice file deleted successfully")
        alert("File deleted successfully")
        
        setFormData((prev)=>({
          ...prev,
          ImageFiles:prev.ImageFiles.filter((img)=>img.id !==id)
        }))
      }
    }catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setselectedfiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  
  const addInvoice = async () => {
    try {
      
      const response = await axios.post(`${API_BASE_URL}/invoice/calculate`, currentInvoice);
  
      
  
      if (response.status === 200) {
        const Inv=response.data;

        // Check if the invoice exists in formData (Editing existing invoice)
        const isExistingInvoice = formData.invoices.find((invoice) => invoice.invoiceNo === Inv.invoiceNo);

        console.log("isexistinvoice",isExistingInvoice)
        if (isExistingInvoice) {
          const id=isExistingInvoice.itemId
            // Update the existing invoice in formData
            const result=await axios.put(`${API_BASE_URL}/invoice/invoice-record-update/${id}`,Inv);

            if (result.status === 201) {

              console.log("invoice item updated")

            setFormData((prevFormData) => ({
                ...prevFormData,
                invoices: prevFormData.invoices.map((invoice) =>
                    invoice.invoiceNo === Inv.invoiceNo ? Inv : invoice
                ),
            }));
          }
        } else {
            // Add new invoice to selectednewinvoices
            setselectednewinvoices((prev) => [...(prev||[]), Inv]);
        }

      

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
        setSelectedLedger({
          ledger_id:0,
          ledgername: '',
          subledger:[]
        });
      
      }
    } catch (error) {
      console.error("Error adding invoice");
    }
  };

  const  handleInvoiceDelete=async(id:number)=>{

    try{
    if (!window.confirm("Are you sure you want to delete  this invoice?")) {
      return; 
    }

    const response=await axios.put(`${API_BASE_URL}/invoice/invoice-record-delete/${id}`);
    if (response.status===201){
      alert("Invoice record Deleted Successfully");
      setFormData((prev) => ({
        ...prev, 
        invoices: prev.invoices.filter((inv) => inv.itemId !==id ) }))
      
      }
  }catch(error){
    console.error("Error deleting invoice",error);
  }
  }

 

  const handleUpdateInvoice = async () => {
    try {

      setLoading(true);

      const formdata = new FormData();

  // Merge existing invoices with selectednewinvoice
  const mergedInvoices = [
    ...(Array.isArray(formData.invoices) ? formData.invoices : []),
    ...(Array.isArray(selectednewinvoices) ? selectednewinvoices : []),
  ];
      

  
      
      /// Ensure invoices is always an array
    const invoiceData = {
      college: formData.college || "",
      date: formData.date || "",
      billNo:formData.billNo || 0,
      createdBy:formData.createdBy|| "",
      AccountNumberId: formData.AccountNumber || 0,
      AmountTransfer: formData.AmountTransfer || 0,
      invoices:mergedInvoices,
      
    };
      // Append full invoice data as JSON
    formdata.append("invoice", JSON.stringify(invoiceData));
       // Append files
    selectedfiles.forEach((file) => {
      formdata.append("ImageFiles", file);
    });

     
     
      const response = await axios.put(`${API_BASE_URL}/invoice/invoice-edit/${id}`,
       formdata,
       {
        headers: {
            Authorization: `Bearer ${token}`,  // Send token in headers
        }
      });
      if (response.status === 200) {
        alert("Invoice updated successfully!");
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
        setFormData({ college: "", AccountNumber: 0, AmountTransfer:0 , invoices: [],ImageFiles:[],status:"",date:"" ,billNo:0,createdBy:""});
        navigate("/invoice-list");
      }
    } catch (error) {
      console.error("Error updating invoice", error);
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
        Update Invoice
      </Typography>
  
      {/* College Selection */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 1 }}>
        <TextField
       
          value={formData.college}
          
          disabled
          
          sx={{ width: 300 }}
        />
      </Box>
      <Divider/>

      <Box sx={{ display:"flex" , justifyContent:"end",p:2}}>
      <TextField
         
          label="Date"
          type="date"
          
          value={formData.date}
          disabled
          
     
        />
      </Box>
  
      {/* Invoice Form */}
      <Grid2 container spacing={2} >
      
      <Grid2 size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Account Number</InputLabel>
          <Select
            value={formData.AccountNumber||""}
            onChange={(e) => {
              
              const selectedId = Number(e.target.value); // Store the account ID

               setFormData((prev) => ({
                    ...prev,
                    AccountNumber: selectedId, // Store only the ID in formData
                  }));
                 console.log(selectedId)
                }}
            MenuProps={{
              disablePortal: true, 
            }}
          >
            {matchCollege?.accountNumbers && matchCollege.accountNumbers.length > 0 ? (
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
          value={formData.AmountTransfer||""}
          onChange={(e) => setFormData((prev) => ({ ...prev, AmountTransfer: Number(e.target.value)}))}
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
          value={currentInvoice.invoiceNo || ""} 
          onChange={handleInvoiceChange} 
          />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField 
          label="Date" 
          type="date" 
          fullWidth 
          name="date" 
          value={currentInvoice.date || ""} 
          onChange={handleInvoiceChange} 
          InputLabelProps={{ shrink: true }} 
          />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Autocomplete
              fullWidth
              options={vendorList }
              getOptionLabel={(option) => option.vendorname}
              value={vendorList.find((vendor) => vendor.id === currentInvoice.vendorId ) || null}
              onChange={(_e, newValue) => {
                
                setCurrentInvoice((prev) => ({
                  ...prev,
                  vendorId:newValue?.id || 0,
                }));
                console.log(newValue?.id)
     
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
          value={currentInvoice.advance ||  0} 
          onChange={handleInvoiceChange} 
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField 
          label="Basic" 
          fullWidth 
          name="basic" 
          value={currentInvoice.basic  ||""} 
          onChange={handleInvoiceChange} 
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField 
          label="Gross" 
          fullWidth 
          name="gross" 
          value={currentInvoice.gross || ""} 
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
             getOptionLabel={(option) => option.ledgername||"" }
             value={LedgerList.find((led) => led.ledgername === selectedLedger?.ledgername ) || null}
             onChange={(_e, newValue) => {
                
                setSelectedLedger(newValue);
                setCurrentInvoice((prev) => ({
                  ...prev,
                  ledgerId: newValue?.ledger_id || 0,
                }))
                
                console.log("ledgerId",newValue?.ledger_id)
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
            value={currentInvoice.subledgerId ||""} 
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
          <TextField 
          label="Remark" 
          fullWidth 
          name="remark" 
          value={currentInvoice.remark|| ""} 
          onChange={handleInvoiceChange} />
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
              {formData.invoices  && formData.invoices.length >0 ? (
              formData.invoices.map((invoice) => (
                <TableRow key={invoice.itemId}>
                 
                  <TableCell>{invoice.invoiceNo}</TableCell>
                   <TableCell>{ format(new Date(invoice.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{vendorList.find((vendor)=>vendor.id===invoice.vendorId)?.vendorname }</TableCell>
                  <TableCell>{invoice.basic}</TableCell>
                  <TableCell>{invoice.gross}</TableCell>
                  <TableCell>{invoice.payment}</TableCell>
                  <TableCell>
                   
              <Button
                variant="contained"
                color="secondary"
                sx={{ ml: 1 }}
                onClick={() => handleInvoiceDelete(Number(invoice.itemId))}
              >
                X
              </Button>
                  </TableCell>
                </TableRow>
              ))
            ):(<TableRow>
              <TableCell colSpan={3} align="center">
              No previous invoice uploaded.
              </TableCell>
            </TableRow>)}
            {(selectednewinvoices?? []).map((inv,index:number)=>(
              <TableRow key={index}>
        
              <TableCell>{inv.invoiceNo}</TableCell>
               <TableCell>{ format(new Date(inv.date), "dd/MM/yyyy")}</TableCell>
              <TableCell>{vendorList.find((vendor)=>vendor.id===inv.vendorId)?.vendorname }</TableCell>
              <TableCell>{inv.basic}</TableCell>
              <TableCell>{inv.gross}</TableCell>
              <TableCell>{inv.payment}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>  setselectednewinvoices((prev) => prev?.filter((_, i) => i !== index) || [])}
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
            {formData.ImageFiles && formData.ImageFiles.length > 0 ? (
              formData.ImageFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell>
                      <img src={file.file_url} alt="preview" width={50} height={50} />
                    </TableCell>
                  
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() =>handleRemoveExistingFile(file.id)} 
                    >
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ):(
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No previous files uploaded.
                </TableCell>
              </TableRow>
            )}
            {selectedfiles.length > 0 &&
        selectedfiles.map((file: File, index: number) => (
          <TableRow key={`new-${index}`}>
            <TableCell>{file.name}</TableCell>
            <TableCell>
              <img src={URL.createObjectURL(file)} alt="preview" width={50} height={50} />
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveNewFile(index)}
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
          onClick={handleUpdateInvoice}
          disabled= {(formData.invoices.length === 0 || !formData.invoices) && 
                      (selectednewinvoices?.length === 0 || !selectednewinvoices)}
          variant="contained"
          fullWidth
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor:(formData.invoices.length === 0 && selectednewinvoices?.length === 0) ? "#ccc" : "#4CAF50",
            color: "white",
              "&:hover": { backgroundColor: (formData.invoices.length === 0 && selectednewinvoices?.length === 0) ? "#ccc" : "#45a049" },
              cursor: (formData.invoices.length === 0 && selectednewinvoices?.length === 0) ? "not-allowed" : "pointer",
            }}
        >
          Update Invoice
        </Button>
      </Box>
      </Paper>
      </Box>
  
  );
  
};

export default InvoiceEdit;