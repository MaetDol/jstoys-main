import CSS_DICE from '../../statics/fim-thumbnails/css-dice.webp';
import DESK_ATELIER from '../../statics/fim-thumbnails/desk-atelier.webp';
import K_MEANS from '../../statics/fim-thumbnails/k-means.webp';
import MAKE_TO_PIXEL from '../../statics/fim-thumbnails/make-to-pixel.webp';
import PIE_CHART from '../../statics/fim-thumbnails/pie-chart.webp';
import WATER_WAVE from '../../statics/fim-thumbnails/water-wave.webp';

export type FilmContent = {
  demoUrl: string;
  imgUrl: string;
  title: string;
  description: string;
};

export const FILM_CONTENTS: FilmContent[] = [
  {
    demoUrl: './',
    imgUrl: DESK_ATELIER,
    title: 'Desk Atelier',
    description: `프론트엔드로서 풀어낸 토이 프로젝트들을 저만의 방식으로 표현한 전시장(Atelier)이자, 작업장(Desk)이에요.

    지금 보고 계신 이 페이지! 여기가 맞습니다~`,
  },
  {
    demoUrl: 'https://maetdol.github.io/JSToys/water-wave/',
    imgUrl: WATER_WAVE,
    title: 'Water wave',
    description: `연속적인 물결을 여러 레이어로 겹쳐 표현한 프로젝트! 물결이 찰랑찰랑~

      여러 오브젝트들을 배치해 마우스로 상호작용 가능하게 만듬으로써,
      프로젝트를 체험하고 몰입할 수 있게 만들었어요.`,
  },
  {
    demoUrl: 'https://maetdol.github.io/JSToys/make-to-pixel/',
    imgUrl: MAKE_TO_PIXEL,
    title: 'Make to pixel',
    description: `이미지를 픽셀아트처럼 네모네모나게, 둥글둥글하게 만들어줘요!

    이미지 raw 데이터를 활용해 도트로 재생성해주는 프로젝트에요.
    각 도트 색상을 구할때 k-means 알고리즘을 사용해서, 멱등성이 보장되지 않아요.
    `,
  },
  {
    demoUrl: 'https://maetdol.github.io/JSToys/3d-dice/',
    imgUrl: CSS_DICE,
    title: 'Css Dice',
    description: `CSS 로 그려내고, JS 로 인터렉션 가능하게 만든 주사위에요`,
  },

  {
    demoUrl: 'https://maetdol.github.io/JSToys/pie-chart/',
    imgUrl: PIE_CHART,
    title: 'Pie chart',
    description: `캔버스를 이용해 데이터를 파이 차트로 렌더링 하는 프로젝트.
    특정 영역에 마우스를 호버하면, 비율을 툴팁으로 보여줘요.`,
  },
  {
    demoUrl: 'https://maetdol.github.io/k-means-js/demo/',
    imgUrl: K_MEANS,
    title: 'k-means',
    description: `군집화(클러스터링) 알고리즘 중 하나인 k-means 를 직접 구현하고, 
    어떤 방식으로 동작하는지 시각화 해놓은 프로젝트에요.`,
  },
].reverse();
