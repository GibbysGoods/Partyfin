import React from "react";
import { Box, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function Queue({ state, onControl }:{ state:any; onControl:(c:any)=>void }){
  const cur = state.queue[state.currentIndex];
  return (
    <Box>
      <Typography variant="h6" sx={{ mb:1 }}>Queue</Typography>
      <Box sx={{ display:"flex", gap:1, alignItems:"center", mb:1 }}>
        <IconButton onClick={()=>onControl({type:"prev"})}><SkipPreviousIcon/></IconButton>
        {state.isPlaying ? (
          <IconButton onClick={()=>onControl({type:"pause"})}><PauseIcon/></IconButton>
        ) : (
          <IconButton onClick={()=>onControl({type:"play"})}><PlayArrowIcon/></IconButton>
        )}
        <IconButton onClick={()=>onControl({type:"next"})}><SkipNextIcon/></IconButton>
        <Typography variant="body2" sx={{ ml:1 }}>{cur? `${cur.name} — ${cur.artist??""}`: "Nothing playing"}</Typography>
      </Box>
      <List dense>
        {state.queue.map((t:any, i:number)=> (
          <ListItem key={t.id} selected={i===state.currentIndex}>
            <ListItemText primary={t.name} secondary={t.artist} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
