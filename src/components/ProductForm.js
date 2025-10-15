import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [dlc, setDlc] = useState('');
    const [type, setType] = useState('frais');

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { name, type };
        if (type !== 'non_perissable') {
            data.dlc = dlc;
        }
        axios.post('http://localhost:8000/api/products/', data)
            .then(response => {
                alert('Produit ajouté !');
                setName('');
                setDlc('');
                setType('frais');
            })
            .catch(error => {
                console.error(error);
                alert('Erreur lors de l’ajout du produit.');
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
                label="Nom du produit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
            />
            <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    label="Type"
                >
                    <MenuItem value="frais">Frais</MenuItem>
                    <MenuItem value="sec">Sec</MenuItem>
                    <MenuItem value="non_perissable">Non Périssable</MenuItem>
                </Select>
            </FormControl>
            {type !== 'non_perissable' && (
                <TextField
                    label="DLC"
                    type="date"
                    value={dlc}
                    onChange={(e) => setDlc(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required={type === 'frais'}
                />
            )}
            <Button type="submit" variant="contained" color="primary">
                Ajouter
            </Button>
        </form>
    );
};

export default ProductForm;
