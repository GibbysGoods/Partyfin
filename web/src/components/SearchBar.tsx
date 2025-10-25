import React from "react";
import { TextField } from "@mui/material";
export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <TextField fullWidth placeholder="Search your music" value={value} onChange={e=>onChange(e.target.value)} />;
}
