'use client'

interface Props {
  onAccept: () => void
  onClose: () => void
}

export default function CommunityTerms({ onAccept, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,26,22,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ background: '#f5f0e8', border: '1px solid #d5cfc3', borderRadius: 16, padding: 36, width: 540, maxWidth: '90vw', maxHeight: '85vh', overflow: 'auto', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#8a847a' }}>✕</button>

        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: '#c0522a', marginBottom: 8 }}>Community Guidelines</div>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: 22, fontWeight: 700, color: '#1c1a16', marginBottom: 20 }}>How the community works</h2>

        {/* How it works */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 600, marginBottom: 14 }}>The submission process</div>
          {[
            { step: '1', title: 'Submit your prompt', desc: 'Share a prompt that has genuinely improved your work. Include a title, category, and a short note on when to use it.' },
            { step: '2', title: 'Community votes', desc: 'Other PromptVault users can upvote prompts they find useful. Each user gets one vote per prompt.' },
            { step: '3', title: 'Approved at 50 votes', desc: 'When your prompt reaches 50 upvotes it automatically joins the official library. You\'ll be credited as the author.' },
          ].map(s => (
            <div key={s.step} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#c0522a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1c1a16', marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#4a4640', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Terms */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Terms & conditions</div>
          <div style={{ fontSize: 12, color: '#4a4640', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 10 }}><strong>1. Original content.</strong> By submitting a prompt, you confirm it is your own original work and does not infringe on any third-party intellectual property rights.</p>
            <p style={{ marginBottom: 10 }}><strong>2. License grant.</strong> By submitting, you grant PromptVault a non-exclusive, royalty-free license to display, distribute, and incorporate your prompt into the official library if it reaches 50 votes.</p>
            <p style={{ marginBottom: 10 }}><strong>3. No harmful content.</strong> Prompts must not be designed to generate harmful, illegal, discriminatory, or deceptive content. PromptVault reserves the right to remove any submission at its discretion.</p>
            <p style={{ marginBottom: 10 }}><strong>4. No spam.</strong> Do not submit duplicate prompts, low-effort content, or prompts designed to game the voting system. Accounts found manipulating votes will be banned.</p>
            <p style={{ marginBottom: 10 }}><strong>5. Professional standard.</strong> This is a professional tool. Submissions should be practical, specific, and genuinely useful for consulting or analytical work.</p>
            <p style={{ marginBottom: 10 }}><strong>6. Attribution.</strong> Your display name will be shown as the author of approved prompts. Make sure your Clerk profile name is how you want to be credited.</p>
            <p><strong>7. Moderation.</strong> PromptVault reserves the right to edit, remove, or decline to approve any submission that does not meet community standards, without notice.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, background: 'transparent', border: '1px solid #d5cfc3', borderRadius: 8, fontFamily: 'Outfit, sans-serif', fontSize: 13, cursor: 'pointer', color: '#4a4640' }}>
            Cancel
          </button>
          <button onClick={onAccept} style={{ flex: 2, padding: 12, background: '#c0522a', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            I agree — submit my prompt
          </button>
        </div>
      </div>
    </div>
  )
}
