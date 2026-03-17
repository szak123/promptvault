'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { STARTER_PROMPTS, extractVars, type Category, CAT_COLORS } from '@/lib/prompts'
import { supabase } from '@/lib/supabase'
import UpgradeModal from '@/components/UpgradeModal'
import CommunityFeed from '@/components/CommunityFeed'
import Favorites from '@/components/Favorites'
import MyPrompts from '@/components/MyPrompts'

const CATEGORIES: Category[] = ['analysis','writing','client','research','strategy','data','email','comms']

type Tab = 'library' | 'favorites' | 'myprompts' | 'runner' | 'improver' | 'community'

export default function Dashboard() {
  const { user } = useUser()
  const [tab, setTab] = useState<Tab>('library')
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState<Category | 'all'>('all')
  const [selectedId, setSelectedId] = useState<number>(1)
  const [varValues, setVarValues] = useState<Record<string, string>>({})
  const [output, setOutput] = useState('')
  const [improveInput, setImproveInput] = useState('')
  const [improveResult, setImproveResult] = useState<{ improved: string; explanation: string } | null>(null)
  const [improving, setImproving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [activePack, setActivePack] = useState<'all' | 'analyst' | 'smallbiz'>('all')
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    showToast('Copied!')
  }

  useEffect(() => {
    if (user) fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('prompt_id')
      .eq('user_id', user!.id)
    setFavoriteIds(data?.map(f => f.prompt_id) || [])
  }

  const toggleFavorite = async (promptId: number) => {
    if (favoriteIds.includes(promptId)) {
      await supabase.from('favorites').delete().eq('user_id', user!.id).eq('prompt_id', promptId)
      setFavoriteIds(prev => prev.filter(id => id !== promptId))
      showToast('Removed from favorites')
    } else {
      await supabase.from('favorites').insert({ user_id: user!.id, prompt_id: promptId })
      setFavoriteIds(prev => [...prev, promptId])
      showToast('Added to favorites ♥')
    }
  }

  const filtered = STARTER_PROMPTS.filter(p => {
    const matchPack = activePack === 'all' || p.pack === activePack
    const matchCat = activeCat === 'all' || p.category === activeCat
    const matchQ = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase())
    return matchPack && matchCat && matchQ
  })

  const selected = STARTER_PROMPTS.find(p => p.id === selectedId) || STARTER_PROMPTS[0]
  const vars = extractVars(selected.body)

  const runPrompt = () => {
    let result = selected.body
    vars.forEach(v => {
      result = result.replaceAll(`[${v}]`, varValues[v] || `[${v}]`)
    })
    setOutput(result)
  }

  const improve = async () => {
    if (!improveInput.trim()) { showToast('Paste a prompt first'); return }
    setImproving(true)
    setImproveResult(null)
    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: improveInput }),
      })
      const data = await res.json()
      setImproveResult(data)
    } catch {
      showToast('Something went wrong — try again')
    }
    setImproving(false)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{ background: '#ede8de', borderRight: '1px solid #d5cfc3', padding: '20px 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #d5cfc3' }}>
          <div style={{ fontFamily: 'Lora, serif', fontSize: 17, fontWeight: 600, color: '#1c1a16' }}>PromptVault</div>
          <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a847a', marginTop: 2 }}>Analyst edition</div>
        </div>

        <nav style={{ padding: '16px 0', flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a847a', padding: '0 16px 6px', fontWeight: 500 }}>Library</div>
          {([
            ['library','▤','Prompt Library'],
            ['favorites','♡','Favorites'],
            ['myprompts','✏️','My Prompts'],
          ] as const).map(([id, icon, label]) => (
            <div key={id} onClick={() => setTab(id)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 16px', fontSize: 12, color: tab === id ? '#c0522a' : '#4a4640', cursor: 'pointer', borderLeft: `2px solid ${tab === id ? '#c0522a' : 'transparent'}`, background: tab === id ? '#f0ddd5' : 'transparent', fontWeight: tab === id ? 500 : 400 }}>
              <span>{icon}</span>{label}
              {id === 'favorites' && favoriteIds.length > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: 10, background: '#c0522a', color: '#fff', padding: '1px 6px', borderRadius: 10 }}>{favoriteIds.length}</span>
              )}
            </div>
          ))}

          <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a847a', padding: '12px 16px 6px', fontWeight: 500 }}>Tools</div>
          {([
            ['runner','▷','Run Prompt'],
            ['improver','✦','AI Improver'],
          ] as const).map(([id, icon, label]) => (
            <div key={id} onClick={() => setTab(id)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 16px', fontSize: 12, color: tab === id ? '#c0522a' : '#4a4640', cursor: 'pointer', borderLeft: `2px solid ${tab === id ? '#c0522a' : 'transparent'}`, background: tab === id ? '#f0ddd5' : 'transparent', fontWeight: tab === id ? 500 : 400 }}>
              <span>{icon}</span>{label}
            </div>
          ))}

          <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a847a', padding: '12px 16px 6px', fontWeight: 500 }}>Community</div>
          <div onClick={() => setTab('community')} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 16px', fontSize: 12, color: tab === 'community' ? '#c0522a' : '#4a4640', cursor: 'pointer', borderLeft: `2px solid ${tab === 'community' ? '#c0522a' : 'transparent'}`, background: tab === 'community' ? '#f0ddd5' : 'transparent', fontWeight: tab === 'community' ? 500 : 400 }}>
            <span>◎</span>Community
          </div>

          <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a847a', padding: '12px 16px 6px', fontWeight: 500 }}>Categories</div>
          {CATEGORIES.map(cat => (
            <div key={cat} onClick={() => { setActiveCat(cat); setTab('library') }} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 16px', fontSize: 12, color: '#4a4640', cursor: 'pointer' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLORS[cat].dot, flexShrink: 0, display: 'inline-block' }} />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: '1px solid #d5cfc3', display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserButton afterSignOutUrl="/" />
          <div style={{ fontSize: 12, color: '#4a4640', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ padding: '28px 32px', overflowY: 'auto', maxHeight: '100vh' }}>

        {/* LIBRARY */}
        {tab === 'library' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Prompt Library</h1>
              <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <button onClick={() => setActivePack('all')} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: 'none', background: activePack === 'all' ? '#1c1a16' : '#e4dfd3', color: activePack === 'all' ? '#fff' : '#4a4640', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  All prompts
                </button>
                <button onClick={() => setActivePack('analyst')} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: 'none', background: activePack === 'analyst' ? '#c0522a' : '#e4dfd3', color: activePack === 'analyst' ? '#fff' : '#4a4640', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  ▤ Analysts & Consultants
                </button>
                <button onClick={() => setActivePack('smallbiz')} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: 'none', background: activePack === 'smallbiz' ? '#2d7a2d' : '#e4dfd3', color: activePack === 'smallbiz' ? '#fff' : '#4a4640', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  🏪 Small Business
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#8a847a' }}>{filtered.length} prompts</p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts..." style={{ flex: 1, minWidth: 160, padding: '7px 12px', background: '#fff', border: '1px solid #d5cfc3', borderRadius: 7, fontFamily: 'Outfit, sans-serif', fontSize: 12, color: '#1c1a16', outline: 'none' }} />
              {(['all', ...CATEGORIES] as const).map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: '4px 10px', borderRadius: 16, fontSize: 11, fontWeight: 500, background: activeCat === cat ? '#c0522a' : '#e4dfd3', color: activeCat === cat ? '#fff' : '#4a4640', border: 'none', cursor: 'pointer' }}>
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
              {filtered.map(p => (
                <div key={p.id} style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

                  {/* PRO blur overlay */}
                  {p.isPro && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', background: 'rgba(245,240,232,0.7)', borderRadius: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, background: '#1c1a16', color: '#fff', padding: '4px 10px', borderRadius: 6, marginBottom: 8 }}>PRO</div>
                      <div style={{ fontSize: 12, color: '#4a4640', marginBottom: 12, textAlign: 'center', padding: '0 16px' }}>Upgrade to access this prompt</div>
                      <button onClick={() => setShowUpgrade(true)} style={{ padding: '6px 16px', background: '#c0522a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                        Upgrade to Pro — $19/mo
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLORS[p.category].dot }} />
                      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase', color: CAT_COLORS[p.category].label }}>{p.category}</div>
                    </div>
                    <button onClick={() => toggleFavorite(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: favoriteIds.includes(p.id) ? '#c0522a' : '#d5cfc3', padding: 0, lineHeight: 1 }} title={favoriteIds.includes(p.id) ? 'Remove from favorites' : 'Add to favorites'}>
                      {favoriteIds.includes(p.id) ? '♥' : '♡'}
                    </button>
                  </div>

                  <div style={{ fontFamily: 'Lora, serif', fontSize: 14, fontWeight: 600, color: '#1c1a16', marginBottom: 6, lineHeight: 1.3 }}>{p.title}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#4a4640', lineHeight: 1.75, background: '#f5f0e8', borderRadius: 4, padding: '8px 10px', flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{p.body}</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ fontSize: 10, color: '#8a847a' }}>{p.uses} uses</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => copy(p.body)} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid #d5cfc3', background: 'transparent', color: '#4a4640', fontFamily: 'Outfit, sans-serif' }}>Copy</button>
                      <button onClick={() => { setSelectedId(p.id); setVarValues({}); setOutput(''); setTab('runner') }} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: 'none', background: '#c0522a', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Run →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAVORITES */}
        {tab === 'favorites' && <Favorites />}

        {/* MY PROMPTS */}
        {tab === 'myprompts' && <MyPrompts />}

        {/* RUNNER */}
        {tab === 'runner' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Run a Prompt</h1>
              <p style={{ fontSize: 12, color: '#8a847a' }}>Fill in the variables and generate your composed prompt</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 860 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a847a', marginBottom: 8 }}>Choose prompt</div>
                <select value={selectedId} onChange={e => { setSelectedId(Number(e.target.value)); setVarValues({}); setOutput('') }} style={{ width: '100%', padding: '8px 11px', background: '#fff', border: '1px solid #d5cfc3', borderRadius: 7, fontFamily: 'Outfit, sans-serif', fontSize: 12, color: '#1c1a16', outline: 'none', marginBottom: 14, cursor: 'pointer' }}>
                  {STARTER_PROMPTS.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                {vars.length === 0 && (
                  <div style={{ fontSize: 11, color: '#8a847a', padding: '6px 0 12px', fontStyle: 'italic' }}>No variables — prompt is ready to copy as-is.</div>
                )}
                {vars.map(v => (
                  <div key={v} style={{ marginBottom: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, color: '#4a4640', marginBottom: 4 }}>
                      <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, background: '#f5f0e8', padding: '1px 5px', borderRadius: 3, color: '#c0522a' }}>[{v}]</code>
                    </label>
                    <input value={varValues[v] || ''} onChange={e => setVarValues(prev => ({ ...prev, [v]: e.target.value }))} placeholder={`${v}...`} style={{ width: '100%', padding: '7px 10px', background: '#fff', border: '1px solid #d5cfc3', borderRadius: 5, fontFamily: 'Outfit, sans-serif', fontSize: 12, color: '#1c1a16', outline: 'none' }} />
                  </div>
                ))}
                <button onClick={runPrompt} style={{ width: '100%', padding: 10, background: '#c0522a', color: '#fff', border: 'none', borderRadius: 7, fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginTop: 6 }}>
                  Generate filled prompt →
                </button>
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a847a', marginBottom: 8 }}>Ready to copy</div>
                <div style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 10, padding: 16, minHeight: 300, position: 'relative' }}>
                  <button onClick={() => output && copy(output)} style={{ position: 'absolute', top: 12, right: 12, padding: '3px 9px', fontSize: 10, fontWeight: 500, cursor: 'pointer', border: '1px solid #d5cfc3', background: '#f5f0e8', color: '#4a4640', borderRadius: 4, fontFamily: 'Outfit, sans-serif' }}>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  {output ? (
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#1c1a16', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{output}</div>
                  ) : (
                    <div style={{ color: '#8a847a', fontSize: 12, padding: '60px 0', textAlign: 'center', fontStyle: 'italic' }}>Fill in the fields and click generate</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IMPROVER */}
        {tab === 'improver' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 600, marginBottom: 4 }}>AI Prompt Improver</h1>
              <p style={{ fontSize: 12, color: '#8a847a' }}>Paste any prompt — get a sharper version back with a full explanation</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 860 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a847a', marginBottom: 8 }}>Your prompt</div>
                <textarea value={improveInput} onChange={e => setImproveInput(e.target.value)} placeholder="Paste your prompt here..." style={{ width: '100%', padding: 12, background: '#fff', border: '1px solid #d5cfc3', borderRadius: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#1c1a16', lineHeight: 1.75, minHeight: 220, resize: 'vertical', outline: 'none' }} />
                <button onClick={improve} disabled={improving} style={{ width: '100%', padding: 10, background: '#1c1a16', color: '#fff', border: 'none', borderRadius: 7, fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 500, cursor: improving ? 'not-allowed' : 'pointer', marginTop: 10, opacity: improving ? 0.5 : 1 }}>
                  {improving ? 'Improving...' : '✦ Improve with AI'}
                </button>
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a847a', marginBottom: 8 }}>Improved version</div>
                <div style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 10, padding: 16, minHeight: 280 }}>
                  {!improveResult && !improving && (
                    <div style={{ color: '#8a847a', fontSize: 12, lineHeight: 1.8, padding: '16px 0' }}>
                      The AI will rewrite your prompt to be more specific, better structured, and more effective — then explain every change it made.
                    </div>
                  )}
                  {improving && <div style={{ color: '#8a847a', fontSize: 12, padding: '20px 0' }}>Improving your prompt...</div>}
                  {improveResult && (
                    <>
                      <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a847a', fontWeight: 500, marginBottom: 7 }}>Improved prompt</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#1c1a16', lineHeight: 1.75, background: '#f5f0e8', borderRadius: 5, padding: 10, whiteSpace: 'pre-wrap', marginBottom: 8 }}>{improveResult.improved}</div>
                      <button onClick={() => copy(improveResult.improved)} style={{ width: '100%', padding: '7px', background: '#c0522a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginBottom: 14 }}>
                        Copy improved prompt
                      </button>
                      <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a847a', fontWeight: 500, marginBottom: 7 }}>What changed &amp; why</div>
                      <div style={{ fontSize: 12, color: '#4a4640', lineHeight: 1.7 }}>{improveResult.explanation}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMMUNITY */}
        {tab === 'community' && <CommunityFeed />}

      </main>

      {/* Upgrade Modal */}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#1c1a16', color: '#fff', padding: '9px 16px', borderRadius: 7, fontSize: 12, fontFamily: 'Outfit, sans-serif', zIndex: 200 }}>
          {toast}
        </div>
      )}
    </div>
  )
}
