import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import "./styles.css";

// main class
class App extends React.Component {
  state = {
    cards: []
  };

  addCard = cardInfo => {
    console.log(cardInfo);
    this.setState(prevState => [
      {
        cards: prevState.cards.push(cardInfo)
      }
    ]);
    console.log(this.state.cards);
  };

  render() {
    return (
      <div className="App">
        <Form onSubmit={this.addCard} />
        <CardList cards={this.state.cards} />
      </div>
    );
  }
}

// function Card
// has 3 properties:
//  avatar_url
//  name
//  company
const Card = props => {
  return (
    <div style={{ margin: "1em" }}>
      <img width="50" src={props.avatar_url} />
      <div style={{ display: "inline-block", marginLeft: 10 }}>
        <div style={{ fontSize: "1.25em", fontWeight: "bold" }}>
          {props.name}
        </div>
        <div>{props.company}</div>
      </div>
    </div>
  );
};

// function CardList
// creates Card objects based on the data it receives
const CardList = props => {
  return <div>{props.cards.map(card => <Card key={card.id} {...card} />)}</div>;
};

class Form extends React.Component {
  state = {
    name: ""
  };

  handleSubmit = event => {
    event.preventDefault();
    axios
      .get("https://api.github.com/users/" + this.state.name)
      .then(response => {
        this.props.onSubmit(response.data);
      });
    this.setState({ name: "" });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          value={this.state.name}
          onChange={event => this.setState({ name: event.target.value })}
          type="text"
          placeholder="User here"
          required
        />
        <button type="submit">Add User Info</button>
      </form>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
