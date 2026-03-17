'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { extractVars, type Category } from '@/lib/prompts'

const CATEGORIES: Category[] = ['analysis','writing','client','research','strategy','data','email','comms']

const CAT_COLORS: Record<Category, { dot: string; label: string }> = {
  analysis: { dot: '#2a6b4a', label: '#2a6b4a' },
  writing:  { dot: '#2a4a8a', label: '#2a4a8a' },
  client:   { dot: '#c0522a', label: '#c0522a' },
  research: { dot: '#8a6020', label: '#8a6020' },
  strategy: { dot: '#2a6a8a', label: '#2a6a8a' },
  data:     { dot: '#6a2a6a', label: '#6a2a6a' },
  email:    { dot: '#5a2a8a', label: '#5a2a8a' },
  comms:    { dot: '#2a5a3a', label: '#2a5a3a' },
}

interface MyPrompt {
  id: string
  title: string
  body: string
  category: Category
  folder: string
  created_at: string
  updated_at: string
}

export default function MyPrompts() {
  const { user } = useUser()
  const [prompts, setPrompts] = useState<MyPrompt[]>([])
  const [folders, setFolders] = useState<string[]>(['General'])
  const [activeFolder, setActiveFolder] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'edit' | 'new'>('list')
  const [editing, setEditing] = useState<MyPrompt | null>(null)
  const [toast, setToast] = useState('')
  const [newFolderMode, setNewFolderMode] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [varValues, setVarValues] = useState<Record<string, string>>({})
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [runningId, setRunningId] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'analysis' as Category,
    folder: 'General',
  })

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
    if (user) fetchAll()
  }, [user])

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: promptData }, { data: folderData }] = await Promise.all([
      supabase.from('my_prompts').select('*').eq('user_id', user!.id).order('updated_at', { ascending: false }),
      supabase.from('folders').select('name').eq('user_id', user!.id),
    ])
    setPrompts((promptData as MyPrompt[]) || [])
    const folderNames = folderData?.map(f => f.name) || []
    setFolders(['General', ...folderNames.filter(n => n !== 'General')])
    setLoading(false)
  }

  const savePrompt = async () => {
    if (!form.title || !form.body) { showToast('Title and prompt are required'); return }
    if (view === 'edit' && editing) {
      const { error } = await supabase.from('my_prompts').update({
        title: form.title,
        body: form.body,
        category: form.category,
        folder: form.folder,
        updated_at: new Date().toISOString(),
      }).eq('id', editing.id)
      if (!error) { showToast('Prompt updated!'); fetchAll(); setView('list') }
    } else {
      const { error } = await supabase.from('my_prompts').insert({
        user_id: user!.id,
        title: form.title,
        body: form.body,
        category: form.category,
        folder: form.folder,
      })
      if (!error) { showToast('Prompt saved!'); fetchAll(); setView('list') }
    }
  }

  const deletePrompt = async (id: string) => {
    if (!confirm('Delete this prompt?')) return
    await supabase.from('my_prompts').delete().eq('id', id)
    setPrompts(prev => prev.filter(p => p.id !== id))
    showToast('Prompt deleted')
    if (view === 'edit') setView('list')
  }

  const createFolder = async () => {
    if (!newFolderName.trim()) return
    await supabase.from('folders').insert({ user_id: user!.id, name: newFolderName.trim() })
    setFolders(prev => [...prev, newFolderName.trim()])
    setForm(p => ({ ...p, folder: newFolderName.trim() }))
    setNewFolderName('')
    setNewFolderMode(false)
    showToast('Folder created!')
  }

  const startEdit = (p: MyPrompt) => {
    setEditing(p)
    setForm({ title: p.title, body: p.body, category: p.category, folder: p.folder })
    setView('edit')
    setOutput('')
    setVarValues({})
  }

  const startNew = () => {
    setEditing(null)
    setForm({ title: '', body: '', category: 'analysis', folder: activeFolder === 'All' ? 'General' : activeFolder })
    setView('new')
    setOutput('')
    setVarValues({})
  }

  const startRun = (p: MyPrompt) => {
    setRunningId(p.id)
    setEditing(p)
    setVarValues({})
    setOutput('')
  }

  const runPrompt = () => {
    if (!editing) return
    const vars = extractVars(editing.body)
    let result = editing.body
    vars.forEach(v => { result = result.replaceAll(`[${v}]`, varValues[v] || `[${v}]`) })
    setOutput(result)
  }

  const filtered = activeFolder === 'All' ? prompts : prompts.filter(p => p.folder === activeFolder)
  const runningPrompt = prompts.find(p => p.id === runningId)
  const runVars = runningPrompt ? extractVars(runningPrompt.body) : []

  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: '#8a847a', fontSize: 13 }}>Loading your prompts...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 600, marginBottom: 4 }}>My Prompts</h1>
          <p style={{ fontSize: 12, color: '#8a847a' }}>Write, organize, and run your own prompts in folders</p>
        </div>
        <button onClick={startNew} style={{ padding: '8px 18px', background: '#c0522a', color: '#fff', border: 'none', borderRadius: 7, fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          + New prompt
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 20 }}>

        {/* Folder sidebar */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a847a', marginBottom: 8 }}>Folders</div>
          
          {/* All */}
          <div onClick={() => setActiveFolder('All')} style={{ padding: '6px 10px', borderRadius: 6, fontSize: 12, color: activeFolder === 'All' ? '#c0522a' : '#4a4640', background: activeFolder === 'All' ? '#f0ddd5' : 'transparent', cursor: 'pointer', marginBottom: 2, fontWeight: activeFolder === 'All' ? 500 : 400 }}>
            All prompts <span style={{ fontSize: 10, color: '#8a847a' }}>({prompts.length})</span>
          </div>

          {folders.map(f => (
            <div key={f} onClick={() => setActiveFolder(f)} style={{ padding: '6px 10px', borderRadius: 6, fontSize: 12, color: activeFolder === f ? '#c0522a' : '#4a4640', background: activeFolder === f ? '#f0ddd5' : 'transparent', cursor: 'pointer', marginBottom: 2, fontWeight: activeFolder === f ? 500 : 400 }}>
              📁 {f} <span style={{ fontSize: 10, color: '#8a847a' }}>({prompts.filter(p => p.folder === f).length})</span>
            </div>
          ))}

          {/* New folder */}
          {newFolderMode ? (
            <div style={{ marginTop: 8 }}>
              <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Folder name..." onKeyDown={e => e.key === 'Enter' && createFolder()} style={{ width: '100%', padding: '5px 8px', background: '#fff', border: '1px solid #d5cfc3', borderRadius: 5, fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#1c1a16', outline: 'none', marginBottom: 4 }} autoFocus />
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={createFolder} style={{ flex: 1, padding: '4px', background: '#c0522a', color: '#fff', border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Create</button>
                <button onClick={() => setNewFolderMode(false)} style={{ flex: 1, padding: '4px', background: 'transparent', border: '1px solid #d5cfc3', borderRadius: 4, fontSize: 10, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', color: '#4a4640' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setNewFolderMode(true)} style={{ marginTop: 8, width: '100%', padding: '5px', background: 'transparent', border: '1px dashed #d5cfc3', borderRadius: 5, fontSize: 11, color: '#8a847a', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              + New folder
            </button>
          )}
        </div>

        {/* Main content */}
        <div>

          {/* LIST VIEW */}
          {view === 'list' && (
            <div>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, background: '#fff', border: '1px solid #d5cfc3', borderRadius: 12 }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>✏️</div>
                  <div style={{ fontFamily: 'Lora, serif', fontSize: 18, color: '#1c1a16', marginBottom: 8 }}>No prompts yet</div>
                  <p style={{ fontSize: 13, color: '#8a847a', marginBottom: 16 }}>Create your first personal prompt — write it once, use it forever.</p>
                  <button onClick={startNew} style={{ padding: '8px 20px', background: '#c0522a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                    Write your first prompt →
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filtered.map(p => (
                    <div key={p.id} style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 10, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLORS[p.category].dot }} />
                          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase', color: CAT_COLORS[p.category].label }}>{p.category}</div>
                          <div style={{ fontSize: 10, color: '#8a847a' }}>· 📁 {p.folder}</div>
                        </div>
                        <div style={{ fontSize: 10, color: '#8a847a' }}>
                          {new Date(p.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'Lora, serif', fontSize: 14, fontWeight: 600, color: '#1c1a16', marginBottom: 6 }}>{p.title}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#8a847a', lineHeight: 1.65, background: '#f5f0e8', borderRadius: 4, padding: '7px 8px', marginBottom: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{p.body}</div>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                        <button onClick={() => deletePrompt(p.id)} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid #f0ddd5', background: 'transparent', color: '#c0522a', fontFamily: 'Outfit, sans-serif' }}>Delete</button>
                        <button onClick={() => startEdit(p)} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid #d5cfc3', background: 'transparent', color: '#4a4640', fontFamily: 'Outfit, sans-serif' }}>Edit</button>
                        <button onClick={() => copy(p.body)} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid #d5cfc3', background: 'transparent', color: '#4a4640', fontFamily: 'Outfit, sans-serif' }}>Copy</button>
                        <button onClick={() => startRun(p)} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: 'none', background: '#c0522a', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Run →</button>
                      </div>

                      {/* Inline runner */}
                      {runningId === p.id && (
                        <div style={{ marginTop: 14, borderTop: '1px solid #d5cfc3', paddingTop: 14 }}>
                          {runVars.length === 0 && <div style={{ fontSize: 11, color: '#8a847a', marginBottom: 8, fontStyle: 'italic' }}>No variables — ready to copy.</div>}
                          {runVars.map(v => (
                            <div key={v} style={{ marginBottom: 8 }}>
                              <label style={{ fontSize: 10, fontWeight: 500, color: '#4a4640', marginBottom: 3, display: 'block' }}>
                                <code style={{ fontFamily: 'JetBrains Mono, monospace', background: '#f5f0e8', padding: '1px 5px', borderRadius: 3, color: '#c0522a' }}>[{v}]</code>
                              </label>
                              <input value={varValues[v] || ''} onChange={e => setVarValues(prev => ({ ...prev, [v]: e.target.value }))} placeholder={`${v}...`} style={{ width: '100%', padding: '6px 10px', background: '#fff', border: '1px solid #d5cfc3', borderRadius: 5, fontFamily: 'Outfit, sans-serif', fontSize: 12, color: '#1c1a16', outline: 'none' }} />
                            </div>
                          ))}
                          <button onClick={runPrompt} style={{ width: '100%', padding: 9, background: '#1c1a16', color: '#fff', border: 'none', borderRadius: 6, fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }}>
                            Generate →
                          </button>
                          {output && (
                            <div style={{ background: '#f5f0e8', borderRadius: 6, padding: 12, position: 'relative' }}>
                              <button onClick={() => copy(output)} style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', fontSize: 10, fontWeight: 500, cursor: 'pointer', border: '1px solid #d5cfc3', background: '#fff', color: '#4a4640', borderRadius: 4, fontFamily: 'Outfit, sans-serif' }}>
                                {copied ? 'Copied!' : 'Copy'}
                              </button>
                              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: '#1c1a16', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word', paddingRight: 50 }}>{output}</div>
                            </div>
                          )}
                          <button onClick={() => { setRunningId(null); setOutput(''); setVarValues({}) }} style={{ marginTop: 6, background: 'none', border: 'none', fontSize: 11, color: '#8a847a', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Close runner</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EDIT / NEW VIEW */}
          {(view === 'edit' || view === 'new') && (
            <div style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 12, padding: 24, maxWidth: 640 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600 }}>
                  {view === 'new' ? 'New prompt' : 'Edit prompt'}
                </div>
                <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#8a847a' }}>✕</button>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a847a', marginBottom: 5 }}>Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. My weekly report template" style={{ width: '100%', padding: '8px 11px', background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 6, fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#1c1a16', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a847a', marginBottom: 5 }}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))} style={{ width: '100%', padding: '8px 11px', background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 6, fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#1c1a16', outline: 'none', cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a847a', marginBottom: 5 }}>Folder</label>
                  <select value={form.folder} onChange={e => setForm(p => ({ ...p, folder: e.target.value }))} style={{ width: '100%', padding: '8px 11px', background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 6, fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#1c1a16', outline: 'none', cursor: 'pointer' }}>
                    {folders.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a847a', marginBottom: 5 }}>Prompt text</label>
                <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Write your prompt here. Use [variable] for dynamic parts — e.g. [client name], [date], [topic]" style={{ width: '100%', padding: '10px 12px', background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#1c1a16', lineHeight: 1.75, minHeight: 160, resize: 'vertical', outline: 'none' }} />
                <div style={{ fontSize: 10, color: '#8a847a', marginTop: 4 }}>Use [brackets] for variables — they become fill-in fields when you run the prompt.</div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {view === 'edit' && (
                  <button onClick={() => deletePrompt(editing!.id)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #f0ddd5', borderRadius: 7, fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#c0522a', cursor: 'pointer' }}>
                    Delete
                  </button>
                )}
                <button onClick={() => setView('list')} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid #d5cfc3', borderRadius: 7, fontFamily: 'Outfit, sans-serif', fontSize: 13, cursor: 'pointer', color: '#4a4640' }}>
                  Cancel
                </button>
                <button onClick={savePrompt} style={{ flex: 2, padding: 10, background: '#c0522a', color: '#fff', border: 'none', borderRadius: 7, fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  {view === 'new' ? 'Save prompt' : 'Save changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#1c1a16', color: '#fff', padding: '9px 16px', borderRadius: 7, fontSize: 12, fontFamily: 'Outfit, sans-serif', zIndex: 200 }}>
          {toast}
        </div>
      )}
    </div>
  )
}
