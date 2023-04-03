import React, { useState, useEffect, useRef } from "react";
import './index.css';

import MessageItem from "../MessageItem";

import EmojiPicker from "emoji-picker-react";

import { makeStyles } from '@material-ui/core/styles';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

import api from "../../firebase/api";

const useStyles = makeStyles({
    iconColor: {
        color: '#286cfd',
    },
});

export default function ConvoWindow({ user, data }) {
    const classes = useStyles();
    
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [msgList, setMsgList] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setMsgList([]);
        let unsub = api.onConvoContent(data.convoId, setMsgList, setUsers);
        return unsub;
    }, [data.convoId]);

    const body = useRef();

    useEffect(() => {
        if (body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [msgList])

    const handleEmojiClick = (e, emojiObject) => {
        setMessage(message + emojiObject.emoji);
    };

    const handleOpenEmoji = () => {
        setEmojiOpen(true);
    };

    const handleCloseEmoji = () => {
        setEmojiOpen(false);
    }

    const handleInputKeyUp = (e) => {
        if (e.keyCode == 13) {
            handleSendClick();
        }
    }

    const handleSendClick = () => {
        if (message !== '') {
            api.sendMessage(data, user.id, 'text', message, users);
            setMessage('');
            setEmojiOpen(false);
        }
    }

    return (
        <div className="convo-window">
            <div className="window-header">
                <img className="header-photo" src={data.photo} alt="" />
                <div className="header-name">{data.person}</div>
            </div>
            <div className="window-body" ref={body}>
                {msgList.map((item, key) => (
                    <MessageItem
                        key={key}
                        data={item}
                        user={user}
                    />
                ))}
            </div>
            <div className="window-emoji" style={{ height: emojiOpen ? '300px' : '0px' }}>
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    disableSearchBar
                    disableSkinTonePicker
                />
            </div>
            <div className="window-footer">
                <div className="footer-extra">
                    <div className="icon" onClick={handleCloseEmoji} style={{ width: emojiOpen ? 40 : 0 }}>
                        <CloseIcon className={classes.iconColor} />
                    </div>
                    <div className="icon" onClick={handleOpenEmoji}>
                        <EmojiEmotionsIcon className={classes.iconColor} />
                    </div>
                    <div className="icon">
                        <AttachmentIcon className={classes.iconColor} />
                    </div>
                </div>
                <div className="footer-input">
                    <input
                        className="input"
                        type="text"
                        placeholder="Escreva uma mensagem"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyUp={handleInputKeyUp}
                    />
                </div>
                <div className="footer-submit">
                    <div className="icon" onClick={handleSendClick}>
                        <SendIcon className={classes.iconColor} />
                    </div>
                </div>
            </div>
        </div>
    );
}