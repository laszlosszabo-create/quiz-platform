"use client";
import { useEffect, useState } from 'react';

export function CommitInfo() {
  const [sha, setSha] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/version').then(r=>r.json()).then(d=>setSha(d.sha)).catch(()=>{});
  }, []);
  return (
    <div style={{position:'fixed',bottom:4,right:8,opacity:0.4,fontSize:10,fontFamily:'monospace'}}>
      {sha || '…'}
    </div>
  );
}