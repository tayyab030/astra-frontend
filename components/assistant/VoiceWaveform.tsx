"use client"

import { useEffect, useRef } from "react"

const BAR_COUNT = 40

type VoiceWaveformProps = {
  stream: MediaStream | null
  active: boolean
  className?: string
}

/**
 * ChatGPT-style live voice bars using Web Audio AnalyserNode (frequency/pitch bands).
 */
export function VoiceWaveform({ stream, active, className }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

  useEffect(() => {
    if (!active || !stream) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      sourceRef.current?.disconnect()
      sourceRef.current = null
      analyserRef.current?.disconnect()
      analyserRef.current = null
      void audioContextRef.current?.close()
      audioContextRef.current = null
      return
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const audioContext = new AudioCtx()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.72
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    sourceRef.current = source

    const data = new Uint8Array(analyser.frequencyBinCount)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    const draw = () => {
      if (!canvas || !ctx || !analyserRef.current) return
      const { width, height } = canvas
      analyserRef.current.getByteFrequencyData(data)

      ctx.clearRect(0, 0, width, height)

      const gap = 3
      const barWidth = Math.max(2, (width - gap * (BAR_COUNT - 1)) / BAR_COUNT)
      const step = Math.max(1, Math.floor(data.length / BAR_COUNT))

      for (let i = 0; i < BAR_COUNT; i += 1) {
        const sampleIndex = Math.min(data.length - 1, i * step)
        const raw = data[sampleIndex] / 255
        const boosted = Math.pow(raw, 0.85)
        const barHeight = Math.max(4, boosted * height * 0.92)
        const x = i * (barWidth + gap)
        const y = (height - barHeight) / 2

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
        gradient.addColorStop(0, "rgba(34, 211, 238, 0.95)")
        gradient.addColorStop(1, "rgba(37, 99, 235, 0.75)")
        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    void audioContext.resume().then(() => {
      rafRef.current = requestAnimationFrame(draw)
    })

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      source.disconnect()
      analyser.disconnect()
      void audioContext.close()
      if (audioContextRef.current === audioContext) {
        audioContextRef.current = null
        analyserRef.current = null
        sourceRef.current = null
      }
    }
  }, [active, stream])

  return (
    <div
      className={
        className ??
        "flex h-10 flex-1 items-center justify-center rounded-md border border-cyan-500/25 bg-slate-950/60 px-3"
      }
      aria-label="Voice level"
      aria-hidden={!active}
    >
      <canvas ref={canvasRef} width={480} height={36} className="h-9 w-full" />
    </div>
  )
}
