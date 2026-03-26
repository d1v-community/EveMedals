'use client'

import { useState } from 'react'

interface ShareButtonProps {
  walletAddress: string
}

export default function ShareButton({ walletAddress }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/warrior/${walletAddress}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for browsers without clipboard API
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="sds-system-chip flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition-all hover:opacity-80 active:scale-95"
      style={{
        background: 'rgba(240,100,47,0.12)',
        border: '1px solid rgba(240,100,47,0.35)',
        color: '#f0642f',
        fontFamily: 'var(--sds-font-mono)',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: copied ? '#7ec38f' : '#f0642f',
          transition: 'background 0.3s',
        }}
      />
      {copied ? 'Link Copied' : 'Share Profile'}
    </button>
  )
}
