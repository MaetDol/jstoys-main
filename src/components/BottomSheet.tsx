import { css } from '@emotion/react';
import styled from '@emotion/styled';

const Container = styled.div<{ visible: boolean }>`
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 60%;
  bottom: 0;
  left: 0;
  background-color: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  padding: 0 32px;

  transition: transform 0.3s;
  transform: translateY(0);
  ${(props) =>
    !props.visible &&
    css`
      transform: translateY(100%);
    `}
`;

const CloseContainer = styled.div`
  padding: 16px;

  &::after {
    content: '';
    display: block;
    width: 72px;
    height: 8px;
    border-radius: 80px;
    margin: auto;
    background-color: lightgray;
  }
`;

type Props = React.PropsWithChildren<{
  visible: boolean;
}>;

export const BottomSheet: React.FC<Props> = ({ visible, children }) => {
  return (
    <Container visible={visible}>
      <CloseContainer />
      {children}
    </Container>
  );
};
