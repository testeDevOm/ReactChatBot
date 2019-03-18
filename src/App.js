import React, { Component } from 'react';
import { sendMessage } from './chat';
import { connect } from 'react-redux';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { styles } from './styles'

library.add(faPlayCircle, faPauseCircle)

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      playing: true,
      audio: [{
        id: 1,
        message: 'bom dia, tudo bem?',
        sender: true
      }, {
        id: 2,
        src: 'https://instaud.io/_/3qYU.ogg',
        sender: false
      }, {
        id: 3,
        message: 'eita, conta mais dessa história ai ahhaha',
        sender: true
      }, {
        id: 4,
        src: 'https://instaud.io/_/3qYU.ogg',
        sender: false
      }]
    }
  }

  messageTemp

  createMessage(event) {
    this.messageTemp = event.target.value
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }
  sendMessage() {
    this.state.audio.push({
      id: this.createUUID(),
      message: this.messageTemp,
      sender: true
    });
    sendMessage(document.getElementById('inputField').value);
    document.getElementById('inputField').value = '';
    this.forceUpdate();

  }

  handlePlayPause(id) {
    const audio = document.getElementById(id);
    if (audio.paused) {
      audio.play()
      audio.ontimeupdate = () => {
        const bar = document.getElementById(id + 'Proggress');
        bar.style.width = audio.currentTime / audio.duration * 100 + '%';
      }
      this.setState({ playing: true });
    } else {
      audio.pause();
      this.setState({ playing: false });
    }
  }



  render() {
    const { feed, sendMessage } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <h1>MathewSZinho</h1>
          <div style={styles.mainContainer}>
            {feed.map(entry => {
              console.log(entry)
              if (entry.sender === 'user') {
                return (
                  <div key={entry.id} style={styles.containterSender}>
                    <img style={styles.img} src='http://petmedmd.com/images/user-profile.png' alt="profile" />
                    <div style={styles.text}>
                      <p>{entry.text} </p>
                    </div>
                  </div>)
              } else {
                if (entry.src) {

                  return (
                    <React.Fragment key={entry.id + 'frag'}>
                      <div style={styles.containter} key={entry.id + 'text'}>
                        <img style={styles.img} src='https://media.licdn.com/dms/image/C4E03AQEC3kDfzMPS4g/profile-displayphoto-shrink_800_800/0?e=1558569600&v=beta&t=B6qHJQRr7gEHjytbQbX-tYcypgPqStIlUWA6aQm_2ww' alt="profile" />
                        <div style={styles.text}>
                          <p> {entry.text} </p>
                        </div>
                      </div>
                      <div style={styles.containter}>
                        <img style={styles.img} src='https://media.licdn.com/dms/image/C4E03AQEC3kDfzMPS4g/profile-displayphoto-shrink_800_800/0?e=1558569600&v=beta&t=B6qHJQRr7gEHjytbQbX-tYcypgPqStIlUWA6aQm_2ww' alt="profile" />
                        <div style={styles.width}>
                          <div id={entry.id + 'Proggress'} style={styles.proggress}></div>
                        </div>
                        <div style={styles.buttons}>
                              <FontAwesomeIcon icon={
                                document.getElementById(entry.id) && document.getElementById(entry.id).paused ?
                                  'play-circle' : !document.getElementById(entry.id) ?
                                    'play-circle' : 'pause-circle'} size='1x' style={styles.playButton}
                                    onClick={() => this.handlePlayPause(entry.id)}
                              />
                        </div>
                        <audio id={entry.id} src={entry.src} type="audio/ogg"></audio>
                      </div>
                    </React.Fragment>
                  )
                }
                return (
                  <div key={entry.id} style={styles.containter}>
                    <img style={styles.img} src='https://media.licdn.com/dms/image/C4E03AQEC3kDfzMPS4g/profile-displayphoto-shrink_800_800/0?e=1558569600&v=beta&t=B6qHJQRr7gEHjytbQbX-tYcypgPqStIlUWA6aQm_2ww' alt="profile" />
                    <div style={styles.text}>
                      <p> {entry.text} </p>
                    </div>
                  </div>)
              }
            })}
            <input id="inputField" style={styles.input} placeholder='escreva sua mensagem para mathewszinho' onKeyDown={(e) => e.keyCode === 13 ? sendMessage(e.target.value) : null} />
          </div>
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feed: state
});


export default connect(mapStateToProps, { sendMessage })(App);
