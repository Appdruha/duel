import { useEffect, useRef, useState } from 'react'
import styles from './field.module.css'
import { Hero } from '../../models/Hero.ts'
import { Modal } from '../modal/Modal.tsx'
import { generateHeroes } from './helpers/generate-heroes.ts'
import { fieldSize } from '../../consts/canvas-sizes.ts'
import { handleMouseMove } from './helpers/handle-mouse-move.ts'
import { Spell } from '../../models/Spell.ts'
import { HeroControls } from '../heroControls/Hero-controls.tsx'
import { checkCollision } from './helpers/check-collision.ts'

export const Field = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const requestRef = useRef<undefined | number>(undefined)
  const heroesRef = useRef<{ firstHero: Hero | null, secondHero: Hero | null }>({ firstHero: null, secondHero: null })
  const spellsRef = useRef<Spell[]>([])
  const clientCoordinatesRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 })
  const isEditModeRef = useRef<boolean>(false)

  const [heroesHealth, setHeroesHealth] =
    useState<{ firstHeroHealth: number, secondHeroHealth: number }>({ firstHeroHealth: 0, secondHeroHealth: 0 })
  const [modalProps, setModalProps] = useState<null | Hero>(null)

  useEffect(() => {
    containerRef.current?.focus()
  }, [modalProps])

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d')
      canvasRef.current.width = fieldSize.width
      canvasRef.current.height = fieldSize.height
    } else {
      throw new Error('No canvas is found')
    }

    if (canvasCtxRef.current) {
      heroesRef.current = generateHeroes(canvasCtxRef.current, fieldSize.width, fieldSize.height)
      createShootingInterval(heroesRef.current.firstHero!)
      createShootingInterval(heroesRef.current.secondHero!)
    } else {
      throw new Error('No canvas context is found')
    }

    if (canvasRef.current && canvasCtxRef.current && heroesRef.current.firstHero && heroesRef.current.secondHero) {
      requestRef.current = window.requestAnimationFrame(() =>
        drawAll([heroesRef.current.firstHero!, heroesRef.current.secondHero!]),
      )
    } else {
      throw new Error('No canvas context or heroes are found')
    }

    setHeroesHealth({ firstHeroHealth: 5, secondHeroHealth: 5 })

    return () => {
      cancelAnimationFrame(requestRef.current as number)
      clearInterval(heroesRef.current.firstHero?.shootingIntervalId)
      clearInterval(heroesRef.current.secondHero?.shootingIntervalId)
      containerRef.current?.removeEventListener('onkeydown', toggleEditMode)
    }
  }, [])

  const drawAll = (heroes: Hero[]) => {
    const isEditMode = isEditModeRef.current
    if (canvasCtxRef.current && canvasRef.current) {
      canvasCtxRef.current.clearRect(0, 0, fieldSize.width, fieldSize.height)
      canvasCtxRef.current.fillStyle = '#4682B4'
      canvasCtxRef.current.fillRect(0, 0, fieldSize.width, fieldSize.height)
      spellsRef.current.forEach(spell => {
        spellsRef.current = spell.draw(fieldSize.width, spellsRef.current)
        if (
          spell.id.includes('P1')
          && checkCollision({ hero: heroes[1], objX: spell.x, objY: spell.y, objRadius: spell.radius })
        ) {
          spellsRef.current = spell.remove(spellsRef.current)
          setHeroesHealth(prevState => (
            { ...prevState, secondHeroHealth: prevState.secondHeroHealth - 1 }),
          )
        } else if (
          spell.id.includes('P2')
          && checkCollision({ hero: heroes[0], objX: spell.x, objY: spell.y, objRadius: spell.radius })
        ) {
          spellsRef.current = spell.remove(spellsRef.current)
          setHeroesHealth(prevState => (
            { ...prevState, firstHeroHealth: prevState.firstHeroHealth - 1 }),
          )
        } else {
          spell.x += spell.vx
        }
      })

      heroes.forEach(hero => {
        const clientX = clientCoordinatesRef.current.x
        const clientY = clientCoordinatesRef.current.y

        hero.draw(fieldSize.height)
        if (!isEditMode && checkCollision({ hero, objX: clientX, objY: clientY })) {
          if (
            (clientY > hero.y && hero.vy > 0)
            || (clientY < hero.y && hero.vy < 0)
            && (Math.abs(clientY - hero.y) >= hero.radius - Math.abs(hero.vy) - 2)
          ) {
            hero.vy = -hero.vy
          }
        }
        hero.y += hero.vy
      })

      requestRef.current = window.requestAnimationFrame(() => drawAll(heroes))
    } else {
      throw new Error('drawAll Error')
    }
  }

  const handleCloseModal = () => {
    setModalProps(null)
  }

  const handleClick = () => {
    const clientX = clientCoordinatesRef.current.x
    const clientY = clientCoordinatesRef.current.y
    const firstHero = heroesRef.current.firstHero
    const secondHero = heroesRef.current.secondHero

    if (!firstHero || !secondHero) {
      return
    }

    if (checkCollision({ hero: firstHero, objX: clientX, objY: clientY })) {
      setModalProps(firstHero)
    }
    if (checkCollision({ hero: secondHero, objX: clientX, objY: clientY })) {
      setModalProps(secondHero)
    }
    clientCoordinatesRef.current = { x: 0, y: 0 }
  }

  const toggleEditMode = () => {
    isEditModeRef.current = !isEditModeRef.current
  }

  const handleMouseOut = () => {
    clientCoordinatesRef.current = {x: 0, y: 0}
  }

  const createShootingInterval = (hero: Hero, shootingSpeedDivider: number = 1) => {
    if (!canvasCtxRef.current) {
      return
    }
    hero.shootingIntervalId = setInterval(() => {
      spellsRef.current.push(
        new Spell({
          ctx: canvasCtxRef.current!,
          vx: hero.color === 'white' ? 3 : -3,
          color: hero.spellColor,
          x: hero.x,
          y: hero.y,
          id: (hero.color === 'white' ? 'P1' : 'P2') + Date.now().toString(36) + Math.random().toString(36).slice(2),
        }),
      )
    }, 2000 / shootingSpeedDivider)
  }

  return (
    <>
      <div
        ref={containerRef}
        className={styles.fieldContainer}
        tabIndex={-1}
        onKeyDown={toggleEditMode}
      >
        <p className={styles.rules}>Чтобы поменять цвет заклинаний нажмите любую клавишу, тогда герои не будут реагировать на курсор мыши.
          Чтобы продолжить игру, снова нажмите любую клавишу
        </p>
        {heroesRef.current.firstHero &&
          <HeroControls
            hero={heroesRef.current.firstHero}
            createShootingInterval={createShootingInterval}
            heroHealth={heroesHealth.firstHeroHealth}
          />
        }
        <canvas
          ref={canvasRef}
          className={styles.field}
          onClick={handleClick}
          onMouseOut={handleMouseOut}
          onMouseMove={event => {
            handleMouseMove({
              canvas: canvasRef.current,
              event,
              clientCoordinatesRef,
            })
          }
          }
        >
        </canvas>
        {heroesRef.current.secondHero &&
          <HeroControls
            hero={heroesRef.current.secondHero}
            createShootingInterval={createShootingInterval}
            heroHealth={heroesHealth.secondHeroHealth}
          />
        }
      </div>
      {modalProps && <Modal hero={modalProps} closeModal={handleCloseModal} />}
    </>
  )
}