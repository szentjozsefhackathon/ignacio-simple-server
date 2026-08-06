import React from "react";
import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Navbar from "../components/Navbar/Navbar";

function AdatvedelemPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 6, flexGrow: 1 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700} color="primary">
          Adatvédelmi Irányelvek – Ignáci Imák mobilalkalmazás
        </Typography>
        <Typography variant="body1" paragraph>
          Ez az adatvédelmi nyilatkozat tájékoztatja Önt a Szent József Hackathon által üzemeltetett Ignáci Imák mobilalkalmazás adatkezelési gyakorlatáról.
        </Typography>

        <Stack spacing={4} sx={{ mt: 4 }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom fontWeight={600} color="primary">
              1. Felhasználói adatok gyűjtése
            </Typography>
            <Typography variant="body1" paragraph>
              Az alkalmazás nem gyűjt, nem tárol és nem továbbít semmilyen személyes adatot (például név, e-mail cím, telefonszám vagy helyadatok). Az alkalmazás használatához nincs szükség regisztrációra.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" gutterBottom fontWeight={600} color="primary">
              2. Diagnosztikai és hibajelentési adatok (Sentry)
            </Typography>
            <Typography variant="body1" paragraph>
              Az alkalmazás stabilitásának és hibáinak javítása érdekében a Sentry (Functional Software, Inc.) szolgáltatását használjuk. Amennyiben az alkalmazás összeomlik vagy hiba lép fel, a rendszer automatikusan elküld bizonyos anonim technikai adatokat (pl. eszköz típusa, operációs rendszer verziója, a hiba helye a kódban). Ezek az adatok személyek azonosítására nem alkalmasak, és kizárólag a hiba kijavítását szolgálják.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" gutterBottom fontWeight={600} color="primary">
              3. Kapcsolat
            </Typography>
            <Typography variant="body1" paragraph>
              Ha kérdése van az adatvédelemmel kapcsolatban, kérjük, vegye fel velünk a kapcsolatot a következő elérhetőségen:{" "}
              <Link href="mailto:marci.golarits+ignaciimak@gmail.com" color="primary">
                marci.golarits+ignaciimak@gmail.com
              </Link>
              .
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 6 }}>
          <Link href="/" color="primary" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <ArrowBack fontSize="small" />
            Vissza a főoldalra
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default AdatvedelemPage;
