import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Drawer,
    Typography,
    Collapse,
    Toolbar,
    AppBar,
    IconButton,
    Divider,
    ListItemButton,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ListAltIcon from "@mui/icons-material/ListAlt";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import SchoolIcon from "@mui/icons-material/School";
import StoreIcon from "@mui/icons-material/Store";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box } from "@mui/system";
import logo from '../assets/Lord_V_Services.svg';
import { useAuth } from "../AuthContext";

// Define types for items inside collapsible sections
interface SidebarItem {
    text: string;
    path: string;
    icon: React.ReactNode;
}

// Define types for the collapsible section props
interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    items: SidebarItem[];
}
////

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, items }) => {
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
   
    

    const isActive = (path: string) => location.pathname=== path;

    return (
        <>
            <ListItem onClick={() => setOpen(!open)} sx={{ cursor: "pointer" }}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {items.map(({ text, path, icon: ItemIcon }) => (
                        <ListItemButton
                            key={text}
                            selected={isActive(path)}
                            sx={{ 
                                pl: 4, 
                                cursor: "pointer",
                                bgcolor: isActive(path) ? "burlywood" : "transparent", // 🔥 Highlight Active
                                color: isActive(path) ? "white" : "inherit", //
                                "&:hover": { bgcolor: "cornsilk" } 
                            }}
                            onClick={() => navigate(path)
                                
                            }
                            
                        >
                            <ListItemIcon>{ItemIcon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
        </>
    );
};

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ }) => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const { logout } = useAuth();
    const { user } = useAuth();
    const navigate = useNavigate();
    return (
        
             <Box sx={{ display: "flex" }}>
         {/* Top Navbar */}
         <AppBar position="fixed"  sx={{ bgcolor: "brown", display: "flex", justifyContent: "center", alignItems: "center", color: "burlywood",zIndex: 1201 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "center", minWidth: "100%" }}>
                    <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ ml:2, display: { xs: "block", sm: "none" } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h2"  noWrap 
    sx={{ 
        flexGrow: 1, 
        textAlign: "center", 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis",
        fontSize: { xs: "1rem", sm: "1.5rem" }
         // Prevents text from breaking into two lines
      }}>
                        Invoice Management System 
                    </Typography>
    <IconButton
      edge="end"
      onClick={logout}
      sx={{ mr: 2 }}
    >
      <LogoutIcon sx={{ color: "burlywood" }} />
    </IconButton>
                   
                </Toolbar>
                
            </AppBar>

        <Drawer
           
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            variant="temporary" 
            sx={{height: "100vh",
                width: 260,
                    flexShrink: 0,
                ["& .MuiDrawer-paper"]: { width: 260,boxSizing: "border-box",top:56,height: "calc(100vh - 56px)" },
                display: { xs: "block", sm: "none" }, // Sidebar only appears when toggled on mobile
                overflowY:"auto"
            }}
        >   
             <Box sx={{ width: 260 }} role="presentation" onClick={() => setDrawerOpen(true)}>
             <Box sx={{ display: 'flex', alignItems: 'center', p: 2, cursor: "pointer"  }} onClick={() => navigate("/")}>
        <img 
            src={logo}
            alt="Logo" 
            style={{ width: '50px', height: '30px', marginBottom: '10px' }} 
        />
                <Typography variant="h6" >Lord V Services</Typography>
                </Box>
            
             <Divider/>
            <List>
            {user?.role == "Super Admin" && (
                <CollapsibleSection
                    title="Employee"
                    icon={<WorkIcon />}
                    items={[
                        { text: "Add Employee", path: "/add-employee", icon: <PersonAddIcon /> },
                        { text: "Employee List", path: "/employee-list", icon: <ListAltIcon /> },
                    ]}
                />)}
                <CollapsibleSection
                    title="Invoices"
                    icon={<DescriptionIcon />}
                    items={[
                        { text: "Add Invoice", path: "/add-invoice", icon: <PersonAddIcon /> },
                        { text: "View Invoices", path: "/invoice-list", icon: <ListAltIcon /> },
                        { text: "Update Invoices", path: "/invoice-update", icon: <ListAltIcon /> },
                        { text: "Invoice Summary", path: "/invoice-summary", icon: <ListAltIcon /> }
                    ]}
                />
                <CollapsibleSection
                    title="College"
                    icon={<SchoolIcon />}
                    items={[
                        ...(user?.role == "Super Admin" ?[{ text: "Add College", path: "/add-college", icon: <PersonAddIcon /> }] : []),
                        { text: "View College", path: "/college-list", icon: <ListAltIcon /> },
                    ]}
                />
                <CollapsibleSection
                    title="Vendor"
                    icon={<StoreIcon />}
                    items={[
                        ...(user?.role == "Super Admin" ?[{ text: "Add Vendor", path: "/add-vendor", icon: <PersonAddIcon /> }] : []),
                        { text: "View Vendor", path: "/vendor-list", icon: <ListAltIcon /> },
                    ]}
                />
                 <CollapsibleSection
                    title="Tds"
                    icon={<StoreIcon />}
                    items={[
                        ...(user?.role == "Super Admin" ?[{ text: "Add Tds", path: "/add-tds", icon: <PersonAddIcon /> }] : []),
                        { text: "View Tds", path: "/tds-list", icon: <ListAltIcon /> },
                    ]}
                />
                
                <CollapsibleSection
                    title="Ledger"
                    icon={<StoreIcon />}
                    items={[
                        ...(user?.role == "Super Admin" ?[{ text: "Add Ledger", path: "/add-ledger", icon: <PersonAddIcon /> }] : []),
                        { text: "View Ledger", path: "/ledger-list", icon: <ListAltIcon /> },
                    ]}
                />
            </List>
            </Box>
        </Drawer>

        {/* Sidebar for larger screens (desktop view) */}
        <Drawer
                anchor="left"
                open={true}
                variant="permanent"
                sx={{
                    height: "100vh",
                    width: 260,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: 260, boxSizing: "border-box", top: 63,height: "calc(100vh - 63px)" },
                    display: { xs: "none", sm: "block" },
                    overflowY:"auto"
                }}
            >
                <Box sx={{ width: 260 }} role="presentation">
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, cursor: "pointer"  }} onClick={() => navigate("/")}>
        <img 
            src={logo}
            alt="Logo" 
            style={{ width: '40px', height: '30px', marginBottom: '8px' }} 
        />
                <Typography variant="h6" >Lord V Services</Typography>
                </Box>
                <Divider/>
                    <List>
                    {user?.role == "Super Admin" && (
                        <CollapsibleSection
                            title="Employee"
                            icon={<WorkIcon />}
                            items={[
                                { text: "Add Employee", path: "/add-employee", icon: <PersonAddIcon /> },
                                { text: "Employee List", path: "/employee-list", icon: <ListAltIcon /> },
                            ]}
                        />)}
                        <CollapsibleSection
                            title="Invoices"
                            icon={<DescriptionIcon />}
                            items={[
                                { text: "Add Invoice", path: "/add-invoice", icon: <PersonAddIcon /> },
                                { text: "View Invoices", path: "/invoice-list", icon: <ListAltIcon /> },
                                { text: "Update Invoices", path: "/invoice-update", icon: <ListAltIcon /> },
                                { text: "Invoice Summary", path: "/invoice-summary", icon: <ListAltIcon /> },
                            ]}
                        />
                         <CollapsibleSection
                    title="College"
                    icon={<SchoolIcon />}
                    items={[
                        ...(user?.role == "Super Admin" ? [ { text: "Add College", path: "/add-college", icon: <PersonAddIcon /> }] : []),
                        { text: "View College", path: "/college-list", icon: <ListAltIcon /> },
                    ]}
                />
                <CollapsibleSection
                    title="Vendor"
                    icon={<StoreIcon />}
                    items={[
                        ...(user?.role == "Super Admin" ? [ { text: "Add Vendor", path: "/add-vendor", icon: <PersonAddIcon /> }] : []),
                        { text: "View Vendor", path: "/vendor-list", icon: <ListAltIcon /> },
                    ]}
                />

                <CollapsibleSection
                    title="Tds"
                    icon={<StoreIcon />}
                    items={[
                        ...(user?.role == "Super Admin" ?[{ text: "Add Tds", path: "/add-tds", icon: <PersonAddIcon /> }] : []),
                        { text: "View Tds", path: "/tds-list", icon: <ListAltIcon /> },
                    ]}
                />
                
                <CollapsibleSection
                    title="Ledger"
                    icon={<StoreIcon />}
                    items={[
                        ...(user?.role == "Super Admin" ?[{ text: "Add Ledger", path: "/add-ledger", icon: <PersonAddIcon /> }] : []),
                        { text: "View Ledger", path: "/ledger-list", icon: <ListAltIcon /> },
                    ]}
                />
                    </List>
                </Box>
            </Drawer>
            </Box>
        
    );
};

export default Sidebar;
