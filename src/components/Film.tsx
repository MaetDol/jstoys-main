import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';

const FilmContainer = styled.div`
  width: 424px;
  height: 356px;
  background: white;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 8%);
  padding: 28px 68px 28px 28px;
  box-sizing: border-box;
  position: absolute;
  cursor: grab;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: lightgray;
`;

type Position = {
  x: number;
  y: number;

  prev?: Omit<Position, 'prev'>;
};

export const Film: React.FC = () => {
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const isDragging = useRef(false);

  const mouseUp = () => {
    setPosition((prev) => ({ ...prev, prev: undefined }));
    isDragging.current = false;
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!isDragging.current) return;

      setPosition((state) => {
        let newPosition = state;

        if (state.prev) {
          newPosition = {
            x: state.x + e.clientX - state.prev.x,
            y: state.y + e.clientY - state.prev.y,
          };
          console.log(newPosition.x);
        }

        return {
          ...newPosition,
          prev: {
            x: e.clientX,
            y: e.clientY,
          },
        };
      });
    };

    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousemove', handler);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  return (
    <FilmContainer
      draggable={false}
      onMouseDown={() => (isDragging.current = true)}
      onMouseUp={mouseUp}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <ImageWrapper />
    </FilmContainer>
  );
};
