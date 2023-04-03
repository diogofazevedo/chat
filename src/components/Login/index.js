import React from "react";
import './index.css';

import logo from '../ConvoIntro/logo.png';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

import api from "../../firebase/api";

export default function Login({ onReceive }) {
    const handleGgLogin = async () => {
        let result = await api.ggPopup();
        if (result) {
            onReceive(result.user);
        } else {
            alert("Erro.");
        }
    }

    const handleFbLogin = async () => {
        let result = await api.fbPopup();
        if (result) {
            onReceive(result.user);
        } else {
            alert("Erro.");
        }
    }

    const handleTtLogin = async () => {
        let result = await api.ttPopup();
        if (result) {
            onReceive(result.user);
        } else {
            alert("Erro.");
        }
    }

    return (
        <div className="login">
            <div className="login-logo">
                <img src={logo} alt=""></img>
            </div>
            <div className="login-button">
                <Button className="btn btn-dark btn-lg mb-3 custom" onClick={handleGgLogin}>
                    <GoogleIcon /> <strong>Google</strong>
                </Button>
                <Button className="btn btn-primary btn-lg mb-3 custom" onClick={handleFbLogin}>
                    <FacebookIcon /> <strong>Facebook</strong>
                </Button>
                <Button className="btn btn-primary btn-lg custom" onClick={handleTtLogin}>
                    <TwitterIcon /> <strong>Twitter</strong>
                </Button>
            </div>
        </div>
    );
}