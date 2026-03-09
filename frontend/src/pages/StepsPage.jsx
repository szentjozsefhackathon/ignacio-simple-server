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
  Chip,
  Autocomplete,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export default function StepsPage() {
  const [categories, setCategories] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrayer, setSelectedPrayer] = useState('');
  const [steps, setSteps] = useState([]);
  const [voiceFiles, setVoiceFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    timeInSeconds: 60,
    type: 'FIX',
    voices: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchVoiceFiles();
  }, []);

  useEffect(() => {
    if (selectedCategory !== '') {
      fetchPrayers(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedPrayer !== '') {
      fetchSteps(selectedPrayer);
    }
  }, [selectedPrayer]);

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
      if (response.data.length > 0) {
        setSelectedPrayer(response.data[0].id);
      } else {
        setSelectedPrayer('');
        setSteps([]);
      }
    } catch (error) {
      console.error('Hiba az imák betöltésekor:', error);
    }
  };

  const fetchSteps = async (prayerId) => {
    try {
      const response = await axios.get(`${API_URL}/steps/prayer/${prayerId}`);
      setSteps(response.data);
    } catch (error) {
      console.error('Hiba a lépések betöltésekor:', error);
    }
  };

  const fetchVoiceFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/media/list?type=voice`);
      setVoiceFiles(response.data.map(f => f.filename));
    } catch (error) {
      console.error('Hiba a hangfájlok betöltésekor:', error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePrayerChange = (e) => {
    setSelectedPrayer(e.target.value);
  };

  const handleOpen = (step = null) => {
    if (step) {
      setEditingStep(step.id);
      setFormData({
        description: step.description,
        timeInSeconds: step.timeInSeconds,
        type: step.type,
        voices: step.voices || [],
      });
    } else {
      setEditingStep(null);
      setFormData({
        description: '',
        timeInSeconds: 60,
        type: 'FIX',
        voices: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStep(null);
  };

  const handleSave = async () => {
    try {
      if (editingStep !== null) {
        await axios.put(`${API_URL}/steps/${editingStep}`, formData);
      } else {
        await axios.post(`${API_URL}/steps/prayer/${selectedPrayer}`, formData);
      }
      handleClose();
      fetchSteps(selectedPrayer);
    } catch (error) {
      console.error('Hiba a lépés mentésekor:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a lépést?')) {
      try {
        await axios.delete(`${API_URL}/steps/${id}`);
        fetchSteps(selectedPrayer);
      } catch (error) {
        console.error('Hiba a lépés törlésekor:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Lépések</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Kategrória</InputLabel>
          <Select value={selectedCategory} label="Kategrória" onChange={handleCategoryChange}>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Ima</InputLabel>
          <Select value={selectedPrayer} label="Ima" onChange={handlePrayerChange}>
            {prayers.map((prayer) => (
              <MenuItem key={prayer.id} value={prayer.id}>{prayer.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={!selectedPrayer}
        >
          Új lépés
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Leírás</TableCell>
              <TableCell>Idő (mp)</TableCell>
              <TableCell>Típus</TableCell>
              <TableCell>Hangfájlok</TableCell>
              <TableCell>Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {steps.map((step) => (
              <TableRow key={step.id}>
                <TableCell>{step.id}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{step.description}</TableCell>
                <TableCell>{step.timeInSeconds}</TableCell>
                <TableCell>{step.type}</TableCell>
                <TableCell>
                  {step.voices?.map((voice, i) => (
                    <Chip key={i} label={voice} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(step)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(step.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingStep !== null ? 'Lépés szerkesztése' : 'Új lépés'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
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
            label="Idő (másodperc)"
            type="number"
            fullWidth
            value={formData.timeInSeconds}
            onChange={(e) => setFormData({ ...formData, timeInSeconds: parseInt(e.target.value) || 60 })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Típus</InputLabel>
            <Select
              value={formData.type}
              label="Típus"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="FIX">FIX</MenuItem>
              <MenuItem value="FLEX">FLEX</MenuItem>
            </Select>
          </FormControl>
          
          <Autocomplete
            multiple
            options={voiceFiles}
            value={formData.voices}
            onChange={(event, newValue) => {
              setFormData({ ...formData, voices: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} margin="dense" label="Hangfájlok" fullWidth />
            )}
            sx={{ mt: 2 }}
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
