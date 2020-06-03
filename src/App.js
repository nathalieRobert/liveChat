import React, { Component } from 'react';
import ChatMessageBox from './ChatMessageBox/ChatMessageBox'



class App extends Component {
  refreshPage(){
    window.location.reload();
  }

  render() {
    return (
        <ChatMessageBox />
    );
  }
}

export default App;
