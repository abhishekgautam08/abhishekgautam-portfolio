import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []
    let mouse = { x: -9999, y: -9999 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    // Palette: purple, cyan, pink
    const COLORS = ['108, 99, 255', '0, 212, 255', '255, 107, 157']

    class Particle {
      constructor() {
        this.reset()
      }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2.2 + 0.4   // varied sizes
        this.baseSpeed = Math.random() * 0.28 + 0.06
        this.speedX = (Math.random() - 0.5) * this.baseSpeed * 2
        this.speedY = (Math.random() - 0.5) * this.baseSpeed * 2
        this.opacity = Math.random() * 0.45 + 0.08
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
        this.parallaxFactor = Math.random() * 0.012 + 0.003  // subtle parallax
      }
      update() {
        // Subtle mouse parallax — particles gently drift toward cursor area
        const dx = mouse.x - canvas.width / 2
        const dy = mouse.y - canvas.height / 2
        this.x += this.speedX + dx * this.parallaxFactor * 0.01
        this.y += this.speedY + dy * this.parallaxFactor * 0.01

        // Fade in/out near edges
        const margin = 60
        if (this.x < margin) this.opacity -= 0.002
        if (this.y < margin) this.opacity -= 0.002

        if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20 || this.opacity <= 0) {
          this.reset()
        }
      }
      draw() {
        // Soft glow by drawing two circles
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.12})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`
        ctx.fill()
      }
    }

    // More particles for denser field
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle())
    }

    const connect = () => {
      const CONNECTION_DIST = 130
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const alpha = 0.18 * (1 - dist / CONNECTION_DIST)
            // Blend color between the two particles
            ctx.strokeStyle = `rgba(108, 99, 255, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      connect()
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" />
}
