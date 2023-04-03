import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import config from './config';

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore();

export default {
    ggPopup: async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        let result = await firebaseApp.auth().signInWithPopup(provider);
        return result;
    },
    fbPopup: async () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        let result = await firebaseApp.auth().signInWithPopup(provider);
        return result;
    },
    ttPopup: async () => {
        const provider = new firebase.auth.TwitterAuthProvider();
        let result = await firebaseApp.auth().signInWithPopup(provider);
        return result;
    },
    addUser: async (u) => {
        await db.collection('users').doc(u.id).set({
            name: u.name,
            photo: u.photo
        }, { merge: true });
    },
    getUserList: async (userId) => {
        let list = [];
        let result = await db.collection('users').get();
        result.forEach(result => {
            let data = result.data();
            if (result.id !== userId) {
                list.push({
                    id: result.id,
                    name: data.name,
                    photo: data.photo
                });
            }
        });
        return list;
    },
    addNewConvo: async (user, recipient) => {
        let newConvo = await db.collection('convos').add({
            messages: [],
            users: [user.id, recipient.id]
        });

        db.collection('users').doc(user.id).update({
            convos: firebase.firestore.FieldValue.arrayUnion({
                convoId: newConvo.id,
                person: recipient.name,
                photo: recipient.photo,
                with: recipient.id
            })
        });

        db.collection('users').doc(recipient.id).update({
            convos: firebase.firestore.FieldValue.arrayUnion({
                convoId: newConvo.id,
                person: user.name,
                photo: user.photo,
                with: user.id
            })
        });
    },
    onConvoList: (userId, setConvoList) => {
        return db.collection('users').doc(userId).onSnapshot((doc) => {
            if (doc.exists) {
                let data = doc.data();
                if (data.convos) {
                    let convos = [...data.convos];
                    convos.sort((a, b) => {
                        if (a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
                            return 1;
                        }
                        return -1;
                    })
                    setConvoList(data.convos);
                }
            }
        });
    },
    searchConvo: (userId, searchText) => {
        let list = [];
        let result = db.collection('users').where("name", "==", "searchText");
        result.forEach(result => {
            let data = result.data();
            if (result.id !== userId) {
                list.push({
                    id: result.id,
                    name: data.name,
                    photo: data.photo
                });
            }
        });
        return list;
    },
    onConvoContent: (convoId, setMsgList, setUsers) => {
        return db.collection('convos').doc(convoId).onSnapshot((doc) => {
            if (doc.exists) {
                let data = doc.data();
                setMsgList(data.messages);
                setUsers(data.users);
            }
        });
    },
    sendMessage: async (convoData, userId, type, content, users) => {
        let now = new Date();

        db.collection('convos').doc(convoData.convoId).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                type,
                author: userId,
                content,
                date: now
            })
        });

        for (let i in users) {
            let u = await db.collection('users').doc(users[i]).get();
            let uData = u.data();

            if (uData.convos) {
                let convos = [...uData.convos];

                for (let e in convos) {
                    if (convos[e].convoId == convoData.convoId) {
                        convos[e].lastMessage = content;
                        convos[e].lastMessageDate = now;
                    }
                }

                await db.collection('users').doc(users[i]).update({
                    convos
                });
            }
        }
    }
};