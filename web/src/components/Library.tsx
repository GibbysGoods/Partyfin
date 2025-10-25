import React, { useEffect, useState } from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import { search } from "../api";

export default function Library({ auth, onQueue }: { auth: any; onQueue: (t:any)=>void }){
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ let active = true; (async()=>{ if(!auth) return; const res = await search(q, auth); if(active) setItems(res);} )(); return ()=>{active=false}; }, [q, auth]);
  return (
    <Box>
      <Typography variant="h6" sx={{ mb:1 }}>Library</Typography>
      <SearchBar value={q} onChange={setQ} />
      <List dense>
        {items.map(it=> (
          <ListItem key={it.id} disablePadding>
            <ListItemButton onClick={()=>onQueue(it)}>
              <ListItemText primary={it.name} secondary={it.artist ? `${it.artist}${it.album?" — "+it.album:""}`: it.album} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
