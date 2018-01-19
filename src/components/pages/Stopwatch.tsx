import * as React from "react";

const formattedSeconds = (sec) =>
  Math.floor(sec / 60) +
    ':' +
  ('0' + sec % 60).slice(-2)
  
export interface StopwatchState {
    secondsElapsed: number,
    laps,
    lastClearedIncrementer
}

export class Stopwatch extends React.Component {
  incrementer;
  state: StopwatchState;

  constructor(props) {
    super(props);
    this.state = { 
      secondsElapsed: 0, 
      laps: [],
      lastClearedIncrementer: null
    };
    this.incrementer = null;
    this.handleStartClick();
  }  
    
  handleStartClick() {
    this.incrementer = setInterval( () =>
      this.setState({
        secondsElapsed: this.state.secondsElapsed + 1
      })
    , 1000);
  }
  
  public handleStopClick() {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer
    });
  }
  
  handleResetClick() {
    clearInterval(this.incrementer);
    this.setState({
      secondsElapsed: 0,
      laps: []
    });
  }
  
  handleLabClick() {
    this.setState({
      laps: this.state.laps.concat([this.state.secondsElapsed])
    })
  }
  
  render() {
    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer" style={{fontSize: '2em', textAlign: 'center'}}>{formattedSeconds(this.state.secondsElapsed)}</h1>
        <br/>
        <div className="wrapper" style={{textAlign: "center"}}>
        {(this.state.secondsElapsed === 0 ||
          this.incrementer === this.state.lastClearedIncrementer
          ? <Button style={{ alignContent: "center" }} className="start-btn" onClick={this.handleStartClick.bind(this)}>Start</Button>
          : <Button style={{ alignContent: "center" }} className="stop-btn" onClick={this.handleStopClick.bind(this)}>Stop</Button>
        )}
        
        {(this.state.secondsElapsed !== 0 &&
          this.incrementer !== this.state.lastClearedIncrementer
          ? <Button style={{ alignContent: "center" }} onClick={this.handleLabClick.bind(this)}>Lap</Button>
          : null
        )}


        {(this.state.secondsElapsed !== 0 &&
          this.incrementer === this.state.lastClearedIncrementer
          ? <Button onClick={this.handleResetClick.bind(this)}>Reset</Button>
          : null
        )}
        <br/>
        <br/>
        <ul className="stopwatch-laps">
          { this.state.laps.map((lap, i) =>
              <li className="stopwatch-lap">T<strong>{i + 1}</strong> - {formattedSeconds(lap)}</li>)
          }
        </ul>
        </div>
      </div>
    );
  }
}

/** verbose component before 0.14
class Button extends React.Component {
  render() {
    return <button type="button" {...this.props}
                   className={"btn " + this.props.className } />;
  }
}
*/

const Button = (props) =>
  <button type="button" {...props} className={"btn " + props.className } />;
