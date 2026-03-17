import Link from 'next/link'

export default function SmallBusinessPage() {
  return (
    <main style={{ fontFamily: 'Outfit, sans-serif', background: '#f0f7f0', minHeight: '100vh', color: '#1a2e1a' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(240,247,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #c8ddc8', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 700, color: '#1a2e1a', textDecoration: 'none' }}>
            Prompt<span style={{ color: '#2d7a2d' }}>Vault</span>
          </Link>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', background: '#2d7a2d', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>Small Business</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/sign-in" style={{ fontSize: 13, color: '#3a5a3a', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/sign-up" style={{ padding: '8px 20px', background: '#2d7a2d', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#c8ddc8 1px,transparent 1px),linear-gradient(90deg,#c8ddc8 1px,transparent 1px)', backgroundSize: '60px 60px', opacity: 0.3, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 80, alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: '#2d7a2d', marginBottom: 20 }}>
              For small business owners
            </div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(38px,5vw,64px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -1.5, marginBottom: 24 }}>
              Run your business<br /><em style={{ color: '#2d7a2d' }}>smarter</em> with AI<br />prompts that work
            </h1>
            <p style={{ fontSize: 17, color: '#3a5a3a', lineHeight: 1.7, fontWeight: 300, maxWidth: 480, marginBottom: 36 }}>
              24 ready-to-use AI prompts for small business owners — covering taxes, marketing, operations, customer service, and strategy. Stop reinventing the wheel every time you open ChatGPT.
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/sign-up" style={{ padding: '14px 28px', background: '#2d7a2d', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
                Get the free small business pack →
              </Link>
            </div>
            <p style={{ fontSize: 12, color: '#6a8a6a', marginTop: 14 }}>Free plan includes 10 prompts · No credit card needed</p>
          </div>

          {/* Hero card */}
          <div style={{ background: '#fff', border: '1px solid #c8ddc8', borderRadius: 16, padding: 28, boxShadow: '0 8px 40px rgba(26,46,26,0.10)' }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#6a8a6a', marginBottom: 14, fontWeight: 500 }}>
              Example — Tax prep checklist
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#3a5a3a', lineHeight: 1.8, background: '#e8f5e8', borderRadius: 8, padding: 14, marginBottom: 14, borderLeft: '3px solid #2d7a2d' }}>
              Generate a tax prep checklist for a <strong style={{ color: '#2d7a2d' }}>[business type]</strong> with <strong style={{ color: '#2d7a2d' }}>[employees]</strong> employees in <strong style={{ color: '#2d7a2d' }}>[state]</strong>. Include documents, deadlines, deductions, and questions to ask my accountant.
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {['business type', 'employees', 'state'].map(v => (
                <span key={v} style={{ padding: '5px 10px', background: '#d5edd5', borderRadius: 20, fontSize: 11, fontWeight: 500, color: '#2d7a2d' }}>
                  {v}
                </span>
              ))}
            </div>
            <Link href="/sign-up" style={{ display: 'block', width: '100%', padding: 10, background: '#2d7a2d', color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 500, textAlign: 'center', textDecoration: 'none' }}>
              ▷ Try it free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background: '#1a2e1a', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
        {[['24','Small biz prompts'],['6','Categories'],['∞','Variable templates'],['AI','Prompt improver']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Lora, serif', fontSize: 28, fontWeight: 700, color: '#fff' }}>{num}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section style={{ padding: '80px 40px', background: '#e4f0e4' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, marginBottom: 48, letterSpacing: -1 }}>
            Every part of your business <em>covered</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { icon: '💰', title: 'Finance & Tax', desc: 'P&L summaries, cash flow forecasts, tax prep checklists, pricing calculators, invoice follow-ups.', count: '5 prompts' },
              { icon: '📣', title: 'Marketing & PR', desc: 'Social media calendars, Google Business profiles, email newsletters, ad copy, review responses.', count: '5 prompts' },
              { icon: '⚙️', title: 'Operations', desc: 'SOPs, job descriptions, vendor comparisons, meeting agendas — run a tighter ship.', count: '4 prompts' },
              { icon: '⚖️', title: 'Legal & Compliance', desc: 'Contract summaries in plain English, privacy policies, refund policies — without the lawyer fees.', count: '3 prompts' },
              { icon: '🤝', title: 'Customer Service', desc: 'Complaint responses, FAQ pages, onboarding emails — keep customers happy and coming back.', count: '3 prompts' },
              { icon: '🎯', title: 'Strategy & Growth', desc: 'Business plan one-pagers, SWOT analysis, competitor research, 90-day action plans.', count: '4 prompts' },
            ].map(f => (
              <div key={f.title} style={{ background: '#fff', border: '1px solid #c8ddc8', borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#3a5a3a', lineHeight: 1.7, fontWeight: 300, marginBottom: 12 }}>{f.desc}</div>
                <div style={{ display: 'inline-block', padding: '2px 8px', background: '#d5edd5', color: '#2d7a2d', borderRadius: 10, fontSize: 10, fontWeight: 500 }}>{f.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, marginBottom: 20 }}>
            Built for the <em>owner who does it all</em>
          </h2>
          <p style={{ fontSize: 16, color: '#3a5a3a', lineHeight: 1.75, marginBottom: 48, fontWeight: 300 }}>
            You're the CEO, the marketer, the accountant, the customer service rep, and the janitor. PromptVault gives you a shortcut for every hat you wear.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, textAlign: 'left' }}>
            {[
              { type: 'Restaurant owners', example: '"Write my Google Business description and a response to my last 1-star review"' },
              { type: 'Freelancers & agencies', example: '"Create an SOP for my client onboarding and write a late invoice follow-up"' },
              { type: 'Retail & e-commerce', example: '"Draft my refund policy and write 3 Facebook ad variations for my sale"' },
              { type: 'Service businesses', example: '"Build a 90-day plan to get 10 new clients and write a welcome email for new ones"' },
              { type: 'Tradespeople & contractors', example: '"Write a job description for my first hire and a vendor comparison for materials"' },
              { type: 'Health & wellness', example: '"Create a tax prep checklist and draft my privacy policy for client data"' },
            ].map(item => (
              <div key={item.type} style={{ background: '#f0f7f0', border: '1px solid #c8ddc8', borderRadius: 10, padding: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2e1a', marginBottom: 8 }}>{item.type}</div>
                <div style={{ fontSize: 11, color: '#3a5a3a', lineHeight: 1.6, fontStyle: 'italic' }}>{item.example}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 40px', background: '#e4f0e4' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, marginBottom: 48 }}>
            Simple pricing for <em>small budgets</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { tier: 'Free', price: '$0', period: 'forever', features: ['10 prompts total', 'Variable fill-in runner', '3 AI improvements/month', 'Small biz starter pack (subset)'], cta: 'Start free', featured: false },
              { tier: 'Pro', price: '$19', period: 'per month', features: ['All 24 small biz prompts', 'All 32 analyst prompts', 'Unlimited AI improvements', 'My Prompts with folders', 'Favorites & organization', 'Community access'], cta: 'Start Pro', featured: true },
            ].map(p => (
              <div key={p.tier} style={{ background: p.featured ? '#1a2e1a' : '#fff', border: `2px solid ${p.featured ? '#2d7a2d' : '#c8ddc8'}`, borderRadius: 16, padding: 28, position: 'relative' }}>
                {p.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#2d7a2d', color: '#fff', fontSize: 11, fontWeight: 500, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>Most popular</div>}
                <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, color: p.featured ? 'rgba(255,255,255,0.5)' : '#6a8a6a', marginBottom: 10 }}>{p.tier}</div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 36, fontWeight: 700, color: p.featured ? '#fff' : '#1a2e1a', lineHeight: 1, marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 12, color: p.featured ? 'rgba(255,255,255,0.4)' : '#6a8a6a', marginBottom: 20 }}>{p.period}</div>
                <div style={{ height: 1, background: p.featured ? 'rgba(255,255,255,0.15)' : '#c8ddc8', marginBottom: 20 }} />
                <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: p.featured ? 'rgba(255,255,255,0.8)' : '#3a5a3a', marginBottom: 10 }}>
                      <span style={{ color: '#2d7a2d', fontWeight: 700 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" style={{ display: 'block', padding: 11, background: p.featured ? '#2d7a2d' : '#1a2e1a', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, textAlign: 'center', textDecoration: 'none' }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#2d7a2d', padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
          Get your free small business prompt pack
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 28, fontWeight: 300 }}>
          24 prompts covering every part of running a small business — free to start, no card needed.
        </p>
        <Link href="/sign-up" style={{ display: 'inline-block', padding: '13px 28px', background: '#fff', color: '#2d7a2d', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          Start for free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a2e1a', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: 'Lora, serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>
          Prompt<span style={{ color: '#2d7a2d' }}>Vault</span> <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>· Small Business</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© 2026 PromptVault · Built for owners who do it all.</div>
      </footer>
    </main>
  )
}
