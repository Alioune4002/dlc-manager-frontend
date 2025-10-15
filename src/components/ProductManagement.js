import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, IconButton, Typography, Box, Stack, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', type: 'frais', dlc: '', is_active: true });
    const [newProduct, setNewProduct] = useState({ name: '', type: 'frais', dlc: '' });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:8000/api/products/')
            .then(response => {
                console.log("Produits chargés :", response.data);
                setProducts(response.data);
            })
            .catch(error => console.error("Erreur lors du chargement des produits :", error));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        console.log("Ajout du produit :", newProduct);
        try {
            await axios.post('http://localhost:8000/api/products/', {
                ...newProduct,
                is_active: true,
                added_date: new Date().toISOString().split('T')[0]
            });
            console.log("Produit ajouté");
            setNewProduct({ name: '', type: 'frais', dlc: '' });
            fetchProducts();
            alert('Produit ajouté !');
        } catch (error) {
            console.error("Erreur lors de l’ajout du produit :", error.response?.data || error.message);
            alert(`Erreur lors de l’ajout du produit : ${JSON.stringify(error.response?.data || error.message)}`);
        }
    };

    const handleEdit = (product) => {
        console.log("Édition du produit :", product);
        setEditingProduct(product.id);
        setFormData({
            name: product.name,
            type: product.type,
            dlc: product.dlc || '',
            is_active: product.is_active
        });
    };

    const handleCancel = () => {
        setEditingProduct(null);
        setFormData({ name: '', type: 'frais', dlc: '', is_active: true });
    };

    const handleSave = async (productId) => {
        console.log("Sauvegarde du produit ID :", productId, "Données :", formData);
        try {
            await axios.patch(`http://localhost:8000/api/products/${productId}/`, formData);
            console.log("Produit mis à jour");
            setEditingProduct(null);
            setFormData({ name: '', type: 'frais', dlc: '', is_active: true });
            fetchProducts();
            alert('Produit mis à jour !');
        } catch (error) {
            console.error("Erreur lors de la mise à jour du produit :", error.response?.data || error.message);
            alert(`Erreur lors de la mise à jour du produit : ${JSON.stringify(error.response?.data || error.message)}`);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
            console.log("Suppression du produit ID :", productId);
            try {
                await axios.delete(`http://localhost:8000/api/products/${productId}/`);
                console.log("Produit supprimé");
                fetchProducts();
                alert('Produit supprimé !');
            } catch (error) {
                console.error("Erreur lors de la suppression du produit :", error.response?.data || error.message);
                alert(`Erreur lors de la suppression du produit : ${JSON.stringify(error.response?.data || error.message)}`);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Changement de champ :", name, value);
        setFormData({ ...formData, [name]: value });
    };

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        console.log("Changement de champ nouveau produit :", name, value);
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        console.log("Changement de is_active :", e.target.checked);
        setFormData({ ...formData, is_active: e.target.checked });
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h5" gutterBottom>
                Gestion des Produits
            </Typography>
            <Box
                component="form"
                onSubmit={handleAddProduct}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}
            >
                <TextField
                    label="Nom du produit"
                    name="name"
                    value={newProduct.name}
                    onChange={handleNewProductChange}
                    fullWidth
                    required
                />
                <Select
                    label="Type"
                    name="type"
                    value={newProduct.type}
                    onChange={handleNewProductChange}
                    fullWidth
                >
                    <MenuItem value="frais">Frais</MenuItem>
                    <MenuItem value="non_perissable">Non périssable</MenuItem>
                </Select>
                <TextField
                    label="DLC"
                    name="dlc"
                    type="date"
                    value={newProduct.dlc}
                    onChange={handleNewProductChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Ajouter Produit
                </Button>
            </Box>
            {isMobile ? (
                <Stack spacing={2}>
                    {products.map(product => (
                        <Card key={product.id}>
                            <CardContent>
                                {editingProduct === product.id ? (
                                    <>
                                        <TextField
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            fullWidth
                                            label="Nom"
                                            sx={{ mb: 1 }}
                                        />
                                        <Select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{ mb: 1 }}
                                        >
                                            <MenuItem value="frais">Frais</MenuItem>
                                            <MenuItem value="non_perissable">Non périssable</MenuItem>
                                        </Select>
                                        <TextField
                                            name="dlc"
                                            type="date"
                                            value={formData.dlc}
                                            onChange={handleInputChange}
                                            fullWidth
                                            label="DLC"
                                            sx={{ mb: 1 }}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={handleCheckboxChange}
                                            />
                                            <Typography sx={{ ml: 1 }}>Actif</Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="contained"
                                                startIcon={<SaveIcon />}
                                                onClick={() => handleSave(product.id)}
                                            >
                                                Sauvegarder
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<CancelIcon />}
                                                onClick={handleCancel}
                                            >
                                                Annuler
                                            </Button>
                                        </Stack>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="subtitle1">
                                            Nom: {product.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            Type: {product.type}
                                        </Typography>
                                        <Typography variant="body2">
                                            DLC: {product.dlc || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2">
                                            Actif: {product.is_active ? 'Oui' : 'Non'}
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(product)}
                                                title="Éditer"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(product.id)}
                                                title="Supprimer"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>DLC</TableCell>
                                <TableCell>Actif</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map(product => (
                                <TableRow key={product.id}>
                                    {editingProduct === product.id ? (
                                        <>
                                            <TableCell>
                                                <TextField
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                >
                                                    <MenuItem value="frais">Frais</MenuItem>
                                                    <MenuItem value="non_perissable">Non périssable</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="dlc"
                                                    type="date"
                                                    value={formData.dlc}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_active}
                                                    onChange={handleCheckboxChange}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleSave(product.id)} title="Sauvegarder">
                                                    <SaveIcon />
                                                </IconButton>
                                                <IconButton onClick={handleCancel} title="Annuler">
                                                    <CancelIcon />
                                                </IconButton>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.type}</TableCell>
                                            <TableCell>{product.dlc || 'N/A'}</TableCell>
                                            <TableCell>{product.is_active ? 'Oui' : 'Non'}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEdit(product)} title="Éditer">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(product.id)} title="Supprimer">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default ProductManagement;