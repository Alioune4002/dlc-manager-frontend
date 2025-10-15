import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Autocomplete, InputAdornment, Box } from '@mui/material';

const LossForm = ({ lossToEdit, onSave }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [customProductName, setCustomProductName] = useState('');
    const [category, setCategory] = useState(null);
    const [reason, setReason] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [lossDate, setLossDate] = useState('');

    useEffect(() => {
        axios.get('https://dlc-manager-backend.onrender.com/api/products/')
            .then(response => {
                console.log("Produits chargés :", response.data);
                setProducts(response.data);
            })
            .catch(error => console.error("Erreur lors du chargement des produits :", error));
        axios.get('https://dlc-manager-backend.onrender.com/api/categories/')
            .then(response => {
                console.log("Catégories chargées :", response.data);
                setCategories(response.data);
            })
            .catch(error => console.error("Erreur lors du chargement des catégories :", error));

        if (lossToEdit) {
            console.log("Pré-remplissage avec perte :", lossToEdit);
            setSelectedProduct(lossToEdit.product ? { id: lossToEdit.product.id, label: lossToEdit.product.name } : null);
            setCategory(lossToEdit.category ? { id: lossToEdit.category.id, name: lossToEdit.category.name } : null);
            setReason(lossToEdit.reason || '');
            setQuantity(lossToEdit.quantity.toString());
            setPrice(lossToEdit.price ? lossToEdit.price.toString() : '');
            setLossDate(lossToEdit.loss_date);
        }
    }, [lossToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Soumission du formulaire, customProductName :", customProductName);
        if (!quantity || parseInt(quantity) < 1) {
            alert('La quantité doit être au moins 1.');
            return;
        }
        const parsedPrice = price ? parseFloat(price) : null;
        if (parsedPrice !== null && (isNaN(parsedPrice) || parsedPrice < 0)) {
            alert('Le prix doit être un nombre positif ou nul.');
            return;
        }

        let productId = selectedProduct && selectedProduct.id !== 'custom' ? selectedProduct.id : null;
        if (selectedProduct && selectedProduct.id === 'custom') {
            if (!customProductName.trim()) {
                console.error("Nom du produit personnalisé vide");
                alert('Veuillez entrer un nom pour le produit personnalisé.');
                return;
            }
            console.log("Création d'un produit personnalisé :", customProductName);
            try {
                const response = await axios.post('https://dlc-manager-backend.onrender.com/api/products/', {
                    name: customProductName,
                    type: 'frais',
                    is_active: true,
                    added_date: new Date().toISOString().split('T')[0]
                });
                console.log("Produit personnalisé créé :", response.data);
                productId = response.data.id;
                setProducts([...products, response.data]);
            } catch (error) {
                console.error("Erreur lors de la création du produit personnalisé :", error.response?.data || error.message);
                alert(`Erreur lors de la création du produit personnalisé : ${JSON.stringify(error.response?.data || error.message)}`);
                return;
            }
        }

        const data = {
            product_id: productId,
            category_id: category ? category.id : null,
            reason: reason || '',
            quantity: parseInt(quantity),
            price: parsedPrice,
            loss_date: lossDate || new Date().toISOString().split('T')[0]
        };

        console.log("Données envoyées pour la perte :", data);
        try {
            let response;
            if (lossToEdit) {
                response = await axios.patch(`https://dlc-manager-backend.onrender.com/api/losses/${lossToEdit.id}/`, data);
                console.log("Perte mise à jour :", response.data);
                alert('Perte mise à jour !');
            } else {
                response = await axios.post('https://dlc-manager-backend.onrender.com/api/losses/', data);
                console.log("Perte ajoutée :", response.data);
                alert('Perte ajoutée !');
            }
            onSave();
            setSelectedProduct(null);
            setCustomProductName('');
            setCategory(null);
            setReason('');
            setQuantity('');
            setPrice('');
            setLossDate('');
        } catch (error) {
            console.error("Erreur lors de l’opération sur la perte :", error.response?.data || error.message);
            alert(`Erreur lors de l’opération sur la perte : ${JSON.stringify(error.response?.data || error.message)}`);
        }
    };

    const handleAddCategory = (inputValue) => {
        if (inputValue && !categories.find(c => c.name.toLowerCase() === inputValue.toLowerCase())) {
            console.log("Création d'une catégorie :", inputValue);
            axios.post('https://dlc-manager-backend.onrender.com/api/categories/', { name: inputValue })
                .then(response => {
                    setCategories([...categories, response.data]);
                    setCategory(response.data);
                })
                .catch(error => console.error("Erreur lors de la création de la catégorie :", error));
        }
    };

    const handleCustomProductNameChange = (e) => {
        console.log("Changement de customProductName :", e.target.value);
        setCustomProductName(e.target.value);
    };

    const productOptions = [
        { label: 'Produit personnalisé', id: 'custom' },
        ...products.map(p => ({ label: p.name, id: p.id }))
    ];

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 2,
                maxWidth: '100%',
                px: { xs: 1, sm: 0 }
            }}
        >
            <Autocomplete
                options={productOptions}
                getOptionLabel={(option) => option.label}
                value={selectedProduct}
                onChange={(e, newValue) => {
                    console.log("Changement de produit sélectionné :", newValue);
                    setSelectedProduct(newValue);
                    if (newValue?.id !== 'custom') {
                        setCustomProductName('');
                    }
                }}
                renderInput={(params) => <TextField {...params} label="Produit" />}
                fullWidth
            />
            {selectedProduct && selectedProduct.id === 'custom' && (
                <TextField
                    key={selectedProduct.id}
                    label="Nom du produit personnalisé"
                    value={customProductName}
                    onChange={handleCustomProductNameChange}
                    onBlur={() => console.log("Champ customProductName quitté, valeur :", customProductName)}
                    fullWidth
                    required
                />
            )}
            <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name}
                value={category}
                onChange={(e, newValue) => setCategory(newValue)}
                freeSolo
                onInputChange={(e, newInputValue) => {
                    if (newInputValue) {
                        handleAddCategory(newInputValue);
                    }
                }}
                renderInput={(params) => <TextField {...params} label="Catégorie" />}
                fullWidth
            />
            <TextField
                label="Raison"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                fullWidth
            />
            <TextField
                label="Quantité"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
            />
            <TextField
                label="Prix unitaire"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                }}
                fullWidth
                inputProps={{ min: 0, step: '0.01' }}
            />
            <TextField
                label="Date de perte"
                type="date"
                value={lossDate}
                onChange={(e) => setLossDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                {lossToEdit ? 'Mettre à jour la perte' : 'Ajouter Perte'}
            </Button>
        </Box>
    );
};

export default LossForm;