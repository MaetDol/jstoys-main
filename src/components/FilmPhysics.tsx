import { useEffect, useRef } from 'react';
import { Film } from './Film';

export const FilmPhysics: React.FC = () => {
  // 여기서 모든 필름들 위치를 확인하고,
  // 충돌 계산 등 물리법칙 적용을 처리하고자 함
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  const vec2 = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let stopAnimating = false;
    const collision = () => {
      if (stopAnimating) return;

      if (ref1.current && ref2.current) {
        const f1 = ref1.current.getBoundingClientRect();
        const f2 = ref2.current.getBoundingClientRect();
        const hasConfilct = hasRectConflict(f1, f2);
        if (hasConfilct) {
          const f1Center = {
            x: f1.x + f1.width / 2,
            y: f1.y + f1.height / 2,
          };
          const f2Center = {
            x: f2.x + f2.width / 2,
            y: f2.y + f2.height / 2,
          };
          const xDis = f2Center.x - f1Center.x;
          const yDis = f2Center.y - f1Center.y;

          const targetXDistance = f1.width / 2 + f2.width / 2;
          const targetYDistance = f1.height / 2 + f2.height / 2;

          const xOverlap = targetXDistance - Math.abs(xDis);
          const yOverlap = targetYDistance - Math.abs(yDis);

          const w = xOverlap * yOverlap * 0.000001;
          console.log(w);
          if (w > 0.05) {
            const slope = Math.max(
              0.2,
              Math.min(2, Math.abs((f1.y - f2.y) / (f1.x - f2.x)))
            );
            const targetY = slope * w;
            const targetX = w / slope;

            if (!isFinite(vec2.current.x)) vec2.current.x = 0;
            if (!isFinite(vec2.current.y)) vec2.current.y = 0;
            vec2.current.x += Math.sign(xDis) * Math.abs(targetX);
            vec2.current.y += Math.sign(yDis) * Math.abs(targetY);
          }
        }

        ref2.current.style.left = f2.x + vec2.current.x + 'px';
        ref2.current.style.top = f2.y + vec2.current.y + 'px';

        vec2.current.x *= 0.97;
        vec2.current.y *= 0.97;
      }
      requestAnimationFrame(collision);
    };

    if (!stopAnimating) requestAnimationFrame(collision);

    return () => {
      stopAnimating = true;
    };
  }, []);

  return (
    <div>
      <Film ref={ref1} />
      <Film ref={ref2} />
    </div>
  );
};

function hasRectConflict(f1: DOMRect, f2: DOMRect) {
  const checkF1 =
    isPointInsideOfRect({ x: f1.x, y: f1.y }, f2) ||
    isPointInsideOfRect({ x: f1.x + f1.width, y: f1.y }, f2) ||
    isPointInsideOfRect({ x: f1.x + f1.width, y: f1.y + f1.height }, f2) ||
    isPointInsideOfRect({ x: f1.x, y: f1.y + f1.height }, f2);

  const checkF2 =
    isPointInsideOfRect({ x: f2.x, y: f2.y }, f1) ||
    isPointInsideOfRect({ x: f2.x + f2.width, y: f2.y }, f1) ||
    isPointInsideOfRect({ x: f2.x + f2.width, y: f2.y + f2.height }, f1) ||
    isPointInsideOfRect({ x: f2.x, y: f2.y + f2.height }, f1);

  return checkF1 || checkF2;
}

function isPointInsideOfRect(
  f1: { x: number; y: number },
  f2: { x: number; y: number; width: number; height: number }
) {
  if (f1.x >= f2.x && f1.x <= f2.x + f2.width) {
    if (f1.y >= f2.y && f1.y <= f2.y + f2.height) {
      return true;
    }
  }
  return false;
}
