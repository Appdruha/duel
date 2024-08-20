import { Hero } from '../../models/Hero.ts'
import { useState } from 'react'
import styles from './hero-controls.module.css'

interface HeroControlsProps {
  hero: Hero
  createShootingInterval: (hero: Hero, divider: number) => void
  heroHealth: number
}

export const HeroControls = ({ hero, createShootingInterval, heroHealth }: HeroControlsProps) => {
  const [shootingSpeed, setShootingSpeed] = useState<number | string>(1)
  const [speed, setSpeed] = useState<number | string>(Math.abs(hero.vy))

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hero.vy > 0) {
      hero.vy = Number(e.target.value)
    } else {
      hero.vy = -Number(e.target.value)
    }
    setSpeed(e.target.value)
  }

  const handleShootingSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearInterval(hero.shootingIntervalId)
    createShootingInterval(hero, Number(e.target.value))
    setShootingSpeed(e.target.value)
  }

  return (
    <div className={styles.controlsContainer}>
      <h2>Здоровье {heroHealth}</h2>
      <form>
        <div className={styles.inputContainer}>
          <label htmlFor='shootingSpeed'>Скорострельность</label>
          <input onChange={handleShootingSpeedChange} value={shootingSpeed} type='range' name='shootingSpeed' min={1}
                 max={5} />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor='speed'>Скорость</label>
          <input onChange={handleSpeedChange} value={speed} type='range' name='speed' min={1} max={5} />
        </div>
      </form>
    </div>
  )
}