import React, { useState, useEffect } from "react";
import './index.css';

export default function ConvoListItem({ data, onClick, active }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        if (data.lastMessageDate > 0) {
            let d = new Date(data.lastMessageDate.seconds * 1000);
            let hours = d.getHours();
            let minutes = d.getMinutes();

            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            
            setTime(`${hours}:${minutes}`);
        }
    }, [data]);

    return (
        <div className={`convo-list-item ${active ? 'active' : ''}`} onClick={onClick}>
            <img className="item-photo" src={data.photo} alt="" />
            <div className="item-info">
                <div className="line-info">
                    <div className="line-name">{data.person}</div>
                    <div className="line-date">{time}</div>
                </div>
                <div className="line-info">
                    <div className="line-last-message">
                        <p>{data.lastMessage}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}