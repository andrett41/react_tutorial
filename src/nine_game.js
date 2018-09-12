import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

// main class
class App extends React.Component {
  render() {
    return (
      <div className="App">
        Play Nine Game
        <Game />
      </div>
    );
  }
}

class Game extends React.Component {
  static randomNumber = () => {
    1 + Math.floor(Math.random() * 9);
  };

  static initialState = () => ({
    selectedNumbers: [],
    usedNumbers: [],
    nStars: Game.randomNumber(),
    answerCorrect: null,
    redraws: 5,
    endStatus: null
  });
  state = Game.initialState()

  newGame = () => {
    this.setState(Game.initialState())
  }

  selectNumber = clickedNum => {
    if (this.state.selectedNumbers.indexOf(clickedNum) >= 0) {
      return;
    }
    this.setState(prev => ({
      answerCorrect: null,
      selectedNumbers: prev.selectedNumbers.concat(clickedNum)
    }));
  };

  unselectNumber = clickedNum => {
    this.setState(prev => ({
      answerCorrect: null,
      selectedNumbers: prev.selectedNumbers.filter(
        number => number !== clickedNum
      )
    }));
  };

  checkAnswer = () => {
    this.setState(prev => ({
      answerCorrect:
        prev.nStars === prev.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };

  acceptAnswer = () => {
    this.setState(prev => ({
      usedNumbers: prev.usedNumbers.concat(prev.selectedNumbers),
      selectedNumbers: [],
      answerCorrect: null,
      nStars: Game.randomNumber()
    }), this.updateEndStatus);

  };

  redraw = () => {
    if (this.state.redraws > 0) {
      this.setState(prev => ({
        redraws: prev.redraws - 1,
        nStars: Game.randomNumber(),
        answerCorrect: null,
        selectedNumbers: []
      }), this.updateEndStatus);
    }
  };

  possibleSolutions = ({ nStars, usedNumbers }) => {
    const possibleNums = _.range(1, 10)
      .filter(number => usedNumbers.index(number) === -1);

    return possibleCombinationSum(possibleNums, nStars);
  };

  var possibleCombinationSum = function (arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount; i++) {
    var combinationSum = 0;
    for (var j = 0; j < listSize; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

updateEndStatus = () => {
  this.setState(prev => {
    if (this.state.usedNumbers.length === 9) {
      endStatus: "Game Over - You won";
    } else {
      if (prev.redraws === 0 && !this.possibleSolutions(prev)) {
        endStatus: "Game Over - You lost";
      }
    }
  });
};

render() {
  const {
    selectedNumbers,
    usedNumbers,
    nStars,
    answerCorrect,
    redraws,
    endStatus
  } = this.state;

  return (
    <div>
      <div hidden={endStatus} className="row">
        <Stars nStars={nStars} />
        <Button
          selectedNumbers={selectedNumbers}
          checkAnswer={this.checkAnswer}
          answerCorrect={answerCorrect}
          acceptAnswer={this.acceptAnswer}
          redraw={this.redraw}
          redraws={redraws}
        />
        <Answer
          selectedNumbers={selectedNumbers}
          unselectNumber={this.unselectNumber}
        />
        <Numbers
          selectedNumbers={selectedNumbers}
          usedNumbers={usedNumbers}
          selectNumber={this.selectNumber}
        />
      </div>
      <div hidden={!endStatus}>
        <endGame
          newGame={this.newGame}
          endStatus={endStatus}>{endStatus}</endGame>
      </div>
    </div>
  );
}
}

const Stars = props => {
  let stars = [];
  for (let j = 0; j < props.nStars; j++) {
    stars.push(<i key={j}> {"\u2729"} </i>);
  }

  return (
    <div className="col-5">
      <p />
      {stars}
      <p />
    </div>
  );
};

const Button = props => {
  let button;

  switch (props.answerCorrect) {
    case true:
      button = <button onClick={props.acceptAnswer}>Correct</button>;
      break;
    case false:
      button = <button>Wrong</button>;
      break;
    default:
      button = (
        <button
          disabled={props.selectedNumbers.length === 0}
          onClick={props.checkAnswer}
        >
          =
        </button>
      );
      break;
  }

  return (
    <div className="col-2">
      <p />
      {button}
      <p />
      <button disabled={props.redraws === 0} onClick={props.redraw}>
        Redraws left: {props.redraws}
      </button>
      <p />
    </div>
  );
};

const Answer = props => {
  return (
    <div className="col-5">
      <p />
      {props.selectedNumbers.map((number, i) => (
        <span onClick={() => props.unselectNumber(number)} key={i}>
          {number}
        </span>
      ))}
      <p />
    </div>
  );
};

const Numbers = props => {
  const numberArray = [];

  const numberFill = number => {
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return "selected";
    }
    if (props.usedNumbers.indexOf(number) >= 0) {
      return "used";
    }
  };

  for (let number = 1; number < 10; number++) {
    numberArray.push(
      <span
        key={number}
        className={numberFill(number)}
        onClick={() => props.selectNumber(number)}
      >
        {number}
      </span>
    );
  }

  return (
    <div className="card text-center">
      <p>___________________________________</p>
      {numberArray}
      <p>___________________________________</p>
    </div>
  );
};

const endGame = props => {

  return (
    <div>
      <h2>{props.endStatus}</h2>
      <button
        onClick={props.newGame}>New Game</button>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
