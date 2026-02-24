"use client"

import { useEffect, useRef } from "react"

interface DebugDrawerProps {
  isOpen: boolean
  onToggle: () => void
  logs: string[]
  onClear: () => void
}

export function DebugDrawer({ isOpen, onToggle, logs, onClear }: DebugDrawerProps) {
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, isOpen])

  return (
    <>
      {/* Debug toggle button */}
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 18px",
          fontSize: 14,
          cursor: "pointer",
          fontFamily: "system-ui, sans-serif",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {"⚙ Debug"}
      </button>

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: `translateX(-50%) translateY(${isOpen ? "0" : "100%"})`,
          width: "100%",
          maxWidth: 680,
          height: "35vh",
          zIndex: 9998,
          background: "#0f0f0f",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
          boxShadow: isOpen ? "0 -4px 20px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: "1px solid #222",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: "#fff",
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            CONSOLE — DEBUG LOG
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={onClear}
              style={{
                background: "none",
                border: "none",
                color: "#888",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "'Courier New', monospace",
              }}
            >
              Limpiar log
            </button>
            <button
              onClick={onToggle}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                fontFamily: "system-ui, sans-serif",
              }}
              aria-label="Cerrar panel de debug"
            >
              {"✕"}
            </button>
          </div>
        </div>

        {/* Log area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 16px",
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            color: "#00ff88",
            lineHeight: 1.6,
          }}
        >
          {logs.length === 0 ? (
            <span style={{ color: "#555" }}>No hay registros.</span>
          ) : (
            logs.map((log, i) => (
              <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {log}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </>
  )
}
