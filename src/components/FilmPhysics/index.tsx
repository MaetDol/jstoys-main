import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { Device, useDeviceSize } from '../../App';
import { ga4Service } from '../../services/GA4';
import OUTER_LINK from '../../statics/outer-link.svg';
import { BottomSheet } from '../BottomSheet';
import { Film } from '../Film';
import { Sidebar } from '../Sidebar';
import { FILM_CONTENTS, FilmContent } from './content';

const TitleLink = styled.a`
  display: block;
  color: #4587ea;
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  gap: 4px;
  align-items: center;
  margin-bottom: 24px;
`;

const SidebarTextWrapper = styled.div`
  box-sizing: border-box;
  white-space: pre-line;
`;

type FilmRef = {
  id: string;
  elem: HTMLDivElement | null;
  position: Position;
  acceleration: Position;
  zIndex: number;
  isDragging: boolean;

  content: FilmContent;
};

type Position = {
  x: number;
  y: number;
};

const ZIndexContainer = styled.div`
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export const FilmPhysics: React.FC = () => {
  const zIndex = useRef(0);
  const filmes = useRef<FilmRef[]>([]);
  const [, setReady] = useState(false);
  useEffect(() => {
    filmes.current = FILM_CONTENTS.map((film, i) => ({
      id: film.title + i,
      elem: null,
      position: {
        x: window.innerWidth / 2 - Math.random() * 424,
        y: window.innerHeight / 2 - Math.random() * 356,
      },
      acceleration: { x: 0, y: 0 },
      zIndex: ++zIndex.current,
      isDragging: false,
      content: film,
    }));
    setReady(true);
  }, []);

  const [focusedId, setFocusedId] = useState<string | null>(null);

  const device = useDeviceSize();

  useEffect(() => {
    let stopAnimating = false;
    const physics = () => {
      if (stopAnimating) return;

      filmes.current.forEach((film1) => {
        if (film1.id === focusedId) return;
        if (!film1.elem) return;

        if (film1.elem.parentElement) {
          film1.elem.parentElement.style.zIndex = film1.zIndex.toString();
        }

        const rect1 = film1.elem.getBoundingClientRect();
        const boundary = {
          left: -rect1.width * 0.2,
          top: -rect1.height * 0.2,
          bottom: window.innerHeight - rect1.height * 0.8,
          right: window.innerWidth - rect1.width * 0.8,
        };
        if (!film1.isDragging) {
          filmes.current.forEach((film2) => {
            if (film1 === film2) return;
            if (!film1.elem) return;
            if (!film2.elem) return;

            if (film2.zIndex < film1.zIndex) {
              const rect2 = film2.elem.getBoundingClientRect();
              if (hasRectConflict(rect1, rect2)) {
                accumulateAccel(film1, rect1, rect2);
              }
            }

            film1.acceleration.x *= 0.98;
            film1.acceleration.y *= 0.98;
          });

          film1.position.x += film1.acceleration.x;
          if (film1.position.x < boundary.left) {
            film1.position.x = boundary.left;
          } else if (film1.position.x > boundary.right) {
            film1.position.x = boundary.right;
          }

          film1.position.y += film1.acceleration.y;
          if (film1.position.y < boundary.top) {
            film1.position.y = boundary.top;
          } else if (film1.position.y > boundary.bottom) {
            film1.position.y = boundary.bottom;
          }
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
  }, [focusedId]);

  const targetFilmContent = filmes.current.find(
    (film) => film.id === focusedId
  )?.content;

  const openEvent = (title: string, platform: 'mobile' | 'desktop') => {
    ga4Service.event('필름사진 새탭에서 열기', {
      name: title,
      platform,
    });
  };

  return (
    <>
      <ZIndexContainer>
        {filmes.current.map((film) => (
          <Film
            key={film.id}
            ref={(elem) => (film.elem = elem)}
            isFocusing={film.id === focusedId}
            imgUrl={film.content.imgUrl}
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

              ga4Service.event('필름사진 드래그 시작', {
                name: film.content.title,
              });
            }}
            onDragStop={() => (film.isDragging = false)}
            onDragging={(x, y) => {
              if (film.id === focusedId) return;
              film.position.x += x;
              film.position.y += y;
            }}
            onClick={() => {
              film.acceleration.x = 0;
              film.acceleration.y = 0;
              setFocusedId((id) => (id === film.id ? null : film.id));

              ga4Service.event('필름사진 클릭', {
                name: film.content.title,
                isOpened: film.id === focusedId,
              });
            }}
            onDimClick={() => setFocusedId(null)}
          />
        ))}
      </ZIndexContainer>

      {device === Device.DESKTOP && (
        <Sidebar visible={focusedId !== null}>
          <SidebarTextWrapper>
            <TitleLink
              href={targetFilmContent?.demoUrl}
              target="_blank"
              title=""
              onClick={() =>
                openEvent(targetFilmContent?.title ?? 'unknown', 'desktop')
              }
            >
              {targetFilmContent?.title}
              <img src={OUTER_LINK} alt="새창에서 열기 아이콘" />
            </TitleLink>
            {targetFilmContent?.description}
          </SidebarTextWrapper>
        </Sidebar>
      )}

      {device === Device.MOBILE && (
        <BottomSheet
          visible={focusedId !== null}
          onClose={() => setFocusedId(null)}
        >
          <SidebarTextWrapper>
            <TitleLink
              href={targetFilmContent?.demoUrl}
              target="_blank"
              title=""
              onClick={() =>
                openEvent(targetFilmContent?.title ?? 'unknown', 'mobile')
              }
            >
              {targetFilmContent?.title}
              <img src={OUTER_LINK} alt="새창에서 열기 아이콘" />
            </TitleLink>
            {targetFilmContent?.description}
          </SidebarTextWrapper>
        </BottomSheet>
      )}
    </>
  );
};

function accumulateAccel(
  film: FilmRef,
  rect1: DOMRect,
  rect2: DOMRect,
  throttle = 0.04
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

  const w = xOverlap * yOverlap * 0.000001;
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
