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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

export default function PrayersPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [prayers, setPrayers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    voice_options: [],
    minTimeInMinutes: 15,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory !== '') {
      fetchPrayers(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].id);
      }
    } catch (error) {
      console.error('Hiba a kategóriák betöltésekor:', error);
    }
  };

  const fetchPrayers = async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/prayers/category/${categoryId}`);
      setPrayers(response.data);
    } catch (error) {
      console.error('Hiba az imák betöltésekor:', error);
    }
  };

  const handleOpen = (prayer = null) => {
    if (prayer) {
      setEditingPrayer(prayer.id);
      setFormData({
        title: prayer.title,
        description: prayer.description || '',
        image: prayer.image || '',
        voice_options: prayer.voice_options || [],
        minTimeInMinutes: prayer.minTimeInMinutes || 15,
      });
    } else {
      setEditingPrayer(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        voice_options: [],
        minTimeInMinutes: 15,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPrayer(null);
  };

  const handleSave = async () => {
    try {
      if (editingPrayer !== null) {
        await axios.put(`${API_URL}/prayers/${editingPrayer}`, formData);
      } else {
        await axios.post(`${API_URL}/prayers/category/${selectedCategory}`, formData);
      }
      handleClose();
      fetchPrayers(selectedCategory);
    } catch (error) {
      console.error('Hiba az ima mentésekor:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt az imát?')) {
      try {
        await axios.delete(`${API_URL}/prayers/${id}`);
        fetchPrayers(selectedCategory);
      } catch (error) {
        console.error('Hiba az ima törlésekor:', error);
      }
    }
  };

  const handleVoiceOptionsChange = (value) => {
    const options = value.split(',').map(v => v.trim()).filter(v => v);
    setFormData({ ...formData, voice_options: options });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Imák</Typography>
      </Box>

      <FormControl sx={{ mb: 3, minWidth: 300 }}>
        <InputLabel>Kategrória</InputLabel>
        <Select
          value={selectedCategory}
          label="Kategrória"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Új ima
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cím</TableCell>
              <TableCell>Leírás</TableCell>
              <TableCell>Kép</TableCell>
              <TableCell>Min. idő (perc)</TableCell>
              <TableCell>Lépések</TableCell>
              <TableCell>Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prayers.map((prayer) => (
              <TableRow key={prayer.id}>
                <TableCell>{prayer.id}</TableCell>
                <TableCell>{prayer.title}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>{prayer.description?.substring(0, 50)}...</TableCell>
                <TableCell>{prayer.image}</TableCell>
                <TableCell>{prayer.minTimeInMinutes}</TableCell>
                <TableCell>{prayer.steps?.length || 0}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(prayer)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(prayer.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingPrayer !== null ? 'Ima szerkesztése' : 'Új ima'}</DialogTitle>
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
            label="Leírás"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Kép fájlnév"
            fullWidth
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Hangopciók (vesszővel elválasztva)"
            fullWidth
            value={formData.voice_options.join(', ')}
            onChange={(e) => handleVoiceOptionsChange(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Minimális idő (perc)"
            type="number"
            fullWidth
            value={formData.minTimeInMinutes}
            onChange={(e) => setFormData({ ...formData, minTimeInMinutes: parseInt(e.target.value) || 15 })}
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
