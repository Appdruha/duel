import { Hero } from '../../../models/Hero.ts'

export const generateHeroes = (ctx: CanvasRenderingContext2D, fieldWidth: number, fieldHeight: number) => {
  const radius = 30
  const firstHero = new Hero({ctx, color: 'white', radius, y: fieldHeight / 2, x: radius, vy: 1, spellColor: 'red'})
  const secondHero = new Hero({ctx, color: 'black', radius, y: fieldHeight / 2, x: fieldWidth - radius, vy: -1, spellColor: 'yellow'})
  return {firstHero, secondHero}
}