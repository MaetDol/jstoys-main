import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const POSITION_TRANSITION_SECONDS = 0.1;

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
  touch-action: none;

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

export const Styled = {
  Container,
  FilmElement,
  ImageWrapper,
  InsetShadow,
  Image,
};
