import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Grid, Card, CardContent, CardActionArea, Stack, Chip } from "@mui/material";
import { Android, PhoneIphone, Computer, Language } from "@mui/icons-material";
import Navbar from "./components/Navbar/Navbar";
import LoginPage from "./components/LoginPage/LoginPage";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import CategoriesPage from "./pages/CategoriesPage";
import PrayersPage from "./pages/PrayersPage";
import StepsPage from "./pages/StepsPage";
import MediaPage from "./pages/MediaPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

function ProtectedAdminRoute() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <AdminLayout />;
}

function LandingPage() {
  const appLinks = [
    {
      title: "Web App",
      description: "Használd böngészőben",
      icon: <Language sx={{ fontSize: 48, color: "#8B0000" }} />,
      href: "/flutter",
      external: true,
    },
    {
      title: "Android",
      description: "Letöltés a Play Áruházból",
      icon: <Android sx={{ fontSize: 48, color: "#8B0000" }} />,
      href: "https://play.google.com/store/apps/details?id=hu.jezsuita.ima.ignaci",
      external: true,
    },
    {
      title: "iOS",
      description: "Letöltés az App Store-ból",
      icon: <PhoneIphone sx={{ fontSize: 48, color: "#8B0000" }} />,
      href: "https://apps.apple.com",
      external: true,
    },
    {
      title: "Windows",
      description: "Windows alkalmazás",
      icon: <Computer sx={{ fontSize: 48, color: "#8B0000" }} />,
      href: "#",
      external: false,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8B0000 0%, #6B0000 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            Ignáci imák
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Lelki gyakorlatok Szent Ignác nyomdokain
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: "auto", opacity: 0.85 }}>
            Találj időt a csendben lévésre, és fedezd fel az imádság 
            erejét a mindennapokban. Töltsd le az alkalmazást, vagy 
            használd webes verziónkat.
          </Typography>
        </Container>
      </Box>

      {/* App Download Section */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: "center", color: "text.primary" }}>
          Használd az alkalmazást
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {appLinks.map((link, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(139,0,0,0.15)',
                  }
                }}
              >
                <CardActionArea 
                  component="a"
                  href={link.href}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noopener noreferrer" : ""}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    {link.icon}
                    <Typography variant="h6" component="div" sx={{ mt: 2, fontWeight: 600, color: "text.primary" }}>
                      {link.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {link.description}
                    </Typography>
                    {link.external && (
                      <Chip 
                        label="Külső link" 
                        size="small" 
                        sx={{ mt: 2, fontSize: '0.7rem' }} 
                      />
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: "center" }}>
            Mit kínál az alkalmazás?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                    Lelki gyakorlatok
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vezetett meditációk, Szent Ignác-i szemlélődési 
                    gyakorlatok, és mindennapi imádságok.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                    Hangvezérelt ima
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Választhatsz férfi vagy női hangok között, 
                    amelyek végigvezetnek az imádság lépésein.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                    Napi reflexió
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Esti ima és lelki vizsgálat (examen) 
                    segítenek a nap tudatos lezárásában.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#333', color: 'white', py: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="body2">
              ☥ Ignáci imák - Jezsuita lelkiség
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Fejlesztette: Jezsuita ifjúsági szervezet
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={
            <ProtectedRouteWithLayout />
          } />
          <Route path="/*" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRouteWithLayout() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="/admin/categories" replace />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="prayers" element={<PrayersPage />} />
        <Route path="steps" element={<StepsPage />} />
        <Route path="media" element={<MediaPage />} />
      </Routes>
    </AdminLayout>
  );
}

export default App;
