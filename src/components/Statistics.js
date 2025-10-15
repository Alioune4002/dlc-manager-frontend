import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Statistics = () => {
    const [categoryStats, setCategoryStats] = useState([]);
    const [productStats, setProductStats] = useState([]);

    useEffect(() => {
        
        axios.get('https://dlc-manager-backend.onrender.com/api/losses/')
            .then(response => {
                const losses = response.data;
                const categoryData = losses.reduce((acc, loss) => {
                    const category = loss.category?.name || 'Aucune';
                    const cost = parseFloat(loss.price) || 0;
                    if (!acc[category]) {
                        acc[category] = { name: category, totalCost: 0, count: 0 };
                    }
                    acc[category].totalCost += cost;
                    acc[category].count += 1;
                    return acc;
                }, {});
                setCategoryStats(Object.values(categoryData));
            })
            .catch(error => console.error("Erreur lors du chargement des pertes :", error));

        
        axios.get('https://dlc-manager-backend.onrender.com/api/losses-by-product/')
            .then(response => {
                setProductStats(response.data);
            })
            .catch(error => console.error("Erreur lors du chargement des stats par produit :", error));
    }, []);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Statistiques des Pertes
            </Typography>

            
            <Typography variant="h6" gutterBottom>
                Coût des Pertes par Catégorie
            </Typography>
            <BarChart
                width={600}
                height={300}
                data={categoryStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalCost" fill="#8884d8" name="Coût Total (€)" />
            </BarChart>

            
            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Catégorie</TableCell>
                            <TableCell align="right">Nombre de Pertes</TableCell>
                            <TableCell align="right">Coût Total (€)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoryStats.map((stat) => (
                            <TableRow key={stat.name}>
                                <TableCell>{stat.name}</TableCell>
                                <TableCell align="right">{stat.count}</TableCell>
                                <TableCell align="right">{stat.totalCost.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Pertes par Produit (Mois Courant)
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produit</TableCell>
                            <TableCell align="right">Nombre de Pertes</TableCell>
                            <TableCell align="right">Coût Total (€)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productStats.map((stat, index) => (
                            <TableRow key={index}>
                                <TableCell>{stat.product_name}</TableCell>
                                <TableCell align="right">{stat.total_losses}</TableCell>
                                <TableCell align="right">{stat.total_cost.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Statistics;