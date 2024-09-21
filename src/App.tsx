import { useState } from "react";
import "./App.css";
const SYMBOL_X = "X";
const SYMBOL_O = "O";

const computeWinner = (cells) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return [a, b, c];
    }
  }
};

function useGameState() {
  const [state, setState] = useState(SYMBOL_O);
  const [cells, setCells] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [currentStep, setCurrentStep] = useState(SYMBOL_X);
  const [winnerSequence, setWinnerSequence] = useState();
  const handleCellClick = (index: number) => {
    if (cells[index] || winnerSequence) {
      return;
    }
    const cellsCopy = cells.slice();
    cellsCopy[index] = currentStep;
    const winner = computeWinner(cellsCopy);

    setCells(cellsCopy);
    setCurrentStep(currentStep === SYMBOL_O ? SYMBOL_X : SYMBOL_O);
    setWinnerSequence(winner);
  };
  const handleResetClick = () => {
    setCells(Array.from({ length: 9 }, () => null));
    setCurrentStep(SYMBOL_X);
    setWinnerSequence(undefined);
  };
  const winnerSymbol = winnerSequence ? cells[winnerSequence[0]] : undefined;

  const isDraw = !winnerSequence && cells.filter((value) => value).length === 9;

  return {
    cells,
    currentStep,
    winnerSequence,
    handleCellClick,
    handleResetClick,
    winnerSymbol,
    isDraw,
  };
}

function App() {
  const {
    cells,
    currentStep,
    winnerSequence,
    handleCellClick,
    handleResetClick,
    winnerSymbol,
    isDraw,
  } = useGameState();
  
  const GameInfo = ({ isDraw, winnerSymbol, currentStep }) => {
    if (isDraw) {
      return <h1>Draw</h1>;
    }
    if (winnerSymbol) {
      return (
        <h1>
          Winner is <GameSymbol symbol={winnerSymbol} />
        </h1>
      );
    }
    return (
      <h1>
        Step: <GameSymbol symbol={currentStep} />
      </h1>
    );
  };

  const GameCell = ({ onClick, isWinner, symbol }) => {
    return (
      <button className={`cell ${isWinner ? "winner" : ""}`} onClick={onClick}>
        {symbol ? <GameSymbol symbol={symbol} /> : null}
      </button>
    );
  };

  const GameSymbol = ({ symbol }) => {
    const getSymbolClassName = (symbol: string) => {
      if (symbol === SYMBOL_O) return "symbol--o";
      if (symbol === SYMBOL_X) return "symbol--x";
      return "";
    };
    return <span className={`${getSymbolClassName(symbol)}`}>{symbol}</span>;
  };

  return (
    <div className="app">
      <GameInfo
        isDraw={isDraw}
        winnerSymbol={winnerSymbol}
        currentStep={currentStep}
      />
      <div className="table">
        {cells.map((symbol, index) => {
          return (
            <GameCell
              onClick={() => handleCellClick(index)}
              isWinner={winnerSequence?.includes(index)}
              symbol={symbol}
            />
          );
        })}
      </div>
      <button onClick={handleResetClick} className="reset">
        Reset
      </button>
    </div>
  );
}

export default App;
