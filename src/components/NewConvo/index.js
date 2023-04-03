import React, { useState, useEffect } from "react";
import './index.css';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import api from "../../firebase/api";

export default function NewConvo({ convoList, user, show, setShow }) {
    const [newConvoList, setNewConvoList] = useState([]);

    useEffect(() => {
        const getList = async () => {
            if (user !== null) {
                let results = await api.getUserList(user.id);
                setNewConvoList(results);
            }
        }
        getList();
    }, [user]);

    const addNewConvo = async (recipient) => {
        await api.addNewConvo(user, recipient);
    }

    const handleClose = () => {
        setShow(false);
    }

    return (
        <div className="new-convo" style={{ left: show ? 0 : -415 }}>
            <div className="new-convo-header">
                <div className="header-back-button" onClick={handleClose}>
                    <ArrowBackIcon style={{ color: 'var(--white4)' }} />
                </div>
                <div className="header-title">Nova conversa</div>
            </div>
            <div className="new-convo-list">
                {newConvoList.map((item, key) => (
                    <div className="new-convo-item" key={key} onClick={() => addNewConvo(item) & handleClose()}>
                        <img className="new-item-photo" src={item.photo} alt=""></img>
                        <div className="new-item-name">{item.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}