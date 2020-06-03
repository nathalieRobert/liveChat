import React, {useState} from 'react';
import './Login.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
function Login(props)
{
const [username, setUsername] = useState('')

    let handleUserNameChange = (event) => {
      
          setUsername (event.target.value)
   
      };

   let  handleConnectPublicly = () => {
        props.connect(username, false)
      }
    

        return(
            <div className="component-Login">
             <TextField
                id="user"
                label="Type your username"
                placeholder="Username"
                onChange={handleUserNameChange}
                margin="normal"
              />
              <br />
              <Button variant="contained" color="primary" onClick={handleConnectPublicly} >
                Start Chatting
             </Button>

            </div>
        )
    
}
export default  Login