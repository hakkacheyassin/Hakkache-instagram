import React ,{useState,useEffect} from 'react';

import './App.css';
import Post from './Post';
import { db ,auth} from './firebase'
import { makeStyles } from '@material-ui/core/styles'
import { Modal } from '@material-ui/core/'
import { Button,Input } from '@material-ui/core'
import ImageUplod from './ImageUplod';

function getModalStyle() {
  const top = 50;
  const left = 50;

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

  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, SetOpen] = useState(false);
  const [openSginin,SetopenSginin]= useState(false);
  const [username, SetUsername] = useState('');
  const [email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [user,Setuser] = useState(null);

 useEffect(() => {

 const unsubscribe = auth.onAuthStateChanged((authUser) => {

  if (authUser) {

    console.log(authUser);
    Setuser(auth);

    if (authUser.displayName){
        /////// don't updateusername

    }else{

        return authUser.updateProfile({
          displayName : username,

        });

    }


  } else{

      Setuser(null);
  }
})


  return () => {
    unsubscribe();
  }

 }, [user,username]);


  useEffect(() => {
 
    db.collection('posts').onSnapshot(snapshot => {

      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post:doc.data()
        
      })));
    })
  
  }, []);

    const sginup = (event) => {
    
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email,password).
      then((authUser) =>{

       return authUser.user.updateProfile({
          displayName : username, 
        })
      } )
      .catch((error) => alert(error.message));

      SetOpen(false);

    }

    const signIn = (event) => {

      event.preventDefault();
      auth.signInWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message));

      SetopenSginin(false); 
    } 

  return (
    <div className="App">

  <ImageUplod username={user.displayName }/>

    <Modal
        open={openSginin}
        onClose={() => SetopenSginin(false)}>
          
        <div style={modalStyle} className={classes.paper}>
          <form className="s_up">
            <center>

              <img className="hedaer_image" src="https://i.ibb.co/b2Jmqhb/vegan-style-personal-use.png" alt="hey"/ >
             

              </center>
              
              <Input placeholder="email"
               type="text"
                value={email}
                onChange={(e) => SetEmail(e.target.value)}
              />

               <Input placeholder="password"
               type="text"
                value={password}
                onChange={(e) => SetPassword(e.target.value)}
              />
               
               <Button type="sumbit" onClick={signIn} >Sign In </Button>
              </form>
        </div>

    </Modal>

    <div className="App__header">
    <img className="logo__header" 
    src="https://i.ibb.co/b2Jmqhb/vegan-style-personal-use.png" alt="logo__header"/>
    </div>

    {user ? (
          <Button onClick={() => auth.signOut() }>Logout </Button>

    ) :  (
    
    <div className="app_loginContainer">

    <Button onClick={() => SetopenSginin(true) }> Sign  In</Button>
    <Button onClick={() => SetOpen(true) }> Sign  Up</Button>

    </div>

    
    
    )}


    {
      posts.map(({id,post}) => (

        <Post key={id} username={post.username} caption={post.caption}  imageUrl={post.imageUrl} />

        ))
    }I 

  
    </div>
  );
}

export default App;
