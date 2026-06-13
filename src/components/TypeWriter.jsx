import { useState, useEffect } from 'react'

export default function TypeWriter({ texts, speed = 80, deleteSpeed = 40, pause = 2000 }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const blinkTimer = setInterval(() => setBlink(v => !v), 500)
    return () => clearInterval(blinkTimer)
  }, [])

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !deleting) {
      const timer = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(timer)
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false)
      setIndex(v => (v + 1) % texts.length)
      return
    }
    const timer = setTimeout(() => {
      setSubIndex(v => v + (deleting ? -1 : 1))
    }, deleting ? deleteSpeed : speed)
    return () => clearTimeout(timer)
  }, [subIndex, deleting, index, texts, speed, deleteSpeed, pause])

  return (
    <span>
      {texts[index].substring(0, subIndex)}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} transition-opacity text-primary`}>|</span>
    </span>
  )
}
