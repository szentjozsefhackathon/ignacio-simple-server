import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Container,
  Alert,
  CircularProgress
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const result = await login(username, password);
    
    setLoading(false);
    
    if (result.success) {
      navigate("/admin/categories");
    } else {
      setError(result.error || "Hibás felhasználónév vagy jelszó");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: 'linear-gradient(135deg, #8B0000 0%, #6B0000 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <LockIcon sx={{ color: "white", fontSize: 30 }} />
          </Box>
          
          <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
            Bejelentkezés
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ignáci imák Admin CMS
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Felhasználónév"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Jelszó"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Bejelentkezés"}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/")}
              sx={{ color: "text.secondary" }}
              disabled={loading}
            >
              Vissza a főoldalra
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
