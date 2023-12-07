import styled from '@emotion/styled';

const FilmContainer = styled.div`
  width: 424px;
  height: 356px;
  background: white;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 8%);
  padding: 28px 68px 28px 28px;
  box-sizing: border-box;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: lightgray;
`;

export const Film: React.FC = () => {
  return (
    <FilmContainer>
      <ImageWrapper />
    </FilmContainer>
  );
};
