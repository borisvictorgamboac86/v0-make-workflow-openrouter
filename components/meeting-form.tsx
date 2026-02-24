"use client"

import { useState, useCallback } from "react"

// ← URL de webhook de Make.com
const WEBHOOK_URL = "https://hook.us2.make.com/0w29p2a69hbi2xduqx83ze83kqmydcf5"

interface MeetingFormProps {
  addLog: (entry: string) => void
}

function getTimestamp() {
  const now = new Date()
  return now.toLocaleTimeString("es-MX", { hour12: false })
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
  fontSize: 14,
  color: "#2c3e50",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #dce1e7",
  borderRadius: 6,
  fontSize: 14,
  fontFamily: "system-ui, sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  background: "#fff",
  color: "#1a1a1a",
}

const inputFocusColor = "#2980b9"

const errorStyle: React.CSSProperties = {
  color: "#e74c3c",
  fontSize: 13,
  marginTop: 4,
}

export function MeetingForm({ addLog }: MeetingFormProps) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [fecha, setFecha] = useState("")
  const [estadoOperativo, setEstadoOperativo] = useState("")
  const [incidencias, setIncidencias] = useState("")
  const [notas, setNotas] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const handleFieldChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value)
    addLog(`[${getTimestamp()}] [FIELD] Campo modificado: ${field}`)
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}

    if (!nombre.trim()) newErrors.nombre = "Este campo es obligatorio"
    if (!email.trim()) {
      newErrors.email = "Este campo es obligatorio"
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = "Formato de correo no valido"
    }
    if (!fecha) newErrors.fecha = "Este campo es obligatorio"
    if (!estadoOperativo.trim()) newErrors.estadoOperativo = "Este campo es obligatorio"
    if (!incidencias.trim()) newErrors.incidencias = "Este campo es obligatorio"

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const payload = {
      ingeniero: nombre.trim(),
      email_ingeniero: email.trim(),
      fecha_reunion: fecha,
      estado_operativo: estadoOperativo.trim(),
      incidencias: incidencias.trim(),
      notas_adicionales: notas.trim(),
      timestamp: new Date().toISOString(),
    }

    addLog(`[${getTimestamp()}] [SEND] Iniciando envio a: ${WEBHOOK_URL}`)
    addLog(`[${getTimestamp()}] [PAYLOAD] ${JSON.stringify(payload, null, 2)}`)

    setSending(true)

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        addLog(`[${getTimestamp()}] [SUCCESS] ${res.status} OK — Acta enviada correctamente`)
        showToast("success", "Acta enviada correctamente")
        // Clear form
        setNombre("")
        setEmail("")
        setFecha("")
        setEstadoOperativo("")
        setIncidencias("")
        setNotas("")
        setErrors({})
      } else {
        addLog(`[${getTimestamp()}] [ERROR] ${res.status} ${res.statusText}`)
        showToast("error", "Error al enviar. Revisa el panel de debug.")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      addLog(`[${getTimestamp()}] [ERROR] ${message}`)
      showToast("error", "Error al enviar. Revisa el panel de debug.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 16px 120px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            padding: "14px 24px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: toast.type === "success" ? "#27ae60" : "#e74c3c",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            animation: "fadeInDown 0.3s ease",
            maxWidth: "90vw",
            textAlign: "center",
          }}
        >
          {toast.type === "success" ? "✅ " : "❌ "}
          {toast.message}
        </div>
      )}

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ background: "#1a252f", padding: "24px 32px" }}>
          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Acta de Reunion Semanal
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              color: "#94a3b8",
              fontSize: 14,
              fontWeight: 400,
            }}
          >
            {"Direccion de Operacion y Mantenimiento de Sistemas de Bombeo"}
          </p>
        </div>

        {/* Form body */}
        <div style={{ padding: "28px 32px 36px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Nombre */}
            <div>
              <label style={labelStyle}>Nombre del ingeniero</label>
              <input
                type="text"
                placeholder="Ej: Ricardo Diaz"
                value={nombre}
                onChange={(e) => handleFieldChange("nombre", e.target.value, setNombre)}
                onFocus={(e) => (e.target.style.borderColor = inputFocusColor)}
                onBlur={(e) => (e.target.style.borderColor = "#dce1e7")}
                style={inputStyle}
              />
              {errors.nombre && <div style={errorStyle}>{errors.nombre}</div>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Correo electronico</label>
              <input
                type="email"
                placeholder="ingeniero@empresa.com"
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value, setEmail)}
                onFocus={(e) => (e.target.style.borderColor = inputFocusColor)}
                onBlur={(e) => (e.target.style.borderColor = "#dce1e7")}
                style={inputStyle}
              />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>

            {/* Fecha */}
            <div>
              <label style={labelStyle}>Fecha de reunion</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => handleFieldChange("fecha", e.target.value, setFecha)}
                onFocus={(e) => (e.target.style.borderColor = inputFocusColor)}
                onBlur={(e) => (e.target.style.borderColor = "#dce1e7")}
                style={{ ...inputStyle, colorScheme: "light" }}
              />
              {errors.fecha && <div style={errorStyle}>{errors.fecha}</div>}
            </div>

            {/* Estado operativo */}
            <div>
              <label style={labelStyle}>Estado operativo general</label>
              <textarea
                placeholder="Describe el estado general de los sistemas a cargo del ingeniero esta semana..."
                rows={4}
                value={estadoOperativo}
                onChange={(e) =>
                  handleFieldChange("estadoOperativo", e.target.value, setEstadoOperativo)
                }
                onFocus={(e) => (e.target.style.borderColor = inputFocusColor)}
                onBlur={(e) => (e.target.style.borderColor = "#dce1e7")}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              {errors.estadoOperativo && <div style={errorStyle}>{errors.estadoOperativo}</div>}
            </div>

            {/* Incidencias */}
            <div>
              <label style={labelStyle}>Incidencias o fallas</label>
              <textarea
                placeholder="Detalla fallas registradas, equipos afectados, acciones tomadas. Si no hubo incidencias, indicalo."
                rows={4}
                value={incidencias}
                onChange={(e) =>
                  handleFieldChange("incidencias", e.target.value, setIncidencias)
                }
                onFocus={(e) => (e.target.style.borderColor = inputFocusColor)}
                onBlur={(e) => (e.target.style.borderColor = "#dce1e7")}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              {errors.incidencias && <div style={errorStyle}>{errors.incidencias}</div>}
            </div>

            {/* Notas */}
            <div>
              <label style={labelStyle}>Notas adicionales (opcional)</label>
              <textarea
                placeholder="Cualquier otro punto tratado en la reunion..."
                rows={3}
                value={notas}
                onChange={(e) => handleFieldChange("notas", e.target.value, setNotas)}
                onFocus={(e) => (e.target.style.borderColor = inputFocusColor)}
                onBlur={(e) => (e.target.style.borderColor = "#dce1e7")}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={sending}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: sending ? "#6ba3c7" : "#2980b9",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 16,
                fontWeight: 600,
                cursor: sending ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                fontFamily: "system-ui, sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!sending) (e.target as HTMLButtonElement).style.background = "#1f6fa0"
              }}
              onMouseLeave={(e) => {
                if (!sending) (e.target as HTMLButtonElement).style.background = "#2980b9"
              }}
            >
              {sending ? "Enviando..." : "Enviar acta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
