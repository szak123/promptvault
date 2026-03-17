import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'Outfit, sans-serif', background: '#f5f0e8', minHeight: '100vh', color: '#1c1a16' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245,240,232,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #d5cfc3', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 700 }}>
          Prompt<span style={{ color: '#c0522a' }}>Vault</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/sign-in" style={{ fontSize: 13, color: '#4a4640', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/sign-up" style={{ padding: '8px 20px', background: '#c0522a', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#d5cfc3 1px,transparent 1px),linear-gradient(90deg,#d5cfc3 1px,transparent 1px)', backgroundSize: '60px 60px', opacity: 0.3, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 80, alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: '#c0522a', marginBottom: 20 }}>
              For analysts &amp; consultants
            </div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(40px,5.5vw,68px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -1.5, marginBottom: 24 }}>
              Stop losing your<br /><em style={{ color: '#c0522a' }}>best prompts</em><br />to sticky notes
            </h1>
            <p style={{ fontSize: 17, color: '#4a4640', lineHeight: 1.7, fontWeight: 300, maxWidth: 480, marginBottom: 36 }}>
              PromptVault is a curated library of 32+ proven prompts for consulting and analytical work — organized, templated, and ready to run. Never start from a blank page again.
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/sign-up" style={{ padding: '14px 28px', background: '#c0522a', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
                Start free — no card needed
              </Link>
              <Link href="/sign-in" style={{ padding: '14px 28px', background: 'transparent', color: '#1c1a16', border: '1.5px solid #d5cfc3', borderRadius: 8, fontSize: 15, textDecoration: 'none' }}>
                Sign in →
              </Link>
            </div>
            <p style={{ fontSize: 12, color: '#8a847a', marginTop: 14 }}>Free plan includes 10 prompts · Upgrade to Pro for full access</p>
          </div>

          {/* Hero card */}
          <div style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 16, padding: 28, boxShadow: '0 8px 40px rgba(24,22,15,0.10)' }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a847a', marginBottom: 14, fontWeight: 500 }}>
              Example — Meeting prep brief
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#4a4640', lineHeight: 1.8, background: '#ede8de', borderRadius: 8, padding: 14, marginBottom: 14, borderLeft: '3px solid #c0522a' }}>
              I have a meeting with <strong style={{ color: '#c0522a' }}>[client name]</strong> at{' '}
              <strong style={{ color: '#c0522a' }}>[company]</strong> on{' '}
              <strong style={{ color: '#c0522a' }}>[date]</strong>. Topic:{' '}
              <strong style={{ color: '#c0522a' }}>[topic]</strong>. Prepare smart questions, key points, potential objections, and what a great outcome looks like.
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {['client name', 'company', 'date', 'topic'].map(v => (
                <span key={v} style={{ padding: '5px 10px', background: '#f0ddd5', borderRadius: 20, fontSize: 11, fontWeight: 500, color: '#c0522a' }}>
                  {v}
                </span>
              ))}
            </div>
            <Link href="/sign-up" style={{ display: 'block', width: '100%', padding: 10, background: '#c0522a', color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 500, textAlign: 'center', textDecoration: 'none' }}>
              ▷ Try it free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background: '#1c1a16', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
        {[['32+','Curated prompts'],['8','Work categories'],['AI','Prompt improver'],['∞','Variable templates']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Lora, serif', fontSize: 28, fontWeight: 700, color: '#fff' }}>{num}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section style={{ padding: '80px 40px', background: '#ede8de' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, marginBottom: 48, letterSpacing: -1 }}>
            Built for how <em>analysts actually work</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { icon: '▤', title: 'Organized library', desc: 'Every prompt tagged, searchable, and categorized across 8 work categories.', tag: 'CORE' },
              { icon: '⬡', title: 'Variable templates', desc: 'Use [brackets] for dynamic fields — auto-generated as fill-in inputs.', tag: 'SAVES TIME' },
              { icon: '✦', title: 'AI Prompt Improver', desc: 'Paste a rough prompt, get a sharper version back with a full explanation.', tag: 'AI POWERED' },
              { icon: '◈', title: '32+ starter prompts', desc: 'Practitioner-written prompts for issue trees, exec summaries, meeting prep, and more.', tag: 'DAY ONE VALUE' },
              { icon: '◎', title: 'Community voting', desc: 'Submit prompts, get upvotes. Hit 10 votes and join the official library.', tag: 'COMMUNITY' },
              { icon: '↗', title: 'Team sharing', desc: 'Share prompt packs so everyone on your team prompts from the same playbook.', tag: 'PRO' },
            ].map(f => (
              <div key={f.title} style={{ background: '#fff', border: '1px solid #d5cfc3', borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#4a4640', lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</div>
                <div style={{ display: 'inline-block', marginTop: 12, padding: '2px 8px', background: '#f0ddd5', color: '#c0522a', borderRadius: 10, fontSize: 10, fontWeight: 500 }}>{f.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
            Simple, transparent <em>pricing</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { tier: 'Free', price: '$0', period: 'forever', features: ['10 prompts','Variable runner','3 AI improvements/mo','Starter pack subset','Search & tags'], cta: 'Get started free', href: '/sign-up', featured: false },
              { tier: 'Pro', price: '$19', period: 'per month', features: ['Unlimited prompts','All 32+ prompts','Unlimited AI improvements','Version history','Export packs','Priority support'], cta: 'Start Pro', href: '/sign-up', featured: true },
              { tier: 'Team', price: '$49', period: 'per month · 5 users', features: ['Everything in Pro','Shared team library','Shared prompt packs','Admin controls','Usage analytics','Onboarding call'], cta: 'Get Team plan', href: '/sign-up', featured: false },
            ].map(p => (
              <div key={p.tier} style={{ background: p.featured ? '#1c1a16' : '#fff', border: `2px solid ${p.featured ? '#c0522a' : '#d5cfc3'}`, borderRadius: 16, padding: 28, position: 'relative' }}>
                {p.featured && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#c0522a', color: '#fff', fontSize: 11, fontWeight: 500, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    Most popular
                  </div>
                )}
                <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, color: p.featured ? 'rgba(255,255,255,0.5)' : '#8a847a', marginBottom: 10 }}>{p.tier}</div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 36, fontWeight: 700, color: p.featured ? '#fff' : '#1c1a16', lineHeight: 1, marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 12, color: p.featured ? 'rgba(255,255,255,0.4)' : '#8a847a', marginBottom: 20 }}>{p.period}</div>
                <div style={{ height: 1, background: p.featured ? 'rgba(255,255,255,0.15)' : '#d5cfc3', marginBottom: 20 }} />
                <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: p.featured ? 'rgba(255,255,255,0.8)' : '#4a4640', marginBottom: 10 }}>
                      <span style={{ color: '#c0522a', fontWeight: 700 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} style={{ display: 'block', padding: 11, background: p.featured ? '#fff' : '#c0522a', color: p.featured ? '#1c1a16' : '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, textAlign: 'center', textDecoration: 'none' }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#c0522a', padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
          Get the free analyst prompt pack
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 28, fontWeight: 300 }}>
          10 practitioner-written prompts for consulting work — free, no card needed.
        </p>
        <Link href="/sign-up" style={{ display: 'inline-block', padding: '13px 28px', background: '#fff', color: '#c0522a', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          Start for free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1c1a16', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: 'Lora, serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>
          Prompt<span style={{ color: '#c0522a' }}>Vault</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© 2026 PromptVault · Built for people who think for a living.</div>
      </footer>
    </main>
  )
}
