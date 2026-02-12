import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const Countdown = ({ weddingDate, textColor }) => {
  const theme = useTheme()
  const color = textColor ?? theme.textColor ?? '#8B6F6D'
  const accent = theme.accentColor || '#D4B483'
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (!weddingDate) {
      console.log('Countdown: No wedding date provided')
      return
    }

    const calculateTimeLeft = () => {
      try {
        const now = new Date().getTime()
        // Parse the date string (format: YYYY-MM-DD or ISO string)
        // Set time to end of day (23:59:59) for the wedding date
        let weddingDateObj
        if (typeof weddingDate === 'string') {
          // If it's just a date string (YYYY-MM-DD), add time to end of day
          if (weddingDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            weddingDateObj = new Date(weddingDate + 'T23:59:59')
          } else {
            weddingDateObj = new Date(weddingDate)
          }
        } else {
          weddingDateObj = new Date(weddingDate)
        }
        
        const wedding = weddingDateObj.getTime()
        const difference = wedding - now

        console.log('Countdown calculation:', {
          now: new Date(now).toISOString(),
          wedding: weddingDateObj.toISOString(),
          difference: difference,
          days: Math.floor(difference / (1000 * 60 * 60 * 24))
        })

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
          })
        } else {
          // Wedding date has passed
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          })
        }
      } catch (error) {
        console.error('Error calculating countdown:', error, 'Wedding date:', weddingDate)
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [weddingDate])

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  if (!weddingDate) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="inline-flex items-center gap-6 md:gap-8 px-10 md:px-12 py-8 md:py-10 backdrop-blur-md rounded-full shadow-xl"
      style={{ backgroundColor: 'rgba(248, 244, 236, 0.9)', borderColor: `${accent}33`, borderWidth: '1px', borderStyle: 'solid' }}
    >
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
          className="text-center min-w-[60px] md:min-w-[80px]"
        >
          <div className="text-5xl md:text-6xl lg:text-7xl font-body font-bold leading-none mb-2" style={{ color }}>
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-[10px] md:text-xs font-body mt-2 uppercase tracking-[0.15em] font-light" style={{ color }}>
            {unit.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default Countdown

