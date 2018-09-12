import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

// main class
class App extends React.Component {
  // objects private to class and subordinates in it
  state = {
    counter: 0
  };

  // function to raise the counter, receives one param without specific type
  // in this case, will be the integer value based from the Button class call
  raiseCounter = raise => {
    // object mode
    // this.setState({counter:this.state.counter + raise})

    // function mode that gets current state to update
    this.setState(current => ({
      counter: current.counter + raise
    }));
  };

  render() {
    // The onClick function is the call to the specific Button class
    return (
      <div className="App">
        <Button raise={1} onClick={this.raiseCounter} />
        <Button raise={10} onClick={this.raiseCounter} />
        <Button raise={100} onClick={this.raiseCounter} />
        <Button raise={1000} onClick={this.raiseCounter} />
        <Button raise={10000} onClick={this.raiseCounter} />
        <Result counter={this.state.counter} />
      </div>
    );
  }
}

// Button class
class Button extends React.Component {
  // objects private to the button
  state = {};

  // function called directly from the button
  onClick = () => {
    // it redirects with the specific property to the App main function
    this.props.onClick(this.props.raise);
  };
  //rendering of the button
  render() {
    return <button onClick={this.onClick}>Raise {this.props.raise}</button>;
  }
}

const Result = props => {
  return <p>{props.counter}</p>;
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
