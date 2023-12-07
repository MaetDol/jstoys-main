import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import './App.css';
import { Film } from './components';
import logo from './logo.svg';
import GITHUB_ICON from './statics/github.svg';
import LEATHER_TEXTURE from './statics/leather_texture.jpg';

const Background = styled.div`
  pointer-events: none;
  background-color: #ffc225;
  position: absolute;
  width: 100%;
  height: 100%;

  &::before {
    content: '';
    background-image: url(${LEATHER_TEXTURE});
    background-size: 400px;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.2;
  }
`;

const GithubIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 4px;
`;

const GithubLink = styled.a`
  display: flex;
  align-items: center;
  position: absolute;
  left: 24px;
  bottom: 24px;
  z-index: 10;

  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  color: #222;
`;

const Vignetting = styled.div`
  pointer-events: none;
  font-size: 0;
  width: 0;
  position: absolute;

  &::after {
    content: '';
    padding: 100%;
    border-radius: 999px;
    box-shadow: 0 0 320px 40px rgba(0, 0, 0, 0.2) inset;

    position: absolute;
    top: 0;
    left: 0;
  }
`;

function App() {
  const [windowDiagonal, setWindowDiagonal] = useState(0);
  const [windowCenter, setWindowCenter] = useState([0, 0]);

  useEffect(() => {
    const handler = () => {
      // TODO: 디바운스 처리
      const radius =
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 2;
      setWindowDiagonal(radius);
      setWindowCenter([
        window.innerWidth / 2 - radius,
        window.innerHeight / 2 - radius,
      ]);
    };

    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="App">
      <Background />
      <header className="App-header">
        <Vignetting
          style={{
            width: `${windowDiagonal}px`,
            left: `${windowCenter[0]}px`,
            top: `${windowCenter[1]}px`,
          }}
        />
        <Film />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <GithubLink
          title="JSToys-main 레포지토리 새창에서 열기"
          href="https://github.com/MaetDol/jstoys-main"
          target="_blank"
        >
          <GithubIcon src={GITHUB_ICON} />
          MaetDol
        </GithubLink>
      </header>
    </div>
  );
}

export default App;
