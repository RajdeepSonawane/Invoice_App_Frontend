import React from "react";
import { Box, Typography } from "@mui/material";
//////
const Footer: React.FC = () => {
    return (
        <Box sx={{ bgcolor: "#f8f9fa", textAlign: "center",justifyContent:"flex-end", mt: 10 }}>
            <Typography variant="caption" color="textSecondary">
                © 2025, made with 💖 by <span style={{ color: "purple" }}>TTD Logistics</span> for a better web.
            </Typography>
        </Box>
    );
};

export default Footer;
