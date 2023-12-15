import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const SIDEBAR_WIDTH = 440;

const SidebarElement = styled.aside<{ visible: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: ${SIDEBAR_WIDTH}px;
  background-color: white;
  z-index: 1;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.25);
  padding: 56px 32px;

  transition: transform 0.2s, opacity 0.4s;
  opacity: 0;
  transform: translateX(100%);
  ${(props) =>
    props.visible &&
    css`
      opacity: 1;
      transform: translateX(0);
    `}
`;

type Props = React.PropsWithChildren<{
  visible: boolean;
}>;

export const Sidebar: React.FC<Props> = ({ visible, children }) => {
  return <SidebarElement visible={visible}>{children}</SidebarElement>;
};
