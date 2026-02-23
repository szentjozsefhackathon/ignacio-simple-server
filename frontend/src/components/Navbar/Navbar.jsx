import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Edit as EditIcon, Login as LoginIcon } from "@mui/icons-material";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleAuth = () => {
    if (isAuthenticated) {
      navigate("/admin/categories");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700, 
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            ☥ Ignáci imák
          </Typography>
          <Box>
            {isAuthenticated ? (
              <>
                <Button 
                  color="inherit" 
                  onClick={handleAuth}
                  startIcon={<EditIcon />}
                  sx={{ mr: 1 }}
                >
                  Szerkesztés
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Kijelentkezés
                </Button>
              </>
            ) : (
              <Button 
                variant="outlined" 
                color="inherit"
                onClick={handleAuth}
                startIcon={<LoginIcon />}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Bejelentkezés
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
