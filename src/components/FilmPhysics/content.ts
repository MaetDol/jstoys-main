import WATER_WAVE from '../../statics/fim-thumbnails/water-wave.webp';

export type FilmContent = {
  demoUrl: string;
  imgUrl: string;
  title: string;
  description: string;
};

export const FILM_CONTENTS: FilmContent[] = [
  {
    demoUrl: 'https://maetdol.github.io/JSToys/water-wave/',
    imgUrl: WATER_WAVE,
    title: 'Water wave',
    description: `
        연속적인 물결을 여러 레이어로 겹쳐 표현한 프로젝트. 
      다른 오브젝트들을 배치하고, 마우스로 상호작용 가능하게 만듬으로써
      프로젝트에 몰입할 수 있게 만들었습니다.`,
  },
  {
    demoUrl: '',
    imgUrl: '',
    title: '',
    description: '',
  },
  {
    demoUrl: '',
    imgUrl: '',
    title: '',
    description: '',
  },
  {
    demoUrl: '',
    imgUrl: '',
    title: '',
    description: '',
  },
  {
    demoUrl: '',
    imgUrl: '',
    title: '',
    description: '',
  },
  {
    demoUrl: '',
    imgUrl: '',
    title: '',
    description: '',
  },
];
