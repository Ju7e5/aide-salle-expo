export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F7F5F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <p style={{ fontSize: 48, fontWeight: 700, color: '#E4E0DA' }}>404</p>
      <p style={{ fontSize: 16, color: '#71717A' }}>Page introuvable</p>
      <a
        href="/dashboard"
        style={{
          marginTop: 8,
          padding: '9px 20px',
          background: '#B5763A',
          color: '#fff',
          borderRadius: 8,
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Retour au dashboard
      </a>
    </div>
  )
}
