import React, {useState} from 'react'
import { Navigate } from 'react-router-dom'
import { variables } from './Variables'
import PropTypes from 'prop-types'

function Login({setToken}) {
  const [nume, setNume] = useState('');
  const [parola, setParola] = useState('');
  const [userId, setUserId] = useState('');
  const [redirect, setRedirect] = useState(false);

  const submit = async (e) => {
      e.preventDefault();

      const raspuns = await fetch(variables.API_URL + "login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials : 'include',
        body: JSON.stringify({
          nume,
          parola
        })
      })
      .then((raspuns) => {
        if(raspuns.status === 200)
        {
          return raspuns.json();
        } 
        alert("Date gresite. Incearca din nou!!")
        throw new Error("Date gresite. Incearca din nou!")
      })

      if(raspuns !== undefined || raspuns !== null)
      {
        setToken(raspuns);
        setRedirect(true);
      }
  };

  if (redirect){
    return <Navigate to="/"/>
  }
  
  const getUserId = async () => {
      const raspuns = await fetch(
        variables.API_URL + "user/" + nume + "," + parola
      ).then((raspuns) => raspuns.json());
  
      setUserId(raspuns);
      console.log(userId[0].UserId)
    };

  return (
      <div>
        <h1></h1>
        <div className='tw-grid tw-col-1 tw-justify-center tw-text-center mediu:tw-gap-3 tw-gap-1'>
          <h2 className='titlu'>Login</h2>
          <form className='tw-w-full' onSubmit={submit}>
              <label>Nume:</label>
              <input className='eroare-camp' type='text' placeholder='Nume...' required onChange={(e) => {setNume(e.target.value)}}/>
              <label>Parola:</label>
              <input className='eroare-camp' type='password' placeholder='Parola...' required onChange={(e) => {setParola(e.target.value)}}/>
              <button className='buton' type='submit'>Login</button>
          </form>
        </div>
      </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}
export default Login