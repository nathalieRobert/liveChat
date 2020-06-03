import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Footer from '../footer/Footer'
import userImage from '../userImage.png';

var stompClient = null;
const url = 'http://localhost:9091'
function PrivateMessageBox (props) {
  const [open, setOpen] = useState(props.open)
  const [broadcastMessage, setBroadcastMessage] = useState([])
  const [openMessageBox, setOpenMessageBox] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
    connect()


  let connect = () => {

    if (props.otherUser) {

      const Stomp = require('stompjs')

      var SockJS = require('sockjs-client')

      SockJS = new SockJS(url+'/ws')

      stompClient = Stomp.over(SockJS);

      stompClient.connect({}, onConnected);

    }
  }

  let onConnected = () => {

    // Subscribing to the private topic
    stompClient.subscribe('/user/' + props.otherUser.toString().toLowerCase() + '/reply', onMessageReceived);

    // Registering user to server as a private chat user
    stompClient.send('/app/addPrivateUser', {}, JSON.stringify({ sender: props.otherUser, type: 'JOIN' }));

    
      setShowFooter(true)
   

  }

  let sendMessage = (type, value) => {

    if (stompClient) {
      var chatMessage = {
        sender: props.youser,
        receiver: props.otherUser,
        content: type === 'TYPING' ? value : value,
        type: type

      };
      stompClient.send('/app/sendPrivateMessage', {}, JSON.stringify(chatMessage));

    }
  }

  let onMessageReceived = (payload) => {
    var message = JSON.parse(payload.body);
    if (message.type === 'CHAT') {
      broadcastMessage.push({
        message: message.content,
        sender: message.sender,
        dateTime: message.dateTime
      })
     
        setBroadcastMessage(broadcastMessage)
    }
    
    }


    return <div>

      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="responsive-dialog-title"
        onEscapeKeyDown={props.handleClose}
        autoScrollBodyContent={true}

      >
        <DialogTitle id="responsive-dialog-title">{"Send Private Message"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div> <img src={userImage} alt="Default-User" id="userImage" /></div>
            <div id="usernameDialogNotifications">
              <h5>{props.otherUser}</h5>
            </div>
            <div>
              <div><h5>Sent messages by You to {props.otherUser}</h5></div>
              {broadcastMessage.map((msg, i) =>
                <div>{props.youser === msg.sender ? msg.message : ""}</div>

              )}

            </div>
          </DialogContentText>
        </DialogContent>

       
        {showFooter ? <Footer sendMessage={sendMessage} privateMessage={true} connect={connect} /> : "Connecting to " + props.otherUser + "..."}
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Close
                 </Button>
        </DialogActions>
      </Dialog>
    </div>
  
  }


export default PrivateMessageBox;
