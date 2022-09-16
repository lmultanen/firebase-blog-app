import './App.css';
import {Routes, Route, Link, useNavigate, Navigate} from 'react-router-dom'
import Home from './Pages/Home';
import Login from './Pages/Login';
import CreatePost from './Pages/CreatePost';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import SinglePost from './Pages/SinglePost';
import EditPost from './Pages/EditPost';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate()

  // could have just used localStorate.getItem('isAuth') in initial useState for isAuth above
  useEffect(() => {
    let loggedIn = localStorage.getItem('isAuth')
    if (loggedIn){
      setIsAuth(true)
    }
  },[])

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      navigate('/login');
    })
  }

  return (
    <div>
      <nav>
        <Link to='/' className='menu-link'> Home </Link>
        {isAuth ? <Link to='/createpost' className='menu-link'> Create Post </Link> : <></>}
        {isAuth ? <button onClick={signUserOut}>Sign Out</button> : <Link to='/login' className='menu-link'> Login </Link>}
        
      </nav>
      <Routes>
        <Route path='/' element={<Home isAuth={isAuth}/>}/>
        <Route path='/login' element={<Login setIsAuth={setIsAuth}/>}/>
        <Route path='/createpost' element={<CreatePost isAuth={isAuth}/>}/>
        <Route path='/posts/:id' element={<SinglePost isAuth={isAuth}/>}/>
        <Route path='/posts/edit/:id' element={<EditPost isAuth={isAuth}/>}/>
        <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
    </div>
  );
}

export default App;
