import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Reminders = () => {
    const [reminders, setReminders] = useState({ reduce_tomorrow: [], withdraw_today: [] });

    useEffect(() => {
        axios.get('https://dlc-manager-backend.onrender.com/api/reminders/')
            .then(response => {
                console.log("Rappels chargés :", response.data);
                const data = response.data || {};
                setReminders({
                    reduce_tomorrow: Array.isArray(data.reduce_tomorrow) ? data.reduce_tomorrow : [],
                    withdraw_today: Array.isArray(data.withdraw_today) ? data.withdraw_today : []
                });
            })
            .catch(error => {
                console.error("Erreur lors du chargement des rappels :", error);
            });
    }, []);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Rappels
            </Typography>

            
            <Typography variant="h6" gutterBottom>
                Produits à réduire à -30% (demain)
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produit</TableCell>
                            <TableCell>DLC</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reminders.reduce_tomorrow.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.dlc}</TableCell>
                                <TableCell>{item.action}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            
            <Typography variant="h6" gutterBottom>
                Produits à retirer ce soir (aujourd'hui)
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produit</TableCell>
                            <TableCell>DLC</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reminders.withdraw_today.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.dlc}</TableCell>
                                <TableCell>{item.action}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Reminders;