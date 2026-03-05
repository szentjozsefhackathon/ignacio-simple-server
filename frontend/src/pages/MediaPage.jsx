import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tabs,
  Tab,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as UploadIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export default function MediaPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/media`);
      setFiles(response.data);
    } catch (error) {
      console.error('Hiba a fájlok betöltésekor:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_URL}/media/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchFiles();
    } catch (error) {
      console.error('Hiba a fájl feltöltésekor:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a fájlt?')) {
      try {
        await axios.delete(`${API_URL}/media/${id}`);
        fetchFiles();
      } catch (error) {
        console.error('Hiba a fájl törlésekor:', error);
      }
    }
  };

  const filteredFiles = files.filter((file) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return file.media_type === 'image';
    if (tabValue === 2) return file.media_type === 'voice';
    return true;
  });

  const imageFiles = files.filter(f => f.media_type === 'image');
  const audioFiles = files.filter(f => f.media_type === 'voice');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Médiafájlok</Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          component="label"
          disabled={uploading}
        >
          {uploading ? 'Feltöltés...' : 'Fájl feltöltése'}
          <input
            type="file"
            hidden
            accept="image/*,audio/*"
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label={`Mind (${files.length})`} />
        <Tab label={`Képek (${imageFiles.length})`} />
        <Tab label={`Hangfájlok (${audioFiles.length})`} />
      </Tabs>

      {filteredFiles.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Nincs feltöltött fájl.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredFiles.map((file) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
              <Card>
                {file.media_type === 'image' ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={file.url}
                    alt={file.filename}
                  />
                ) : (
                  <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" color="text.secondary">
                      🔊 {file.media_type}
                    </Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="body2" noWrap title={file.filename}>
                    {file.filename}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(file.size_bytes / 1024).toFixed(1)} KB
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(file.id)}
                  >
                    Törlés
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
