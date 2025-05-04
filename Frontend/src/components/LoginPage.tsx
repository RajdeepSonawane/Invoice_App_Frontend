import React, { useState} from "react";
import { Button, TextField, Box, Typography, Container, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";



////

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string |null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token} = response.data;

  

      if (token) {
    
        login(token); // Update AuthContext
        navigate("/"); // Default page 
      
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }};

  

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;

