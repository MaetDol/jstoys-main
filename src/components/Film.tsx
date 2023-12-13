import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

const Dim = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
`;

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
`;

const FilmElement = styled.div<{ isDragging: boolean; isFocusing: boolean }>`
  width: 424px;
  height: 356px;
  background: white;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 8%);
  padding: 28px 68px 28px 28px;
  box-sizing: border-box;
  position: absolute;
  cursor: grab;
  z-index: 1;

  transition: transform ease-in-out 0.1s, left 0.1s, top 0.1s;

  ${(props) => {
    if (props.isFocusing) {
      return css`
        left: calc(50vw - 212px) !important;
        top: calc(50vh - 178px) !important;
        box-shadow: 0 0 24px 8px rgba(0, 0, 0, 20%);
      `;
    } else if (props.isDragging) {
      return css`
        transform: scale(1.05);
      `;
    }
    return css`
      transform: scale(1);
    `;
  }}
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
  onClick?: () => void;

  isFocusing: boolean;
  onDimClick?: () => void;
};

export const Film = forwardRef<HTMLDivElement, Props>(
  (
    { onDragStart, onDragStop, onDragging, onClick, isFocusing, onDimClick },
    ref
  ) => {
    const prev = useRef<{ x: number; y: number; distance: number } | null>(
      null
    );
    const isDragging = useRef(false);
    const [isDraggingState, setIsDragging] = useState(false);

    const divRef = useRef<HTMLDivElement>(null);
    useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      ref,
      () => divRef.current
    );

    const mouseUp = useCallback(() => {
      const hasMovedShortly =
        isDragging.current && (prev.current?.distance ?? 0) < 10;
      if (hasMovedShortly) onClick?.();

      prev.current = null;
      isDragging.current = false;
      setIsDragging(false);
      onDragStop?.();
    }, [onClick, onDragStop]);
    const mouseDown = () => {
      isDragging.current = true;
      setIsDragging(true);
      onDragStart?.();
    };

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (!isDragging.current) return;

        if (prev.current) {
          const xDis = e.clientX - prev.current.x;
          const yDis = e.clientY - prev.current.y;
          onDragging?.(xDis, yDis);
          prev.current.distance += Math.sqrt(Math.abs(xDis ** 2 + yDis ** 2));
        }

        prev.current = {
          x: e.clientX,
          y: e.clientY,
          distance: prev.current?.distance ?? 0,
        };
      };

      window.addEventListener('mousemove', handler);
      window.addEventListener('mouseup', mouseUp);

      return () => {
        window.removeEventListener('mousemove', handler);
        window.removeEventListener('mouseup', mouseUp);
      };
    }, [mouseUp, onDragging]);

    return (
      <Container>
        <FilmElement
          ref={divRef}
          isFocusing={isFocusing}
          isDragging={isDraggingState}
          draggable={false}
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
        >
          <ImageWrapper />
        </FilmElement>
        {isFocusing && <Dim onClick={() => onDimClick?.()} />}
      </Container>
    );
  }
);
