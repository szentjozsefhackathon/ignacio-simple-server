import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

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
            <Button 
              color="inherit" 
              onClick={() => navigate("/admin/categories")}
              sx={{ mr: 1 }}
            >
              Admin
            </Button>
            <Button 
              variant="outlined" 
              color="inherit"
              onClick={() => navigate("/login")}
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
