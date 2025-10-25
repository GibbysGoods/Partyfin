import React, { useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { login } from "../api";

export default function Login({ onLogin }: { onLogin: (auth: any) => void }) {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setE] = useState<string | null>(null);
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Sign in to Jellyfin</Typography>
          <TextField fullWidth label="Username" margin="normal" value={username} onChange={e=>setU(e.target.value)} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e=>setP(e.target.value)} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={async ()=>{
            try { onLogin(await login(username, password)); } catch(e:any){ setE(e.message);} } }>Sign in</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
