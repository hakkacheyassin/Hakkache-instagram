import React, { useEffect } from 'react';
import { useState } from 'react'

import './App.css';
import Post from './Post';
import ImageUplod from './ImageUplod';

import { db, auth } from './firebase'

import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core'


function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)

  const [posts, setPosts] = useState([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser)
        setUser(authUser)

      } else {
        //user has logged out
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post is added fire this code off
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  const signUp = (event) => {
    event.preventDefault()

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((err) => alert(err.message))

    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault()

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message))

    setOpenSignIn(false)
  }



  return (
    <div className="App">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerImage" src="https://i.ibb.co/b2Jmqhb/vegan-style-personal-use.png" alt="instagram logo" />
            </center>

            <Input placeholder='username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder='email' type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type='submit' onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerImage" src="https://i.ibb.co/b2Jmqhb/vegan-style-personal-use.png" alt="instagram logo" />
            </center>

            <Input placeholder='email' type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type='submit' onClick={signIn}>Login</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://i.ibb.co/b2Jmqhb/vegan-style-personal-use.png"
          alt="instagram logo"
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
            </div>
          )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        
      </div>


      {user?.displayName ? (
        <ImageUplod username={user.displayName} />
      ) : (
        
        
          <h3>Login to upload</h3>
        )}
    </div >
  );
}

export default App;