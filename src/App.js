import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LossList from './components/LossList';
import ProductManagement from './components/ProductManagement';
import Reminders from './components/Reminders';
import Statistics from './components/Statistics';

const App = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const navItems = [
        { text: 'Pertes', path: '/losses' },
        { text: 'Produits', path: '/products' },
        { text: 'Rappels', path: '/reminders' },
        { text: 'Statistiques', path: '/statistics' },
    ];

    const drawer = (
        <Box sx={{ width: 250 }} onClick={toggleDrawer}>
            <List>
                {navItems.map((item) => (
                    <ListItem button key={item.text} component="a" href={item.path}>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Router>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        {isMobile && (
                            <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            DLC Manager
                        </Typography>
                        {!isMobile && navItems.map((item) => (
                            <Button key={item.text} color="inherit" href={item.path}>
                                {item.text}
                            </Button>
                        ))}
                    </Toolbar>
                </AppBar>
                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                    {drawer}
                </Drawer>
                <Box sx={{ p: { xs: 1, sm: 2 } }}>
                    <Routes>
                        <Route path="/" element={<LossList />} />
                        <Route path="/losses" element={<LossList />} />
                        <Route path="/products" element={<ProductManagement />} />
                        <Route path="/reminders" element={<Reminders />} />
                        <Route path="/statistics" element={<Statistics />} />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
};

export default App;