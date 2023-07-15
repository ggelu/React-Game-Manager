import React, {useState} from 'react'
import { Navigate } from 'react-router-dom'
import { variables } from './Variables'

function Register() {
  const [nume, setNume] = useState('')
  const [parola, setParola] = useState('')
  const [numeDisplay, setNumeDisplay] = useState('')
  const [email, setEmail] = useState('')
  const [pozaUser, setPozaUser] = useState({})

  const [dateFolosite, setDateFolosite] = useState(false)
  const [eroareMail, setEroareMail] = useState(false)
  const [redirect, setRedirect] = useState(false);

  const submit =  async (e) => {
    e.preventDefault();
    
    if(variables.validMail.test(email))
    {
      let formData = new FormData()
      formData.append("Nume", nume)
      formData.append("Parola", parola) 
      formData.append("NumeDisplay", numeDisplay) 
      formData.append("Email", email)
      formData.append("PozaUser", pozaUser)

      const raspuns = await fetch(variables.API_URL + "register", {
        method: 'POST',
        body: formData
      }).then((raspuns) => {
        if(raspuns.status === 200) 
        {
          setRedirect(true);
          return raspuns.json();
        }
        else
          setDateFolosite(true)
      })
      console.log(raspuns)
    }
    else
      setEroareMail(true)
  }

  if (redirect){
    return <Navigate to="/login"/>
  }

  return (
    <div>
      <h1 className='titlu'>Inregistrare</h1>
      {dateFolosite &&
        <p>Nume de utilizator/profil sau email luate</p>
      }

        <form onSubmit={submit}>
            <label>Nume:</label>
            <input className='eroare-camp' type='text' placeholder='Nume...' maxLength={255} required onChange={(e) => {setNume(e.target.value)}}/>
            <label>Parola:</label>
            <input className='eroare-camp' type='password' placeholder='Parola...' maxLength={255} required onChange={(e) => {setParola(e.target.value)}}/>
            <label>Nume de profil:</label>
            <input className='eroare-camp' type='text' placeholder='Numele afisat pe profil...' maxLength={255} required onChange={(e) => {setNumeDisplay(e.target.value)}}/>

            {eroareMail && 
              <p>Mail invalid</p>
            }
            <label>Adresa de mail:</label>
            <input className='eroare-camp' type='text' placeholder='Email-ul asociat profilului...' maxLength={255} required onChange={(e) => {setEmail(e.target.value)}}/>

            <label>Poza:</label>
            <input type='file' id='inputPozaProfil' name='pozaProfilEdit' accept='.png,.jpg,.jpeg' required onChange={(e) => {
              if(e.target.files[0].name.slice(-4).match(/^(.png|.jpg|jpeg)$/))
              {
                  console.log(e.target.files[0])
                  setPozaUser(e.target.files[0])
              }
              else
              {
                  document.getElementById('inputPozaProfil').value = ''
                  alert("Fisier cu extensie gresita. Te rog sa incarci o poza!")
              }}}/>

            <button className='buton' type='submit'>Termina inregistrare</button>
        </form>
    </div>
  )
}

export default Register