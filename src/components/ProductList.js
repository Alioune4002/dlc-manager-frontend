import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText } from '@mui/material';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('https://dlc-manager-backend.onrender.com/api/products/?is_active=true')
            .then(response => setProducts(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <List>
            {products.length > 0 ? (
                products.map(product => (
                    <ListItem key={product.id}>
                        <ListItemText
                            primary={product.name}
                            secondary={`DLC: ${product.dlc || 'N/A'} | Type: ${product.type}`}
                        />
                    </ListItem>
                ))
            ) : (
                <ListItem>
                    <ListItemText primary="Aucun produit actif" />
                </ListItem>
            )}
        </List>
    );
};

export default ProductList;