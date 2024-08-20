import { Hero } from '../../../models/Hero.ts'

interface CheckCollisionArgs {
  hero: Hero
  objX: number
  objY: number
  objRadius?: number
}

export const checkCollision = ({ hero, objX, objY, objRadius = 0 }: CheckCollisionArgs) => {
  const dx = objX - hero.x
  const dy = objY - hero.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  return dist < hero.radius + objRadius
}