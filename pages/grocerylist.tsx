'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ItemProps {
  name: string;
}

function GroceryList() {
  const [items, setItems] = useState([] as ItemProps[]);
  const [itemInput, setItemInput] = useState('');

  useEffect(() => {
    // Fetch items from the API
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => {
        setItems(data)
      });
  }, []);

  const handleAddItem = () => {
    if (itemInput.trim()) {
      fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: itemInput })
      })
        .then((res) => res.json())
        .then((data) => {
          setItems([...items, data]);
          setItemInput('');
        });
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((item, i) => i !== index));
  };

  return (
    <Box sx={{ width: '80%', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h1>Grocery List</h1>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} sx={{ padding: '10px' }}>
            <ListItemText primary={item.name} />
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <TextField
          label="Add item"
          value={itemInput}
          onChange={(e) => setItemInput(e.target.value)}
          sx={{ width: '70%', color: 'white', '& .MuiInputBase-input': { backgroundColor: '#333', color: 'black' } }}
        />
        <Button variant="contained" color="primary" onClick={handleAddItem} sx={{ marginLeft: '20px' }}>
          Add
        </Button>
      </Box>
    </Box>
  );
}

export default GroceryList;