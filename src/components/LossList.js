import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField, Button, MenuItem, useMediaQuery, useTheme, Snackbar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LossList = () => {
    const [losses, setLosses] = useState([]);
    const [filteredLosses, setFilteredLosses] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        product_id: '',
        product_name: '',
        category_id: '',
        reason: '',
        loss_date: '',
        quantity: '',
        price: ''
    });
    const [downloadMonth, setDownloadMonth] = useState({
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString().padStart(2, '0')
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        axios.get('https://dlc-manager-backend.onrender.com/api/losses/')
            .then(response => {
                console.log("Pertes chargées :", response.data);
                setLosses(response.data);
                filterLosses(response.data, downloadMonth.year, downloadMonth.month);
            })
            .catch(error => console.error("Erreur lors du chargement des pertes :", error));

        axios.get('https://dlc-manager-backend.onrender.com/api/products/')
            .then(response => setProducts(response.data))
            .catch(error => console.error("Erreur lors du chargement des produits :", error));

        axios.get('https://dlc-manager-backend.onrender.com/api/categories/')
            .then(response => setCategories(response.data))
            .catch(error => console.error("Erreur lors du chargement des catégories :", error));
    }, []);

    const filterLosses = (lossesData, year, month) => {
        const filtered = lossesData.filter(loss => {
            const lossDate = new Date(loss.loss_date);
            const lossYear = lossDate.getFullYear().toString();
            const lossMonth = (lossDate.getMonth() + 1).toString().padStart(2, '0');
            return lossYear === year && lossMonth === month;
        });
        setFilteredLosses(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDownloadInputChange = (e) => {
        const { name, value } = e.target;
        const newDownloadMonth = { ...downloadMonth, [name]: value };
        setDownloadMonth(newDownloadMonth);
        filterLosses(losses, newDownloadMonth.year, newDownloadMonth.month);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...formData };
        if (!data.product_id) {
            delete data.product_id;
        }
        if (!data.price) {
            delete data.price;
        }
        if (data.id) {
            axios.put(`https://dlc-manager-backend.onrender.com/api/losses/${data.id}/`, data)
                .then(response => {
                    const updatedLosses = losses.map(loss => loss.id === response.data.id ? response.data : loss);
                    setLosses(updatedLosses);
                    filterLosses(updatedLosses, downloadMonth.year, downloadMonth.month);
                    resetForm();
                    setSnackbarMessage('Perte mise à jour avec succès !');
                    setOpenSnackbar(true);
                })
                .catch(error => console.error("Erreur lors de la mise à jour de la perte :", error));
        } else {
            axios.post('https://dlc-manager-backend.onrender.com/api/losses/', data)
                .then(response => {
                    const updatedLosses = [...losses, response.data];
                    setLosses(updatedLosses);
                    filterLosses(updatedLosses, downloadMonth.year, downloadMonth.month);
                    resetForm();
                    setSnackbarMessage('Perte ajoutée avec succès !');
                    setOpenSnackbar(true);
                })
                .catch(error => console.error("Erreur lors de l'ajout de la perte :", error));
        }
    };

    const handleEdit = (loss) => {
        setFormData({
            id: loss.id,
            product_id: loss.product?.id || '',
            product_name: loss.product_name || '',
            category_id: loss.category?.id || '',
            reason: loss.reason || '',
            loss_date: loss.loss_date || '',
            quantity: loss.quantity || '',
            price: loss.price || ''
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette perte ?')) {
            axios.delete(`https://dlc-manager-backend.onrender.com/api/losses/${id}/`)
                .then(() => {
                    const updatedLosses = losses.filter(loss => loss.id !== id);
                    setLosses(updatedLosses);
                    filterLosses(updatedLosses, downloadMonth.year, downloadMonth.month);
                    setSnackbarMessage('Perte supprimée avec succès !');
                    setOpenSnackbar(true);
                })
                .catch(error => console.error("Erreur lors de la suppression de la perte :", error));
        }
    };

    const handleDownloadPDF = () => {
        axios.get('https://dlc-manager-backend.onrender.com/api/download-losses-pdf/', {
            params: {
                year: downloadMonth.year,
                month: parseInt(downloadMonth.month)
            },
            responseType: 'blob'
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Pertes_${downloadMonth.year}_${downloadMonth.month}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                setSnackbarMessage('PDF téléchargé avec succès !');
                setOpenSnackbar(true);
            })
            .catch(error => {
                console.error("Erreur lors du téléchargement du PDF :", error);
                setSnackbarMessage('Erreur lors du téléchargement du PDF.');
                setOpenSnackbar(true);
            });
    };

    const resetForm = () => {
        setFormData({
            id: null,
            product_id: '',
            product_name: '',
            category_id: '',
            reason: '',
            loss_date: '',
            quantity: '',
            price: ''
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h5" gutterBottom>
                Liste des Pertes
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                    <TextField
                        select
                        label="Produit existant (optionnel)"
                        name="product_id"
                        value={formData.product_id}
                        onChange={handleInputChange}
                        sx={{ flex: 1 }}
                    >
                        <MenuItem value="">
                            <em>Aucun</em>
                        </MenuItem>
                        {products.map(product => (
                            <MenuItem key={product.id} value={product.id}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Nom du produit (si non listé)"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleInputChange}
                        sx={{ flex: 1 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mt: 2 }}>
                    <TextField
                        select
                        label="Catégorie"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        sx={{ flex: 1 }}
                    >
                        <MenuItem value="">
                            <em>Aucune</em>
                        </MenuItem>
                        {categories.map(category => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Raison"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        sx={{ flex: 1 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mt: 2 }}>
                    <TextField
                        label="Date"
                        name="loss_date"
                        type="date"
                        value={formData.loss_date}
                        onChange={handleInputChange}
                        required
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Quantité"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Prix (€)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        sx={{ flex: 1 }}
                    />
                </Box>
                <Button type="submit" variant="contained" sx={{ mt: 2, mr: 1 }}>
                    {formData.id ? 'Mettre à jour' : 'Ajouter Perte'}
                </Button>
                {formData.id && (
                    <Button variant="outlined" onClick={resetForm} sx={{ mt: 2 }}>
                        Annuler
                    </Button>
                )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 4 }}>
                <TextField
                    label="Année"
                    name="year"
                    type="number"
                    value={downloadMonth.year}
                    onChange={handleDownloadInputChange}
                    sx={{ width: isMobile ? '100%' : '150px' }}
                />
                <TextField
                    select
                    label="Mois"
                    name="month"
                    value={downloadMonth.month}
                    onChange={handleDownloadInputChange}
                    sx={{ width: isMobile ? '100%' : '150px' }}
                >
                    {[...Array(12)].map((_, i) => (
                        <MenuItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                            {new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDownloadPDF}
                    sx={{ mt: isMobile ? 2 : 0 }}
                >
                    Télécharger PDF
                </Button>
            </Box>

            {filteredLosses.length === 0 ? (
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 2 }}>
                    Pas de pertes enregistrées ce mois.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table size={isMobile ? 'small' : 'medium'}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Produit</TableCell>
                                <TableCell>Catégorie</TableCell>
                                <TableCell>Raison</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Quantité</TableCell>
                                <TableCell align="right">Prix (€)</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLosses.map(loss => (
                                <TableRow key={loss.id}>
                                    <TableCell>{loss.product ? loss.product.name : loss.product_name}</TableCell>
                                    <TableCell>{loss.category?.name || 'Aucune'}</TableCell>
                                    <TableCell>{loss.reason || 'Aucune'}</TableCell>
                                    <TableCell>{loss.loss_date}</TableCell>
                                    <TableCell align="right">{loss.quantity || 0}</TableCell>
                                    <TableCell align="right">
                                        {loss.price !== null && loss.price !== undefined ? Number(loss.price).toFixed(2) : '0.00'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleEdit(loss)} size="small">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(loss.id)} size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LossList;