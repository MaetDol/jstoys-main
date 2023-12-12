import styled from '@emotion/styled';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

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

type Props = {
  onDragStart?: () => void;
  onDragStop?: () => void;
  onDragging?: (xDelta: number, yDelta: number) => void;
};

export const Film = forwardRef<HTMLDivElement, Props>(
  ({ onDragStart, onDragStop, onDragging }, ref) => {
    const prev = useRef<{ x: number; y: number } | null>(null);
    const isDragging = useRef(false);
    const [isDraggingState, setIsDragging] = useState(false);

    const divRef = useRef<HTMLDivElement>(null);
    useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      ref,
      () => divRef.current
    );

    const mouseUp = () => {
      prev.current = null;
      isDragging.current = false;
      setIsDragging(false);
      onDragStop?.();
    };
    const mouseDown = () => {
      isDragging.current = true;
      setIsDragging(true);
      onDragStart?.();
    };

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (!isDragging.current) return;

        if (prev.current) {
          onDragging?.(e.clientX - prev.current.x, e.clientY - prev.current.y);
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
        isDragging={isDraggingState}
        draggable={false}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
      >
        <ImageWrapper />
      </FilmContainer>
    );
  }
);
