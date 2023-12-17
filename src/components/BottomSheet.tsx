import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useState } from 'react';
import { useDragHandler } from '../hooks';

const Container = styled.div<{
  visible: boolean;
  isDragging: boolean;
  dragDown: number;
}>`
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 60%;
  bottom: 0;
  left: 0;
  background-color: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  padding: 0 32px;

  ${(props) =>
    !props.isDragging &&
    css`
      transition: transform 0.3s;
    `}

  transform: translateY(${(props) => props.dragDown}px);
  ${(props) =>
    !props.visible &&
    css`
      transform: translateY(100%);
    `}
`;

const CloseContainer = styled.div`
  padding: 16px;

  &::after {
    content: '';
    display: block;
    width: 72px;
    height: 8px;
    border-radius: 80px;
    margin: auto;
    background-color: lightgray;
  }
`;

type Props = React.PropsWithChildren<{
  visible: boolean;
  onClose?: () => void;
}>;

export const BottomSheet: React.FC<Props> = ({
  visible,
  children,
  onClose,
}) => {
  const [dragDown, setDragDown] = useState(0);

  const { isDragging, dragHandlers } = useDragHandler({
    onDragging: (x, y) => setDragDown((prev) => Math.max(0, prev + y)),
    onClick: onClose,
    onDragStop: () => {
      if (dragDown > 160) {
        onClose?.();
      }
      setDragDown(0);
    },
  });

  return (
    <Container visible={visible} isDragging={isDragging} dragDown={dragDown}>
      <CloseContainer {...dragHandlers} />
      {children}
    </Container>
  );
};
