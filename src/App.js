import React, { Component } from "react";
import "./App.css";
import ActionCable from "actioncable";

class App extends Component {
  state = { text: "" };

  componentDidMount() {
    window
      .fetch("https://collab-text.herokuapp.com", (req, res, next) => {
        res.header(
          "Access-Control-Allow-Origin",
          "https://daiane.codes/collab-text-js/"
        );
        next();
      })
      .then((data) => {
        data.json().then((res) => {
          this.setState({ text: res.text });
        });
      });

    const cable = ActionCable.createConsumer(
      "wss://https://collab-text.herokuapp.com//cable"
    );
    this.sub = cable.subscriptions.create("NotesChannel", {
      received: this.handleReceiveNewText,
    });
  }

  handleReceiveNewText = ({ text }) => {
    if (text !== this.state.text) {
      this.setState({ text });
    }
  };

  handleChange = (e) => {
    this.setState({ text: e.target.value });
    this.sub.send({ text: e.target.value, id: 1 });
  };

  render() {
    return <textarea value={this.state.text} onChange={this.handleChange} />;
  }
}
export default App;
