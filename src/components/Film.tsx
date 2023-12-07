import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

const FilmContainer = styled.div<{ isDragging: boolean }>`
  width: 424px;
  height: 356px;
  background: white;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 8%);
  padding: 28px 68px 28px 28px;
  box-sizing: border-box;
  position: absolute;
  cursor: grab;

  transition: transform ease-in-out 0.1s;
  transform: scale(${(props) => (props.isDragging ? 1.05 : 1)});
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
  const [isDragging, setIsDragging] = useState(false);

  const mouseUp = () => {
    setPosition((prev) => ({ ...prev, prev: undefined }));
    setIsDragging(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // 이부분 개선 필요..
      // setter 를 이용하기 위해 다른 상태에 접근해야 하는데,
      // handler 의 재 설정을 피하기 위해 setter 속 setter 를 이용 중..
      setIsDragging((isDragging) => {
        if (!isDragging) return isDragging;

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

        return isDragging;
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
      isDragging={isDragging}
      draggable={false}
      onMouseDown={() => setIsDragging(true)}
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
