/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState } from 'react'
import { SpringValue, useSpring, useSpringRef } from 'react-spring'

import { CONTAINER_HEIGHT } from '../styles'
import { Img } from './styles'

interface CardType {
  src: string
  index: number
  scrollIndex: number
  y: SpringValue<number>
  removeElement(index: number, position: number): void
  cardPosition: number
}

const CARD_HEIGHT = 200

const BASE_CALC = CONTAINER_HEIGHT - CARD_HEIGHT

export default function Card({
  index,
  src,
  y,
  scrollIndex,
  removeElement,
  cardPosition
}: CardType) {
  const ref = useRef<HTMLImageElement>(null)
  const [isClicked, setIsClicked] = useState(false)

  const startScroll = BASE_CALC * scrollIndex
  const endScroll = BASE_CALC * (scrollIndex + 1)

  function scrollTurn(position: number) {
    const canScroll = position >= startScroll && position <= endScroll
    const isAlreadyScrolled = position - endScroll > 0

    // eslint-disable-next-line no-param-reassign
    cardPosition = position - startScroll

    if (canScroll) return position - startScroll

    if (isAlreadyScrolled) return BASE_CALC

    return 0
  }

  const top = y.to(scrollTurn)

  const spin = top.to({
    range: [0, BASE_CALC],
    output: [0, 360]
  })

  const shakeSpringRef = useSpringRef()
  const slideOffSpringRef = useSpringRef()

  const [shakeSpring, shakeApi] = useSpring(
    () => ({
      from: { animation: 0 },
      to: { animation: 1 },
      reset: true,
      ref: shakeSpringRef,
      pause: true,
      onRest: () => {
        slideOffSpringRef.update({ reset: true, pause: false })
        slideOffSpringRef.start()
      }
    }),
    [spin]
  )

  const scale = top.to({
    range: [0, BASE_CALC / 2, BASE_CALC],
    output: [1, 1.2, 1]
  })

  const translateY = top.to({
    range: [0, BASE_CALC],
    output: [0, BASE_CALC - (BASE_CALC / 20) * scrollIndex]
  })

  const [slideOffSpring] = useSpring(() => ({
    from: { animation: 0 },
    to: { animation: 1 },
    reset: false,
    pause: true,
    ref: slideOffSpringRef,
    onRest: () => removeElement(scrollIndex, translateY.get() - BASE_CALC)
  }))

  const shake = shakeSpring.animation.to({
    range: [0, 0.2, 0.4, 0.6, 0.8, 1],
    output: [0, 10, -10, 10, -10, 0]
  })
  // .to(t => `${spin.get() + t}deg`)

  const slideOff = slideOffSpring.animation.to({
    range: [0, 1],
    output: [0, 600]
  })

  const zIndex = top.to(position => {
    if (position < 10) return index

    if (position >= 10) return 99

    if (position >= BASE_CALC) return scrollIndex

    return 99
  })

  return (
    <Img
      onClick={() => {
        shakeApi.update({ pause: false, reset: true })
        shakeApi.start()
        setIsClicked(true)
      }}
      style={{
        zIndex,
        scale,
        translateY,
        translateX: slideOff,
        rotateZ: !isClicked ? spin : shake
      }}
      src={src}
      ref={ref}
      alt=""
      width="300px"
      height={`${CARD_HEIGHT}px`}
    />
  )
}
