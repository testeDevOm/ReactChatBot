import React, { Component } from 'react';
import { sendMessage } from './chat';
import { connect } from 'react-redux';
import './App.css';

class App extends Component {
  render() {
    const { feed, sendMessage } = this.props;
    return (
      <div>
        <h1>ChatBot says Hi!</h1>
        <ul>
          {feed.map( entry => <li>{ entry.text }</li> )}
        </ul>
        <input type='text' onKeyDown={ (e) => e.keyCode === 13 ? sendMessage(e.target.value): null}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feed: state
});

export default connect(mapStateToProps, { sendMessage })(App);
