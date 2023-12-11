import styled from '@emotion/styled';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

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

export const Film = forwardRef((_, ref) => {
  const prev = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);

  const divRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => divRef.current);

  const mouseUp = () => {
    prev.current = null;
    isDragging.current = false;
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // 이부분 개선 필요..
      // setter 를 이용하기 위해 다른 상태에 접근해야 하는데,
      // handler 의 재 설정을 피하기 위해 setter 속 setter 를 이용 중..
      if (!isDragging.current) return;

      if (prev.current && divRef.current) {
        const { x, y } = divRef.current.getBoundingClientRect();
        divRef.current.style.left = x + e.clientX - prev.current.x + 'px';
        divRef.current.style.top = y + e.clientY - prev.current.y + 'px';
      }

      prev.current = {
        x: e.clientX,
        y: e.clientY,
      };
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
      ref={divRef}
      isDragging={isDragging.current}
      draggable={false}
      onMouseDown={() => (isDragging.current = true)}
      onMouseUp={mouseUp}
    >
      <ImageWrapper />
    </FilmContainer>
  );
});
