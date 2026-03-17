'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import CommunityTerms from './CommunityTerms'

type Category = 'analysis' | 'writing' | 'client' | 'research' | 'strategy' | 'data' | 'email' | 'comms'

interface CommunityPrompt {
  id: string
  user_id: string
  author_name: string
  title: string
  body: string
  category: Category
  description: string | null
  votes: number
  approved: boolean
  created_at: string
  userVoted?: boolean
}

const CATEGORIES: Category[] = ['analysis','writing','client','research','strategy','data','email','comms']

const CAT_COLORS: Record<Category, string> = {
  analysis: '#2a6b4a',
  writing: '#2a4a8a',
  client: '#c0522a',
  research: '#8a6020',
  strategy: '#2a6a8a',
  data: '#6a2a6a',
  email: '#5a2a8a',
  comms: '#2a5a3a',
}

export default function CommunityFeed() {
  const { user } = useUser()
  const [tab, setTab] = useState<'browse' | 'submit'>('browse')
  const [prompts, setPrompts] = useState<CommunityPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [showTerms, setShowTerms] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sortBy, setSortBy] = useState<'votes' | 'new'>('votes')

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: 'analysis' as Category,
    body: '',
    description: '',
  })

  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('community_prompts')
      .select('*')
      .order('votes', { ascending: false })

    if (!error && data) {
      // Check which ones the user has voted on
      if (user) {
        const { data: votes } = await supabase
          .from('community_votes')
          .select('prompt_id')
          .eq('user_id', user.id)

        const votedIds = new Set(votes?.map(v => v.prompt_id) || [])
        setPrompts(data.map(p => ({ ...p, userVoted: votedIds.has(p.id) })))
      } else {
        setPrompts(data)
      }
    }
    setLoading(false)
  }

  const vote = async (promptId: string, currentVotes: number, userVoted: boolean) => {
    if (!user) { alert('Sign in to vote'); return }

    if (userVoted) {
      // Remove vote
      await supabase.from('community_votes').delete().eq('user_id', user.id).eq('prompt_id', promptId)
      await supabase.from('community_prompts').update({ votes: currentVotes - 1 }).eq('id', promptId)
      setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, votes: p.votes - 1, userVoted: false } : p))
    } else {
      // Add vote
      await supabase.from('community_votes').insert({ user_id: user.id, prompt_id: promptId })
      const newVotes = currentVotes + 1
      await supabase.from('community_prompts').update({ votes: newVotes, approved: newVotes >= 50 }).eq('id', promptId)
      setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, votes: newVotes, userVoted: true, approved: newVotes >= 50 } : p))
    }
  }

  const handleSubmitClick = () => {
    if (!termsAccepted) {
      setShowTerms(true)
    } else {
      submitPrompt()
    }
  }

  const submitPrompt = async () => {
    if (!form.title || !form.body) { alert('Title and prompt are required'); return }
    if (!user) { alert('Sign in to submit'); return }
    setSubmitting(true)

    const { error } = await supabase.from('community_prompts').insert({
      user_id: user.id,
      author_name: user.firstName || user.emailAddresses[0]?.emailAddress || 'Anonymous',
      title: form.title,
      body: form.body,
      category: form.category,
      description: form.description || null,
    })

    if (!error) {
      setSubmitted(true)
      setForm({ title: '', category: 'analysis', body: '', description: '' })
      fetchPrompts()
      setTimeout(() => { setSubmitted(false); setTab('browse') }, 2000)
    }
    setSubmitting(false)
  }

  const sorted = [...prompts].sort((a, b) => sortBy === 'votes' ? b.votes - a.votes : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div>
      {/* Terms modal */}
      {showTerms && (
        <CommunityTerms
          onAccept={() => { setTermsAccepted(true); setShowTerms(false); submitPrompt() }}
          onClose={() => setShowTerms(false)}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Community</h1>
          <p style={{ fontSize: 12, color: '#8a847a' }}>Vote on prompts — 50 upvotes joins the official library</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setTab('browse')} style={{ padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid #d5cfc3', background: tab === 'browse' ? '#1c1a16' : 'transparent', color: tab === 'browse' ? '#fff' : '#4a4640', fontFamily: 'Outfit, sans-serif' }}>
            Browse
          </button>
          <button onClick={() => setTab('submit')} style={{ padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: '#c0522a', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>
            + Submit prompt
          </button>
        </div>
      </div>

      {/* How it works banner */}
      <div style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 10, padding: 16, marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {[
          { icon: '↑', text: 'Submit your best prompt' },
          { icon: '◎', text: 'Community upvotes what works' },
          { icon: '★', text: '50 votes = joins official library' },
        ].map(item => (
          <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#4a4640' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f0ddd5', color: '#c0522a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      {/* BROWSE TAB */}
      {tab === 'browse' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={() => setSortBy('votes')} style={{ padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 500, border: 'none', background: sortBy === 'votes' ? '#c0522a' : '#e4dfd3', color: sortBy === 'votes' ? '#fff' : '#4a4640', cursor: 'pointer' }}>
              🔥 Top voted
            </button>
            <button onClick={() => setSortBy('new')} style={{ padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 500, border: 'none', background: sortBy === 'new' ? '#c0522a' : '#e4dfd3', color: sortBy === 'new' ? '#fff' : '#4a4640', cursor: 'pointer' }}>
              ✨ Newest
            </button>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: 40, color: '#8a847a', fontSize: 13 }}>Loading...</div>}

          {!loading && sorted.length === 0 && (
            <div style={{ textAlign: 'center', padding: 48, color: '#8a847a' }}>
              <div style={{ fontFamily: 'Lora, serif', fontSize: 18, color: '#1c1a16', marginBottom: 8 }}>No prompts yet</div>
              <p style={{ fontSize: 13, marginBottom: 16 }}>Be the first to submit a prompt to the community!</p>
              <button onClick={() => setTab('submit')} style={{ padding: '8px 20px', background: '#c0522a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                Submit the first prompt →
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sorted.map(p => (
              <div key={p.id} style={{ background: '#fff', border: `1px solid ${p.approved ? '#2a6b4a' : '#d5cfc3'}`, borderRadius: 10, padding: 18 }}>
                
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: CAT_COLORS[p.category], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {p.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#1c1a16' }}>{p.author_name}</div>
                      <div style={{ fontSize: 10, color: '#8a847a' }}>{new Date(p.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {p.approved && (
                      <span style={{ fontSize: 10, fontWeight: 600, background: '#d5ede2', color: '#2a6b4a', padding: '2px 8px', borderRadius: 10 }}>✓ In Library</span>
                    )}
                    <span style={{ fontSize: 10, fontWeight: 500, background: '#f0ddd5', color: CAT_COLORS[p.category], padding: '2px 8px', borderRadius: 10 }}>{p.category}</span>
                  </div>
                </div>

                {/* Title */}
                <div style={{ fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 600, color: '#1c1a16', marginBottom: 6 }}>{p.title}</div>
                
                {/* Description */}
                {p.description && (
                  <div style={{ fontSize: 11, color: '#8a847a', fontStyle: 'italic', marginBottom: 8 }}>{p.description}</div>
                )}

                {/* Prompt body */}
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: '#4a4640', lineHeight: 1.75, background: '#f5f0e8', borderRadius: 5, padding: '10px 12px', marginBottom: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{p.body}</div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Vote button */}
                    <button onClick={() => vote(p.id, p.votes, p.userVoted || false)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${p.userVoted ? '#c0522a' : '#d5cfc3'}`, background: p.userVoted ? '#f0ddd5' : 'transparent', color: p.userVoted ? '#c0522a' : '#4a4640', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'Outfit, sans-serif' }}>
                      <span style={{ fontSize: 14 }}>↑</span>
                      <span style={{ fontWeight: 600 }}>{p.votes}</span>
                      <span>{p.userVoted ? 'Upvoted' : 'Upvote'}</span>
                    </button>

                    {/* Progress to 50 */}
                    {!p.approved && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 80, height: 4, background: '#e4dfd3', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(p.votes / 50 * 100, 100)}%`, background: '#c0522a', borderRadius: 2, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: 10, color: '#8a847a' }}>{p.votes}/50</span>
                      </div>
                    )}
                  </div>

                  <button onClick={() => navigator.clipboard?.writeText(p.body)} style={{ padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid #d5cfc3', background: 'transparent', color: '#4a4640', fontFamily: 'Outfit, sans-serif' }}>
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMIT TAB */}
      {tab === 'submit' && (
        <div style={{ maxWidth: 600 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
              <div style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Prompt submitted!</div>
              <p style={{ fontSize: 13, color: '#8a847a' }}>Taking you to the feed...</p>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 12, padding: 24 }}>
              <div style={{ fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Submit a prompt</div>
              <p style={{ fontSize: 12, color: '#8a847a', marginBottom: 20 }}>Share a prompt that has genuinely improved your work. Get 50 upvotes to join the official library.</p>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a847a', marginBottom: 5 }}>Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Pre-mortem facilitator" style={{ width: '100%', padding: '8px 11px', background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 6, fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#1c1a16', outline: 'none' }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a847a', marginBottom: 5 }}>Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))} style={{ width: '100%', padding: '8px 11px', background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 6, fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#1c1a16', outline: 'none', cursor: 'pointer' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a847a', marginBottom: 5 }}>Prompt text</label>
                <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Write your prompt here. Use [variable] for dynamic fields — e.g. [client name], [industry]" style={{ width: '100%', padding: '10px 12px', background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#1c1a16', lineHeight: 1.75, minHeight: 140, resize: 'vertical', outline: 'none' }} />
                <div style={{ fontSize: 10, color: '#8a847a', marginTop: 4 }}>Tip: use [brackets] for variables — they become fill-in fields in the runner.</div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a847a', marginBottom: 5 }}>When to use this (optional)</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Best before kicking off a new project" style={{ width: '100%', padding: '8px 11px', background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 6, fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#1c1a16', outline: 'none' }} />
              </div>

              <button onClick={handleSubmitClick} disabled={submitting} style={{ width: '100%', padding: 12, background: '#c0522a', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Submitting...' : termsAccepted ? 'Submit to community →' : 'Review terms & submit →'}
              </button>

              {!termsAccepted && (
                <p style={{ fontSize: 11, color: '#8a847a', textAlign: 'center', marginTop: 8 }}>
                  You'll be asked to agree to community guidelines before submitting.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
