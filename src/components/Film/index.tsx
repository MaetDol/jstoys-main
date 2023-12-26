import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Device, useDeviceSize } from '../../App';
import { useDragHandler } from '../../hooks';
import { Dim } from '../Dim';
import { POSITION_TRANSITION_SECONDS, Styled } from './styled';

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
    const divRef = useRef<HTMLDivElement>(null);
    useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      ref,
      () => divRef.current
    );

    const [isTransitOnPos, setIsTransitOnPos] = useState(isFocusing);
    useEffect(() => {
      setIsTransitOnPos(true);
      if (isFocusing) return;

      const id = setTimeout(
        () => setIsTransitOnPos(false),
        POSITION_TRANSITION_SECONDS * 1000
      );
      return () => clearTimeout(id);
    }, [isFocusing]);

    const { isDragging, dragHandlers } = useDragHandler({
      onClick,
      onDragStart,
      onDragStop,
      onDragging,
    });

    const device = useDeviceSize();

    return (
      <Styled.Container>
        <Styled.FilmElement
          ref={divRef}
          isTransitOnPos={isFocusing || isTransitOnPos}
          isFocusing={isFocusing}
          isDragging={isDragging}
          isMobile={device === Device.MOBILE}
          draggable={false}
          {...dragHandlers}
        >
          <Styled.ImageWrapper>
            <Styled.Image src={imgUrl} alt="프로젝트 페이지 썸네일" />
            <Styled.InsetShadow />
          </Styled.ImageWrapper>
        </Styled.FilmElement>
        {isFocusing && <Dim onClick={() => onDimClick?.()} />}
      </Styled.Container>
    );
  }
);
