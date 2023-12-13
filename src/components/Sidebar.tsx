import { css } from '@emotion/react';
import styled from '@emotion/styled';
import OUTER_LINK from '../statics/outer-link.svg';

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
  box-sizing: border-box;
  white-space: pre-line;

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

type Props = {
  visible: boolean;
  title: string | undefined;
  description: string | undefined;
  demoUrl: string | undefined;
};

export const Sidebar: React.FC<Props> = ({
  visible,
  demoUrl,
  description,
  title,
}) => {
  return (
    <SidebarElement visible={visible}>
      <TitleLink href={demoUrl} target="_blank" title="">
        {title}
        <img src={OUTER_LINK} alt="새창에서 열기 아이콘" />
      </TitleLink>
      {description}
    </SidebarElement>
  );
};
