'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

interface Props {
  onClose: () => void
}

export default function UpgradeModal({ onClose }: Props) {
  const { user } = useUser()
  const [loading, setLoading] = useState<'monthly' | 'annual' | null>(null)

  const checkout = async (plan: 'monthly' | 'annual') => {
    setLoading(plan)
    try {
      const priceId = plan === 'monthly'
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user?.id,
          email: user?.emailAddresses[0]?.emailAddress,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Something went wrong — please try again')
    }
    setLoading(null)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,26,22,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 16, padding: 36, width: 480, maxWidth: '90vw', position: 'relative' }}>
        
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#8a847a' }}>✕</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: '#c0522a', marginBottom: 8 }}>Upgrade to Pro</div>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 26, fontWeight: 700, color: '#1c1a16', marginBottom: 8 }}>Unlock the full library</h2>
          <p style={{ fontSize: 13, color: '#4a4640', lineHeight: 1.7 }}>Get unlimited prompts, unlimited AI improvements, and full access to every category.</p>
        </div>

        {/* Features */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 16, marginBottom: 24 }}>
          {[
            'All 32+ curated prompts unlocked',
            'Unlimited AI prompt improvements',
            'Version history for every prompt',
            'Export and share prompt packs',
            'Priority support',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#1c1a16', marginBottom: 10 }}>
              <span style={{ color: '#c0522a', fontWeight: 700, fontSize: 14 }}>✓</span>{f}
            </div>
          ))}
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          
          {/* Monthly */}
          <button onClick={() => checkout('monthly')} disabled={loading !== null} style={{ padding: '16px 12px', background: '#fff', border: '2px solid #d5cfc3', borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', opacity: loading !== null ? 0.7 : 1 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', color: '#8a847a', marginBottom: 6 }}>Monthly</div>
            <div style={{ fontFamily: 'Lora, serif', fontSize: 28, fontWeight: 700, color: '#1c1a16', lineHeight: 1 }}>$19</div>
            <div style={{ fontSize: 11, color: '#8a847a', marginTop: 4 }}>per month</div>
            <div style={{ marginTop: 12, padding: '7px', background: '#1c1a16', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
              {loading === 'monthly' ? 'Loading...' : 'Choose Monthly'}
            </div>
          </button>

          {/* Annual */}
          <button onClick={() => checkout('annual')} disabled={loading !== null} style={{ padding: '16px 12px', background: '#1c1a16', border: '2px solid #c0522a', borderRadius: 10, cursor: 'pointer', textAlign: 'center', position: 'relative', opacity: loading !== null ? 0.7 : 1 }}>
            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#c0522a', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 10, whiteSpace: 'nowrap' }}>SAVE 2 MONTHS</div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Annual</div>
            <div style={{ fontFamily: 'Lora, serif', fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1 }}>$190</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>per year · $15.83/mo</div>
            <div style={{ marginTop: 12, padding: '7px', background: '#c0522a', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
              {loading === 'annual' ? 'Loading...' : 'Choose Annual'}
            </div>
          </button>

        </div>

        <p style={{ fontSize: 11, color: '#8a847a', textAlign: 'center' }}>
          Secure payment via Stripe · Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  )
}
