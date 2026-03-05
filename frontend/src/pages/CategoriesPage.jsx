import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ title: '', image: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Hiba a kategóriák betöltésekor:', error);
    }
  };

  const handleOpen = (category = null) => {
    if (category) {
      setEditingCategory(category.id);
      setFormData({ title: category.title, image: category.image });
    } else {
      setEditingCategory(null);
      setFormData({ title: '', image: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setFormData({ title: '', image: '' });
  };

  const handleSave = async () => {
    try {
      if (editingCategory !== null) {
        await axios.put(`${API_URL}/categories/${editingCategory}`, formData);
      } else {
        await axios.post(`${API_URL}/categories`, formData);
      }
      handleClose();
      fetchCategories();
    } catch (error) {
      console.error('Hiba a kategória mentésekor:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) {
      try {
        await axios.delete(`${API_URL}/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Hiba a kategória törlésekor:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Kategóriák</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Új kategória
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cím</TableCell>
              <TableCell>Kép</TableCell>
              <TableCell>Imák száma</TableCell>
              <TableCell>Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.title}</TableCell>
                <TableCell>{category.image}</TableCell>
                <TableCell>{category.prayerCount}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(category)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCategory !== null ? 'Kategória szerkesztése' : 'Új kategória'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cím"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Kép fájlnév"
            fullWidth
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Mégse</Button>
          <Button onClick={handleSave} variant="contained">Mentés</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
