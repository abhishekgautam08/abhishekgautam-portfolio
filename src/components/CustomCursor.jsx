import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    const cursor = cursorRef.current
    const follower = followerRef.current
    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = mouseX - 6 + 'px'
      cursor.style.top = mouseY - 6 + 'px'
    }

    const animate = () => {
      followerX += (mouseX - followerX) * 0.12
      followerY += (mouseY - followerY) * 0.12
      follower.style.left = followerX - 18 + 'px'
      follower.style.top = followerY - 18 + 'px'
      requestAnimationFrame(animate)
    }

    const onMouseEnterLink = () => {
      cursor.style.transform = 'scale(2)'
      follower.style.transform = 'scale(1.5)'
      follower.style.borderColor = 'rgba(0, 212, 255, 0.8)'
    }

    const onMouseLeaveLink = () => {
      cursor.style.transform = 'scale(1)'
      follower.style.transform = 'scale(1)'
      follower.style.borderColor = 'rgba(108, 99, 255, 0.5)'
    }

    document.addEventListener('mousemove', onMouseMove)
    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach(l => {
      l.addEventListener('mouseenter', onMouseEnterLink)
      l.addEventListener('mouseleave', onMouseLeaveLink)
    })
    animate()

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={followerRef} className="custom-cursor-follower hidden md:block" />
    </>
  )
}
