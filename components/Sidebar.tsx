'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/plan', icon: '⊡', label: 'Plan de salle' },
  { href: '/catalogue', icon: '☰', label: 'Catalogue' },
  { href: '/presentoirs', icon: '↔', label: 'Présentoirs' },
  { href: '/planning', icon: '◫', label: 'Planning équipe' },
]

const SETTINGS_ITEMS = [
  { href: '/parametres/equipe', icon: '◎', label: 'Équipe' },
  { href: '/parametres/zones', icon: '▣', label: 'Zones' },
  { href: '/parametres/mot-de-passe', icon: '⊕', label: 'Mot de passe' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      style={{
        width: 230,
        minWidth: 230,
        background: '#18181B',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(to top, rgba(181,118,58,0.08), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div
        style={{
          padding: '22px 18px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: '#B5763A',
              borderRadius: 6,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              padding: 4,
              flexShrink: 0,
            }}
          >
            <span style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }} />
            <span style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 1 }} />
            <span style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 1 }} />
            <span style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 16,
              color: '#fff',
              letterSpacing: 0.3,
            }}
          >
            ExpoCarrelage
          </span>
        </div>
        <p
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.28)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginTop: 3,
          }}
        >
          Gestion expo
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <p
          style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: 'rgba(255,255,255,0.2)',
            padding: '12px 8px 5px',
          }}
        >
          Navigation
        </p>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 10px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                borderRadius: 8,
                background: isActive ? 'rgba(181,118,58,0.15)' : 'transparent',
                textDecoration: 'none',
                marginBottom: 1,
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  width: 20,
                  textAlign: 'center',
                  color: isActive ? '#B5763A' : 'inherit',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}

        <p
          style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: 'rgba(255,255,255,0.2)',
            padding: '16px 8px 5px',
          }}
        >
          Paramètres
        </p>

        {SETTINGS_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 10px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                borderRadius: 8,
                background: isActive ? 'rgba(181,118,58,0.15)' : 'transparent',
                textDecoration: 'none',
                marginBottom: 1,
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  width: 20,
                  textAlign: 'center',
                  color: isActive ? '#B5763A' : 'inherit',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '14px 14px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#B5763A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            E
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Équipe</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>7 membres actifs</p>
          </div>
          <button
            onClick={handleLogout}
            title="Déconnexion"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              fontSize: 14,
              padding: 4,
              borderRadius: 4,
              transition: 'color 0.15s',
            }}
            onMouseOver={(e) => ((e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)')}
            onMouseOut={(e) => ((e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)')}
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  )
}
