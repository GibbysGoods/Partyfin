import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, Container, Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import io from "socket.io-client";
import { dark, light } from "./theme";
import Login from "./components/Login";
import Library from "./components/Library";
import Queue from "./components/Queue";
import Player from "./components/Player";

export default function App(){
  const [mode, setMode] = useState<"light"|"dark">("dark");
  const theme = useMemo(()=> mode==="dark"? dark: light, [mode]);
  const [auth, setAuth] = useState<any|null>(null);
  const [state, setState] = useState<any>({ queue: [], currentIndex: 0, isPlaying:false, positionMs:0 });

  const [socket, setSocket] = useState<any>(null);
  useEffect(()=>{ const s = io(); setSocket(s); s.emit("join", "lobby"); s.on("state", setState); return ()=>{ s.disconnect(); } }, []);

  if(!auth) return <ThemeProvider theme={theme}><CssBaseline/><Login onLogin={setAuth}/></ThemeProvider>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flex:1 }}>Partyfin</Typography>
          <IconButton color="inherit" onClick={()=>setMode(m=> m==="dark"?"light":"dark")}>{mode==="dark"? <Brightness7Icon/> : <Brightness4Icon/>}</IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py:2 }}>
        <Box sx={{ display:"grid", gridTemplateColumns:{ md:"1fr 1fr"}, gap:2 }}>
          <Library auth={auth} onQueue={(t)=> socket.emit("enqueue", t)} />
          <Box>
            <Queue state={state} onControl={(c)=>
