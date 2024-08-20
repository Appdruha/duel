export interface ISpell {
  x: number
  y: number
  vx: number
  color: string
  id: string
  ctx: CanvasRenderingContext2D
}

export class Spell implements ISpell {
  x: number
  y: number
  vx: number
  radius: number
  color: string
  id: string
  ctx: CanvasRenderingContext2D

  constructor({ x, y, color, ctx, vx, id }: ISpell) {
    this.x = x
    this.y = y
    this.vx = vx
    this.radius = 8
    this.color = color
    this.ctx = ctx
    this.id = id
  }

  draw(width: number, spellsArr: Spell[]) {
    if (this.x + this.vx + this.radius > width || this.x + this.vx - this.radius < 0) {
      return this.remove(spellsArr)
    }

    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    this.ctx.closePath()
    this.ctx.fillStyle = this.color
    this.ctx.fill()
    return spellsArr
  }

  remove(spellsArr: Spell[]) {
    return spellsArr.filter(spell => spell.id !== this.id)
  }
}