import heroIcon from '/hero.jpg'

export interface IHero {
  x: number
  y: number
  vy: number
  radius: number
  color: string
  ctx: CanvasRenderingContext2D
  spellColor: string
}

export class Hero implements IHero {
  x: number
  y: number
  vy: number
  radius: number
  color: string
  ctx: CanvasRenderingContext2D
  shootingIntervalId: number
  spellColor: string
  icon: HTMLImageElement
  rotation: number

  constructor({ x, y, radius, color, ctx, vy, spellColor }: IHero) {
    this.x = x
    this.y = y
    this.vy = vy
    this.radius = radius
    this.color = color
    this.ctx = ctx
    this.shootingIntervalId = 0
    this.spellColor = spellColor
    this.icon = new Image()
    this.icon.src = heroIcon
    this.rotation = 0
  }

  draw(height: number) {
    if (this.y + this.radius > height) {
      this.y = height - this.radius
      this.vy = -this.vy
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius
      this.vy = -this.vy
    }
    this.rotation += 2 * this.vy * Math.PI / 180
    this.ctx.save()
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(this.rotation)
    this.ctx.drawImage(this.icon, -this.radius, -this.radius, this.radius * 2, this.radius * 2)
    this.ctx.restore()
  }
}