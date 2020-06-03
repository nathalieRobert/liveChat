import React, { useState } from 'react';
import './Aside.css'
import userImage from '../userImage.png';
import TextField from '@material-ui/core/TextField';
import PrivateMessageBoxx from '../PrivateMessageBox/PrivateMessageBox'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

const Aside = (props) => {
    const [openPrivateBox, setOpenPrivateBox] = useState(false);
    const [roomNotification, setRoomNotification] = useState(props.roomNotification)
    const [yousername, setYousername] = useState(props.username)
    const [otherUser, setOtherUser] = useState('')


   let handleClosePrivateBox = () => {
            setOpenPrivateBox(false);
    }

    let handleOpenPrivateBox = (e) => {
        let otherUser = e.currentTarget.dataset.value;
            setOpenPrivateBox(true);
            setOtherUser(otherUser);
    }

    let handleSearch = (e) => {

        let currentList = [];

        let newList = [];

        if (e.target.value !== "") {

            currentList = roomNotification;

            newList = currentList.filter(notification => {

                const lc = notification.sender.split('~')[0].toLowerCase();

                const filter = e.target.value.toLowerCase();
                return lc.includes(filter);
            });
        } else {
            newList = roomNotification;
        }

            setRoomNotification(newList); 
  
    }

 
        return (
            <aside>
                {/* <div className="vr"></div> */}
                <TextField
                    id="search full-width"
                    label="Search members"
                    type="search"
                    onChange={handleSearch}
                    margin="normal"
                />
                <ul >
                    <List component="nav">
                        {roomNotification.map((notification, i) =>
                            yousername.toLowerCase().trim() === notification.sender.split('~')[0].toLowerCase().trim()
                                ? ""
                                : <li key={i} onClick={handleOpenPrivateBox} data-value={notification.sender.split('~')[0].toLowerCase().trim()}>
                                    <div>
                                        <div>
                                            <ListItem
                                                key={i}
                                                role={undefined}
                                                dense
                                                button >
                                                <Avatar alt="User Image" src={userImage} />
                                               
                                                <ListItemText primary={notification.sender.split('~')[0]}
                                                    secondary={notification.status === 'online' ||
                                                        notification.status === 'typing...' ?
                                                        <span className="status green"></span> : <span className="status orange"></span>} />
                                                <ListItemSecondaryAction>
                                                <Tooltip title="Send private message">
                                                    <IconButton aria-label="Private Message">
                                                        <CommentIcon />
                                                    </IconButton>
                                                    </Tooltip>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </div>
                                        <br />

                                    </div>
                                </li>
                        )} </List></ul>

                {openPrivateBox ?
                    <PrivateMessageBoxx open={openPrivateBox} handleClose={handleClosePrivateBox}
                        notifications={roomNotification} youser={yousername} otherUser={otherUser} />
                    : ""}

            </aside>
        )
    
}
export default Aside;