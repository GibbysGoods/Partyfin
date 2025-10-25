import React, { useEffect, useRef } from "react";
import { getStreamUrl } from "../api";

export default function Player({ auth, state }:{ auth:any; state:any }){
  const audio = useRef<HTMLAudioElement>(null);
  const cur = state.queue[state.currentIndex];

  // Load track when it changes
  useEffect(()=>{ (async()=>{
    if(!audio.current || !cur) return;
    const url = await getStreamUrl(cur.id, auth);
    audio.current.src = url;
    if(state.isPlaying) await audio.current.play();
  })(); }, [cur?.id]);

  // Apply remote play/pause
  useEffect(()=>{ (async()=>{
    if(!audio.current) return; const el = audio.current;
    if(state.isPlaying){ try{ await el.play(); } catch{} } else { el.pause(); }
  })(); }, [state.isPlaying]);

  return <audio ref={audio} controls style={{ width:"100%" }} />;
}
