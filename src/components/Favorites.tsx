'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { STARTER_PROMPTS, extractVars, type Category, CAT_COLORS } from '@/lib/prompts'

export default function Favorites() {
  const { user } = useUser()
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [varValues, setVarValues] = useState<Record<string, string>>({})
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    if (user) fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('favorites')
      .select('prompt_id')
      .eq('user_id', user!.id)
    setFavoriteIds(data?.map(f => f.prompt_id) || [])
    setLoading(false)
  }

  const removeFavorite = async (promptId: number) => {
    await supabase.from('favorites').delete().eq('user_id', user!.id).eq('prompt_id', promptId)
    setFavoriteIds(prev => prev.filter(id => id !== promptId))
    showToast('Removed from favorites')
  }

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    showToast('Copied!')
  }

  const favoritePrompts = STARTER_PROMPTS.filter(p => favoriteIds.includes(p.id))
  const selected = favoritePrompts.find(p => p.id === selectedId)
  const vars = selected ? extractVars(selected.body) : []

  const runPrompt = () => {
    if (!selected) return
    let result = selected.body
    vars.forEach(v => {
      result = result.replaceAll(`[${v}]`, varValues[v] || `[${v}]`)
    })
    setOutput(result)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: '#8a847a', fontSize: 13 }}>Loading your favorites...</div>

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Favorites</h1>
        <p style={{ fontSize: 12, color: '#8a847a' }}>Your saved prompts — bookmark any prompt from the library</p>
      </div>

      {favoritePrompts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #d5cfc3', borderRadius: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>♡</div>
          <div style={{ fontFamily: 'Lora, serif', fontSize: 18, color: '#1c1a16', marginBottom: 8 }}>No favorites yet</div>
          <p style={{ fontSize: 13, color: '#8a847a' }}>Click the ♡ on any prompt in the library to save it here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedId ? '1fr 1fr' : 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          
          {/* Prompt cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {favoritePrompts.map(p => (
              <div key={p.id} style={{ background: '#fff', border: `1px solid ${selectedId === p.id ? '#c0522a' : '#d5cfc3'}`, borderRadius: 10, padding: 16, cursor: 'pointer', transition: 'all 0.15s' }} onClick={() => { setSelectedId(p.id); setVarValues({}); setOutput('') }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLORS[p.category].dot }} />
                    <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase', color: CAT_COLORS[p.category].label }}>{p.category}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); removeFavorite(p.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#c0522a', padding: 0 }} title="Remove from favorites">♥</button>
                </div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 14, fontWeight: 600, color: '#1c1a16', marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#8a847a', lineHeight: 1.65, background: '#f5f0e8', borderRadius: 4, padding: '7px 8px' }}>{p.body}</div>
                <div style={{ display: 'flex', gap: 5, marginTop: 10, justifyContent: 'flex-end' }}>
                  <button onClick={e => { e.stopPropagation(); copy(p.body) }} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid #d5cfc3', background: 'transparent', color: '#4a4640', fontFamily: 'Outfit, sans-serif' }}>Copy</button>
                  <button onClick={e => { e.stopPropagation(); setSelectedId(p.id); setVarValues({}); setOutput('') }} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: 'none', background: '#c0522a', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Run →</button>
                </div>
              </div>
            ))}
          </div>

          {/* Runner panel */}
          {selectedId && selected && (
            <div>
              <div style={{ fontFamily: 'Lora, serif', fontSize: 16, fontWeight: 600, marginBottom: 14, color: '#1c1a16' }}>{selected.title}</div>
              {vars.length === 0 && (
                <div style={{ fontSize: 11, color: '#8a847a', marginBottom: 12, fontStyle: 'italic' }}>No variables — ready to copy.</div>
              )}
              {vars.map(v => (
                <div key={v} style={{ marginBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, color: '#4a4640', marginBottom: 4 }}>
                    <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, background: '#f5f0e8', padding: '1px 5px', borderRadius: 3, color: '#c0522a' }}>[{v}]</code>
                  </label>
                  <input value={varValues[v] || ''} onChange={e => setVarValues(prev => ({ ...prev, [v]: e.target.value }))} placeholder={`${v}...`} style={{ width: '100%', padding: '7px 10px', background: '#fff', border: '1px solid #d5cfc3', borderRadius: 5, fontFamily: 'Outfit, sans-serif', fontSize: 12, color: '#1c1a16', outline: 'none' }} />
                </div>
              ))}
              <button onClick={runPrompt} style={{ width: '100%', padding: 10, background: '#c0522a', color: '#fff', border: 'none', borderRadius: 7, fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 12 }}>
                Generate filled prompt →
              </button>
              {output && (
                <div style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 8, padding: 14, position: 'relative' }}>
                  <button onClick={() => copy(output)} style={{ position: 'absolute', top: 10, right: 10, padding: '3px 9px', fontSize: 10, fontWeight: 500, cursor: 'pointer', border: '1px solid #d5cfc3', background: '#f5f0e8', color: '#4a4640', borderRadius: 4, fontFamily: 'Outfit, sans-serif' }}>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#1c1a16', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word', paddingRight: 50 }}>{output}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#1c1a16', color: '#fff', padding: '9px 16px', borderRadius: 7, fontSize: 12, fontFamily: 'Outfit, sans-serif', zIndex: 200 }}>
          {toast}
        </div>
      )}
    </div>
  )
}
