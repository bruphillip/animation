import styled from 'styled-components'

export const CONTAINER_HEIGHT = 600

export const Container = styled.div`
  display: flex;
  height: ${CONTAINER_HEIGHT}px;
  flex-direction: column;

  overflow-y: hidden;
  position: relative;

  width: 500px;

  margin: 0 auto;
  align-items: center;
`
