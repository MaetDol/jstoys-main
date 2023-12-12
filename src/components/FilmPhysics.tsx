import { useEffect, useRef } from 'react';
import { Film } from './Film';

type FilmRef = {
  id: number;
  elem: HTMLDivElement | null;
  position: Position;
  acceleration: Position;
  zIndex: number;
  isDragging?: boolean;
};

type Position = {
  x: number;
  y: number;
};

export const FilmPhysics: React.FC = () => {
  const zIndex = useRef(1);
  const filmes = useRef<FilmRef[]>([
    {
      id: 0,
      elem: null,
      position: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      zIndex: 0,
    },
    {
      id: 1,
      elem: null,
      position: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      zIndex: 1,
    },
  ]);

  useEffect(() => {
    let stopAnimating = false;
    const physics = () => {
      if (stopAnimating) return;

      filmes.current.forEach((film1) => {
        if (!film1.elem) return;
        film1.elem.style.zIndex = film1.zIndex.toString();
        if (!film1.isDragging) {
          filmes.current.forEach((film2) => {
            if (film1 === film2) return;
            if (!film1.elem) return;
            if (!film2.elem) return;

            const rect1 = film1.elem.getBoundingClientRect();
            if (film2.zIndex < film1.zIndex) {
              const rect2 = film2.elem.getBoundingClientRect();
              if (hasRectConflict(rect1, rect2)) {
                accumulateAccel(film1, rect1, rect2);
              }
            }

            film1.acceleration.x *= 0.97;
            film1.acceleration.y *= 0.97;
          });

          film1.position.x += film1.acceleration.x;
          film1.position.y += film1.acceleration.y;
        }

        film1.elem.style.left = film1.position.x + 'px';
        film1.elem.style.top = film1.position.y + 'px';
      });

      requestAnimationFrame(physics);
    };

    if (!stopAnimating) requestAnimationFrame(physics);
    return () => {
      stopAnimating = true;
    };
  }, []);

  return (
    <div>
      {filmes.current.map((film) => (
        <Film
          key={film.id}
          ref={(elem) => (film.elem = elem)}
          onDragStart={() => {
            filmes.current.forEach((film2) => {
              if (film === film2) return;
              if (!film.elem) return;
              if (!film2.elem) return;
              if (film2.zIndex < film.zIndex) return;

              const rect1 = film.elem.getBoundingClientRect();
              const rect2 = film2.elem.getBoundingClientRect();
              if (!hasRectConflict(rect1, rect2)) return;

              film2.acceleration.x = 0;
              film2.acceleration.y = 0;
              accumulateAccel(film2, rect2, rect1, 0);
              film2.acceleration.x *= 60;
              film2.acceleration.y *= 60;
            });
            film.zIndex = ++zIndex.current;
            film.isDragging = true;
            film.acceleration.x = 0;
            film.acceleration.y = 0;
          }}
          onDragStop={() => (film.isDragging = false)}
          onDragging={(x, y) => {
            film.position.x += x;
            film.position.y += y;
          }}
        />
      ))}
    </div>
  );
};

function accumulateAccel(
  film: FilmRef,
  rect1: DOMRect,
  rect2: DOMRect,
  throttle = 0.05
) {
  const rect1Center = {
    x: rect1.x + rect1.width / 2,
    y: rect1.y + rect1.height / 2,
  };
  const rect2Center = {
    x: rect2.x + rect2.width / 2,
    y: rect2.y + rect2.height / 2,
  };

  const xDis = rect1Center.x - rect2Center.x;
  const yDis = rect1Center.y - rect2Center.y;

  const targetXDistance = rect2.width / 2 + rect1.width / 2;
  const targetYDistance = rect2.height / 2 + rect1.height / 2;

  const xOverlap = targetXDistance - Math.abs(xDis);
  const yOverlap = targetYDistance - Math.abs(yDis);

  const w = xOverlap * yOverlap * 0.0000005;
  if (w > throttle) {
    const slope = Math.max(
      0.2,
      Math.min(2, Math.abs((rect2.y - rect1.y) / (rect2.x - rect1.x)))
    );
    let targetY = slope * w;
    let targetX = w / slope;

    if (!isFinite(targetX)) targetX = 0;
    if (!isFinite(targetY)) targetY = 0;
    film.acceleration.x += Math.sign(xDis) * Math.abs(targetX);
    film.acceleration.y += Math.sign(yDis) * Math.abs(targetY);
  }
}

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
