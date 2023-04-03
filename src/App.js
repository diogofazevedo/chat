import React, { useState, useEffect } from 'react';
import './App.css';

import ConvoListItem from './components/ConvoListItem';
import ConvoIntro from './components/ConvoIntro';
import ConvoWindow from './components/ConvoWindow';
import Login from './components/Login';
import NewConvo from './components/NewConvo';

import { makeStyles } from '@material-ui/core/styles';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';

import api from './firebase/api';

const useStyles = makeStyles({
  iconColor: {
    color: '#286cfd',
  },
});

export default function App() {
  const classes = useStyles();

  const [convoList, setConvoList] = useState([]);
  const [activeConvo, setActiveConvo] = useState({});
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showNewConvo, setShowNewConvo] = useState(false);

  useEffect(() => {
    if (user !== null) {
      let unsub = api.onConvoList(user.id, setConvoList);
      return unsub;
    }
  }, [user]);

  const handleNewConvo = () => {
    setShowNewConvo(true);
  }

  const handleInputKeyUp = (e) => {
    if (e.keyCode == 13) {
      handleSearch();
    }
  }

  const handleSearch = async () => {
    if (searchText !== '') {
      let results = api.searchConvo(user.id, searchText);
      setConvoList(results);
      setSearchText('');
    }
  }

  const handleLogout = () => {
    setUser(null);
  }

  const handleLoginData = async (u) => {
    let newUser = {
      id: u.uid,
      name: u.displayName,
      photo: u.photoURL
    };
    await api.addUser(newUser);
    setUser(newUser);
  }

  if (user === null) {
    return (
      <Login onReceive={handleLoginData} />
    );
  }

  return (
    <div className='app'>
      <div className='side-bar'>
        <NewConvo
          convoList={convoList}
          user={user}
          show={showNewConvo}
          setShow={setShowNewConvo}
        />
        <header>
          <img className='user-avatar' src={user.photo} alt='' />
          <div className='buttons'>
            <div className='icon-button' onClick={handleNewConvo}>
              <ChatIcon className={classes.iconColor} />
            </div>
            <div className='icon-button' onClick={handleLogout}>
              <LogoutIcon className={classes.iconColor} />
            </div>
          </div>
        </header>
        <div className='search'>
          <div className='search-bar'>
            <SearchIcon className={classes.iconColor} fontSize='small' />
            <input
              type="search"
              placeholder='Pesquise uma conversa'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyUp={handleInputKeyUp}
            />
          </div>
        </div>
        <div className='convo-list'>
          {convoList.map((item, key) => (
            <ConvoListItem
              key={key}
              data={item}
              onClick={() => setActiveConvo(convoList[key])}
              active={activeConvo.convoId === convoList[key].convoId}
            />
          ))}
        </div>
      </div>
      <div className='message-area'>
        {activeConvo.convoId === undefined ? <ConvoIntro /> : <ConvoWindow user={user} data={activeConvo} />}
      </div>
    </div>
  );
}