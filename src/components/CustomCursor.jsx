import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const outerRef = useRef(null)

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    const cursor = cursorRef.current
    const follower = followerRef.current
    const outer = outerRef.current
    if (!cursor || !follower || !outer) return

    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0
    let outerX = 0, outerY = 0
    let rafId = null

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = mouseX - 5 + 'px'
      cursor.style.top = mouseY - 5 + 'px'
    }

    const animate = () => {
      // Inner follower — medium lag
      followerX += (mouseX - followerX) * 0.14
      followerY += (mouseY - followerY) * 0.14
      follower.style.left = followerX - 18 + 'px'
      follower.style.top = followerY - 18 + 'px'

      // Outer ring — slowest lag
      outerX += (mouseX - outerX) * 0.07
      outerY += (mouseY - outerY) * 0.07
      outer.style.left = outerX - 29 + 'px'
      outer.style.top = outerY - 29 + 'px'

      rafId = requestAnimationFrame(animate)
    }
    animate()

    const onEnter = () => {
      cursor.classList.add('cursor-hover')
      follower.classList.add('cursor-hover')
      cursor.style.transform = 'scale(1.4)'
      follower.style.transform = 'scale(1.6)'
      outer.style.transform = 'scale(0.5)'
      outer.style.opacity = '0.3'
    }

    const onLeave = () => {
      cursor.classList.remove('cursor-hover')
      follower.classList.remove('cursor-hover')
      cursor.style.transform = 'scale(1)'
      follower.style.transform = 'scale(1)'
      outer.style.transform = 'scale(1)'
      outer.style.opacity = '1'
    }

    const onDown = () => {
      cursor.style.transform = 'scale(0.75)'
      follower.style.transform = 'scale(0.75)'
    }
    const onUp = () => {
      cursor.style.transform = 'scale(1)'
      follower.style.transform = 'scale(1)'
    }

    const attachHovers = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attachHovers()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    // Re-attach when new interactive elements appear
    const observer = new MutationObserver(attachHovers)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={followerRef} className="custom-cursor-follower hidden md:block" />
      <div ref={outerRef} className="custom-cursor-outer hidden md:block" />
    </>
  )
}
