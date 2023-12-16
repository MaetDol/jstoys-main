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
import { Device, useDeviceSize } from '../App';
import { Dim } from './Dim';

const POSITION_TRANSITION_SECONDS = 0.1;

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
`;

const FilmElement = styled.div<{
  isDragging: boolean;
  isFocusing: boolean;
  isMobile: boolean;
  isTransitOnPos: boolean;
}>`
  ${(props) =>
    props.isMobile
      ? css`
          --width: 296px;
          --height: 249px;
        `
      : css`
          --width: 424px;
          --height: 356px;
        `}
  width: var(--width);
  height: var(--height);
  background: white;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 8%);
  padding: 28px 68px 28px 28px;
  box-sizing: border-box;
  position: absolute;
  cursor: grab;
  z-index: 1;

  transition: transform ease-in-out 0.1s
    ${(props) =>
      props.isTransitOnPos &&
      `, left ${POSITION_TRANSITION_SECONDS}s, top ${POSITION_TRANSITION_SECONDS}s`};

  ${(props) => {
    if (props.isFocusing) {
      return css`
        left: calc(50vw - var(--width) / 2) !important;
        top: ${props.isMobile
          ? `48px`
          : `calc(50vh - var(--height) / 2)`} !important;
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
  position: relative;
`;

const InsetShadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.05) inset;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
`;

type Props = {
  onDragStart?: () => void;
  onDragStop?: () => void;
  onDragging?: (xDelta: number, yDelta: number) => void;
  onClick?: () => void;

  isFocusing: boolean;
  onDimClick?: () => void;

  imgUrl: string;
};

export const Film = forwardRef<HTMLDivElement, Props>(
  (
    {
      onDragStart,
      onDragStop,
      onDragging,
      onClick,
      isFocusing,
      onDimClick,
      imgUrl,
    },
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

    const device = useDeviceSize();
    useEffect(() => {
      const drag = (x: number, y: number) => {
        if (prev.current) {
          const xDis = x - prev.current.x;
          const yDis = y - prev.current.y;
          onDragging?.(xDis, yDis);
          prev.current.distance += Math.sqrt(Math.abs(xDis ** 2 + yDis ** 2));
        }

        prev.current = {
          x: x,
          y: y,
          distance: prev.current?.distance ?? 0,
        };
      };

      const mouseMoveHandler = (e: MouseEvent) => {
        if (!isDragging.current) return;
        drag(e.clientX, e.clientY);
      };
      const touchMoveHandler = (e: TouchEvent) => {
        if (!isDragging.current) return;
        drag(e.touches[0].clientX, e.touches[0].clientY);
      };

      if (device === Device.DESKTOP) {
        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUp);
      }

      if (device === Device.MOBILE) {
        window.addEventListener('touchmove', touchMoveHandler);
        window.addEventListener('touchend', mouseUp);
      }

      return () => {
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUp);

        window.removeEventListener('touchmove', touchMoveHandler);
        window.removeEventListener('touchend', mouseUp);
      };
    }, [mouseUp, onDragging, device]);

    const mouseEvents: { [name: string]: Function | undefined } = {
      onMouseDown: undefined,
      onMouseUp: undefined,

      onTouchStart: undefined,
      onTouchEnd: undefined,
    };
    if (device === Device.DESKTOP) {
      mouseEvents.onMouseDown = mouseDown;
      mouseEvents.onMouseUp = mouseUp;
    } else if (device === Device.MOBILE) {
      mouseEvents.onTouchStart = mouseDown;
      mouseEvents.onTouchEnd = mouseUp;
    }

    const [isTransitOnPos, setIsTransitOnPos] = useState(false);
    useEffect(() => {
      setIsTransitOnPos(true);
      if (isFocusing) return;

      const id = setTimeout(
        () => setIsTransitOnPos(false),
        POSITION_TRANSITION_SECONDS * 1000
      );
      return () => clearTimeout(id);
    }, [isFocusing]);

    return (
      <Container>
        <FilmElement
          ref={divRef}
          isTransitOnPos={isFocusing || isTransitOnPos}
          isFocusing={isFocusing}
          isDragging={isDraggingState}
          isMobile={device === Device.MOBILE}
          draggable={false}
          {...mouseEvents}
        >
          <ImageWrapper>
            <Image src={imgUrl} alt="프로젝트 페이지 썸네일" />
            <InsetShadow />
          </ImageWrapper>
        </FilmElement>
        {isFocusing && <Dim onClick={() => onDimClick?.()} />}
      </Container>
    );
  }
);
