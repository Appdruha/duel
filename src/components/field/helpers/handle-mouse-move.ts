import { MutableRefObject } from 'react'
import { MouseEvent } from 'react'

interface HandleMouseMoveParams {
  clientCoordinatesRef: MutableRefObject<{ x: number, y: number } | null>
  event: MouseEvent<HTMLCanvasElement>
  canvas: HTMLCanvasElement | null
}

export const handleMouseMove = ({ clientCoordinatesRef, event, canvas }: HandleMouseMoveParams) => {
  if (!canvas) {
    throw new Error('handleMouseMove Error')
  }
  const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()
  clientCoordinatesRef.current = {
    x: Math.floor(event.clientX - canvasX),
    y: Math.floor(event.clientY - canvasY),
  }
}