import React, { Component } from 'react';
import './App.css';
import logo from './2_experience_black.png';

class App extends Component {

  constructor(props) {
    super(props);

    this.interval = null;
    this.challenge = 'Lorem ipsum knowit är bäst dolor sit amet';
    this.localStorageName = 'typochallenge';
    this.localStorageScoreboard = 'scoreboard';

    if(!this.getWorldRecord() || this.getWorldRecord() != 0) {
      this.saveWorldRecord(60000);
    }

    if(!this.getScoreboard()){
      this.saveScoreboard([{time: 60000, name: "Test"}]);
    }

    this.state = {
      time: 0,
      worldRecord: this.getScoreboard()[0].time,
      newWorldRecord: false,
      scoreboard: this.getScoreboard()
    }
  }

  start() {
    console.log('start');
    this.interval = setInterval(() => this.tick(), 10);
  }

  stop() {
    console.log('stop');
    clearInterval(this.interval);
    let scoreboard = this.updateScoreboard(this.state.time);
    this.setState({scoreboard: scoreboard});
    this.saveScoreboard(scoreboard);
    if(this.state.time < this.state.worldRecord) {
      console.log('wr');
      this.saveWorldRecord(this.state.time);
      this.setState({
        worldRecord: this.state.time,
        newWorldRecord: true,
      });
      this.saveScoreboard(scoreboard);
    }
  }

  reset() {
    console.log('reset');
    this.interval = null;
    this.setState({
      time: 0,
      newWorldRecord: false
    });
  }

  tick() {
    console.log('tick');
    this.setState(prevState => ({
      time: prevState.time + 1
    }));
  }

  saveWorldRecord(time) {
    localStorage.setItem(this.localStorageName, time);
  }

  getWorldRecord() {
    let wr = localStorage.getItem(this.localStorageName);
    return !wr ? null : wr;
  }

  saveScoreboard(scoreboard){
    let json = JSON.stringify(scoreboard);
    localStorage.setItem(this.localStorageScoreboard, JSON.stringify(scoreboard));
  }

  getScoreboard(){
    let sb = localStorage.getItem(this.localStorageScoreboard);
    if(sb === "undefined")
      return null;
    let json = JSON.parse(sb);
    return json.length > 10 ? null : json;
  }

  formatTime(time) {
    let multiplier = 60;

    let minutes = Math.floor(time / (60 * multiplier));
    let seconds = Math.floor((time - (minutes * 60 * multiplier)) / 60);
    let centiseconds = (time - (seconds * 60) - (minutes * 60 * multiplier)) % multiplier;

    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    if (centiseconds < 10) centiseconds = `0${centiseconds}`;

    return `${minutes}:${seconds}:${centiseconds}`;
  }

  renderScoreboard(){
    return(
      <div>
        <ul>
        {console.log(this.state.scoreboard)}
        {this.state.scoreboard.map((element, index) =>
          <li key={index}>{element.name} {this.formatTime(element.time)}</li>
        )}
        </ul>
      </div>
    )
  }

  updateScoreboard(time){
    let scoreboard = this.state.scoreboard;
    if(time < this.state.worldRecord){
      scoreboard.splice(0, 0, {time: time, name: "Anton"})
      scoreboard.join();
      return scoreboard;
    }
    var test = this.formatTime(scoreboard[scoreboard.length - 1].time);
    if(time > scoreboard[scoreboard.length - 1].time)
      if(scoreboard.length <10){
        scoreboard[scoreboard.length] = {time: time, name: "Test"}
        return scoreboard;
      }
      else
        return scoreboard;
    else if(time < scoreboard[scoreboard.length -1].time){
        for(let i=1;i<9;i++){
          if(time <= scoreboard[i].time){
            scoreboard.splice(i, 0, {time: time, name: "Test2"});
            scoreboard.join();
            if(scoreboard.length > 10)
              scoreboard.pop();
            return scoreboard;
          }
        }
    }
    return scoreboard;
  }

  handleOnChange(event) {
    if(!this.interval) {
      this.start();
    }
    
    if(event.target.value === this.challenge) {
      this.stop();
    }
  }

  render() {
    return (
      <div className="app">
        <div className="logo">
          <img src={logo} alt="knowit" />
        </div>
        {this.state.newWorldRecord ? (
          <div className="new-world-record">
            NEW WORLD RECORD!
          </div>
        ):null}
        <div className="display">
          <div className="display__time">
            {this.formatTime(this.state.time)}
          </div>
          
          <div className="display__world-record">
            World record: {this.formatTime(this.state.worldRecord)}
          </div>
          <div className="scoreboard-title">
            Top 10:
            <div className="scoreboard">
            {this.renderScoreboard()}
          </div>
          </div>
        </div>
        
        <div className="challenge">
          <div className="challenge__description">Skriv meningen så snabbt som möjligt</div>
          <div className="challenge__sentence">{this.challenge}</div>
        </div>
        <div className="input">
          <input type="text" 
            ref="answer" 
            value={this.state.answer}
            spellCheck="false"
            onChange={(event) => this.handleOnChange(event)} />
        </div>
        
      </div>
    );
  }
}

export default App;
