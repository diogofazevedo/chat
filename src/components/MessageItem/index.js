import React, { useState, useEffect } from "react";
import './index.css';

export default function MessageItem({ data, user }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        if (data.date > 0) {
            let d = new Date(data.date.seconds * 1000);
            let hours = d.getHours();
            let minutes = d.getMinutes();

            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            
            setTime(`${hours}:${minutes}`);
        }
    }, [data]);

    return (
        <div className="message-line" style={{
            justifyContent: user.id === data.author ? 'flex-end' : 'flex-start'
        }}>
            <div className="message-item" style={{
                backgroundColor: user.id === data.author ? 'rgba(40, 108, 253, 0.1)' : 'var(--white4)'
            }}>
                <div className="message-text">{data.content}</div>
                <div className="message-date" style={{
                    color: user.id === data.author ? 'var(--grey6)' : 'var(--grey3)'
                }}>{time}</div>
            </div>
        </div>
    );
}