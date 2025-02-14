import React, { useEffect, useRef, useState } from "react";

type HandlerProps = {
  onClick?: (Params: { x: number; y: number }) => void;
  onDragging?: (xMove: number, yMove: number) => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
};

type DragHandlerSet = {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
};

type UseDragReturns = {
  isDragging: boolean;
  dragHandlers: DragHandlerSet;
};

export const useDragHandler = ({
  onClick,
  onDragging,
  onDragStart,
  onDragStop,
}: HandlerProps): UseDragReturns => {
  const prev = useRef<{ x: number; y: number; distance: number } | null>(null);
  // 리액트 상태와 별개로 이벤트 핸들러에서 사용하기 위한 ref
  const isDraggingRef = useRef(false);
  const onRef = useRef({ onClick, onDragging, onDragStart, onDragStop });
  onRef.current = { onClick, onDragging, onDragStart, onDragStop };

  // 리렌더링을 위한 상태
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const drag = (x: number, y: number) => {
      if (prev.current) {
        const xDis = x - prev.current.x;
        const yDis = y - prev.current.y;
        onRef.current.onDragging?.(xDis, yDis);
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

    const mouseUp = ({ x, y }: { x: number; y: number }) => {
      const hasMovedShortly =
        isDraggingRef.current && (prev.current?.distance ?? 0) < 10;

      prev.current = null;
      isDraggingRef.current = false;
      setIsDragging(false);

      if (hasMovedShortly) {
        onRef.current.onClick?.({ x, y });
        return;
      }
      onRef.current.onDragStop?.();
    };

    const nativeMouseUp = (e: MouseEvent) => {
      mouseUp({ x: e.clientX, y: e.clientY });
    };
    const nativeTouchEnd = (e: TouchEvent) => {
      mouseUp({
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      });
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", nativeMouseUp);

    window.addEventListener("touchmove", touchMoveHandler);
    window.addEventListener("touchend", nativeTouchEnd);

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", nativeMouseUp);

      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", nativeTouchEnd);
    };
  }, [isDragging]);

  const mouseDown = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
    onDragStart?.();
  };

  const dragHandlers: DragHandlerSet = {
    onMouseDown: mouseDown,
    onTouchStart: mouseDown,
  };

  return {
    isDragging,
    dragHandlers,
  };
};
