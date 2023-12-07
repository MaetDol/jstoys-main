import styled from '@emotion/styled';
import './App.css';
import { Film } from './components';
import logo from './logo.svg';
import LEATHER_TEXTURE from './statics/leather_texture.jpg';

const Background = styled.div`
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

function App() {
  return (
    <div className="App">
      <Background />
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
