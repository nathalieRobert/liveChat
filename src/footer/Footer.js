import React, { useState } from 'react';
import './Footer.css'
import TextField from '@material-ui/core/TextField';
function Footer (props) {      
  const  [chatMessage, setChatMessage] = useState('') 
           
    

    const handleSendMessage = () => {

        props.sendMessage('CHAT', chatMessage);
              setChatMessage('');
           
    }

    const handleTyping = (event) => {

        
            setChatMessage(event.target.value);
        
            props.sendMessage('TYPING', event.target.value);

    };

  
        return (
            <div>
                {props.privateMessage?
                <div className="footerComponent-private">
                <TextField
                    id="msg"
                    label="Type your message here..."
                    placeholder="Press enter to send message"
                    onChange={handleTyping}
                    margin="normal"
                    value={chatMessage}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
            </div>:<div className="footerComponent">
                <TextField
                    id="msg"
                    label="Type your message here..."
                    placeholder="Press enter to send message"
                    onChange={handleTyping}
                    margin="normal"
                    value={chatMessage}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
            </div>} 
            </div>
        )
    }

export default Footer;