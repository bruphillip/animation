import { useEffect, useRef, useState } from 'react'
import { useSpring } from 'react-spring'

import CARDS from 'assets/cards'
import { values, uniqueId } from 'lodash'

import Card from './Card'
import { Container, CONTAINER_HEIGHT } from './styles'

const CARD_HEIGHT = 200
const BASE_CALC = CONTAINER_HEIGHT - CARD_HEIGHT

const CARDS_LIST = values(CARDS).map((card, index) => ({
  key: uniqueId(),
  card,
  index
}))

export default function Cards() {
  const ref = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState(CARDS_LIST)
  const cardsPosition = useRef([])

  const [props, set] = useSpring(() => ({ top: 0 }))

  const scrollOffset = useRef(0)

  function scrollHandler(ev: WheelEvent) {
    scrollOffset.current += ev.deltaY

    if (scrollOffset.current < 0) scrollOffset.current = 0

    if (scrollOffset.current > BASE_CALC * CARDS_LIST.length)
      scrollOffset.current = BASE_CALC * CARDS_LIST.length

    set({ top: scrollOffset.current })
  }

  function removeElement(index: number, scrollPosition: number) {
    console.log(cardsPosition.current)
    set({ top: scrollPosition })
    setCards(listCards => listCards.filter(_ => _.index !== index))
  }

  useEffect(() => {
    ref.current?.addEventListener('wheel', scrollHandler, { passive: true })

    return () => ref.current?.removeEventListener('wheel', scrollHandler)
  }, [ref.current])

  return (
    <Container ref={ref}>
      {cards.map((card, idx) => (
        <Card
          cardPosition={cardsPosition.current[idx]}
          y={props.top}
          key={card.key}
          src={card.card}
          index={cards.length - 1 - idx}
          scrollIndex={idx}
          removeElement={removeElement}
        />
      ))}
    </Container>
  )
}
