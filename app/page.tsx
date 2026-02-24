"use client"

import { useState, useEffect, useCallback } from "react"
import { MeetingForm } from "@/components/meeting-form"
import { DebugDrawer } from "@/components/debug-drawer"

function getTimestamp() {
  const now = new Date()
  return now.toLocaleTimeString("es-MX", { hour12: false })
}

export default function Home() {
  const [logs, setLogs] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const addLog = useCallback((entry: string) => {
    setLogs((prev) => [...prev, entry])
  }, [])

  useEffect(() => {
    addLog(`[${getTimestamp()}] [INFO] Formulario inicializado`)
  }, [addLog])

  return (
    <>
      <MeetingForm addLog={addLog} />
      <DebugDrawer
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((prev) => !prev)}
        logs={logs}
        onClear={() => setLogs([])}
      />
    </>
  )
}
