import { useCallback, useEffect, useRef, useState } from 'react';
import { Device, useDeviceSize } from '../App';

type HandlerProps = {
  onClick?: () => void;
  onDragging?: (xMove: number, yMove: number) => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
};

export const useDragHandler = ({
  onClick,
  onDragging,
  onDragStart,
  onDragStop,
}: HandlerProps) => {
  const prev = useRef<{ x: number; y: number; distance: number } | null>(null);
  // 리액트 상태와 별개로 이벤트 핸들러에서 사용하기 위한 ref
  const isDraggingRef = useRef(false);

  // 리렌더링을 위한 상태
  const [isDragging, setIsDragging] = useState(false);

  const mouseUp = useCallback(() => {
    const hasMovedShortly =
      isDraggingRef.current && (prev.current?.distance ?? 0) < 10;
    if (hasMovedShortly) onClick?.();

    prev.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
    onDragStop?.();
  }, [onClick, onDragStop]);

  const mouseDown = () => {
    isDraggingRef.current = true;
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
      if (!isDraggingRef.current) return;
      drag(e.clientX, e.clientY);
    };
    const touchMoveHandler = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
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

  const mouseHandlers: { [name: string]: Function | undefined } = {
    onMouseDown: undefined,
    onMouseUp: undefined,

    onTouchStart: undefined,
    onTouchEnd: undefined,
  };
  if (device === Device.DESKTOP) {
    mouseHandlers.onMouseDown = mouseDown;
    mouseHandlers.onMouseUp = mouseUp;
  } else if (device === Device.MOBILE) {
    mouseHandlers.onTouchStart = mouseDown;
    mouseHandlers.onTouchEnd = mouseUp;
  }

  return {
    isDragging,
    mouseHandlers,
  };
};
