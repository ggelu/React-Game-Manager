import './App.css';
import Home from './Home';
import Istoric from './Istoric';
import Profil from './Profil';
import Joc from './Joc';
import RecenzieJoc from './RecenzieJoc'
import Login from './Login';
import Register from './Register';
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { variables } from './Variables'
import NavBar from './NavBar';
import NotLoggedNavBar from './NotLoggedNavBar';
import Pagina404 from './Pagina404';
import EditProfil from './EditProfil';
import useToken from './useToken';
import EditRecenzieJoc from './EditRecenzieJoc';

function App() {
  const { token, setToken } = useToken();

  useEffect(() => {
    console.log(localStorage.getItem("tema"))
    if(localStorage.getItem("tema") === null || localStorage.getItem("tema") === undefined)
    {
      if(window.matchMedia('(prefers-color-scheme: dark)').matches){
        localStorage.setItem('tema', 'dark')
      }
      else {
        localStorage.setItem('tema', 'light')
      }
    }
    
    if (localStorage.getItem("tema") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [])

  useEffect(() => {
    (
      async () => {
          const response = await fetch(variables.API_URL + "userAuth", {
            headers: {'Content-Type': 'application/json'},
            credentials : 'include'
          });
          
          const content = await response.json();
          if(content !== null)
          {
            setToken(content[0]);
          }
          else
          {
            sessionStorage.clear()
            setToken(null);
          }  
      }
      
    )();
  }, [token]);

  return (
      <div>
        <BrowserRouter>
            { token ? <NavBar user = {token} setToken = {setToken}/> : <NotLoggedNavBar />}
            <Routes>
              <Route exact path='/' element={<Home/>}/>
              <Route path='*' element={<Pagina404/>}/>
              
              <Route path='/profil/:UserId' element={<Profil user={token}/>}/>
              <Route path='/profil/:UserId/editProfil' element={<EditProfil user={token}/>}/>

              <Route path='/istoric' element={<Istoric/>}/>

              <Route path='/joc/:JocId' element={<Joc user={token}/>}/>
              {token? <Route path='/joc/:JocId/recenzie' element={<RecenzieJoc user={token}/>}/> : ''}
              {token? <Route path='/joc/:JocId/editRecenzie' element={<EditRecenzieJoc user={token}/>}/> : ''}
              
              
              <Route path='/login' element={<Login setToken={setToken}/>}/>
              <Route path='/register' element={<Register/>}/>
            </Routes>
        </BrowserRouter>
      </div>
    
  );
}

export default App;
