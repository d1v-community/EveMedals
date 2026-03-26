export default function WarriorNotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'var(--sds-dark)' }}
    >
      <div className="text-center flex flex-col items-center gap-6">
        <div className="sds-radar-ring" style={{ width: 80, height: 80, opacity: 0.4 }} />
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--sds-font-mono)' }}
          >
            Profile not found
          </p>
          <h1
            className="text-2xl font-bold uppercase tracking-wider"
            style={{ color: '#f0642f', fontFamily: 'var(--sds-font-display)' }}
          >
            Void Drifter
          </h1>
          <p
            className="mt-2 text-sm max-w-xs"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--sds-font-mono)' }}
          >
            The address you entered is invalid or has no activity on record.
          </p>
        </div>
        <a
          href="/"
          className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
          style={{ color: '#f0642f', fontFamily: 'var(--sds-font-mono)' }}
        >
          ← Return to Chronicle
        </a>
      </div>
    </main>
  )
}
