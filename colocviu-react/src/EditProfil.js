import React, {useEffect, useState} from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom';
import { variables } from './Variables'

function EditProfil({user}) {
    var UserId = window.location.pathname.substring(8);
    UserId = UserId.substring(0, UserId.indexOf('/'));

    const [userData, setUserData] = useState({})
    const [nume, setNume] = useState('');
    const [parola, setParola] = useState('');
    const [numeDisplay, setNumeDisplay] = useState('')
    const [email, setEmail] = useState('')
    const [pozaUser, setPozaUser] = useState([])

    const [dateFolosite, setDateFolosite] = useState(false)
    const [eroareMail, setEroareMail] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const EditProfil = async () => {
        if(variables.validMail.test(email))
        {
            let formData = new FormData()
            formData.append("UserId", user.UserId)
            formData.append("Nume", nume)
            formData.append("Parola", parola) 
            formData.append("NumeDisplay", numeDisplay) 
            formData.append("Email", email)
            formData.append("PozaUser", pozaUser)

            const raspuns = await fetch(variables.API_URL + "user/editProfil", {
                method: 'PUT',
                body: formData
            }).then((raspuns) => {
                if(raspuns.status === 200) 
                    return raspuns.json();
                else
                    setDateFolosite(true)
                })
        }
        else
            setEroareMail(true)
    };

    const submit = (e) => {
        e.preventDefault()

        EditProfil()
        variables.addIstoric(UserId, "Editat profil")
        setRedirect(true)
    }

    useEffect (() => {
        if(user !== null && user !== undefined)
        {
            if(user.UserId.toString() === UserId)
            {
                (
                    async () => {
                        const raspuns = await fetch(variables.API_URL + `user/getUserEdit?id=${user.UserId}`)
                        
                        const content = await raspuns.json();
                        
                        if(content !== null)
                        {
                            setUserData(content[0]);
                        }
                        else
                        {
                            setUserData({})
                        }
                    }
                )();
            }
        }
    }, [user ? user.UserId : null])

    if (redirect){
        return <Navigate to={`/profil/${user.UserId}`}/>
    }

  return (
    <div>
        {user !== null &&
            <div>
                {user.UserId.toString() === UserId &&
                <div>
                    <div className='tw-border-b dark:tw-border-verde_d tw-border-albastru_i'>
                        <h1 className='titlu'>Date profil curente:</h1>
                        <h4>Nume: {user.Nume}</h4>
                        <h4>Numele afisat pe profil: {userData.NumeDisplay}</h4>
                        <h4>Email: {userData.Email}</h4>
                        <br/>
                    </div>
            
                    <div className='formEditProfil'>
                        <h2 className='titlu tw-mt-7 tw-mb-5'>Input modificat profil:</h2>
                        {dateFolosite &&
                            <p>Nume de utilizator/profil sau email luate</p>
                        }

                        <form onSubmit={submit}>
                            <label>Nume:</label>
                            <input className='eroare-camp' type='text' placeholder={user.Nume} maxLength={255} required onChange={(e) => {setNume(e.target.value)}}/>
                            <label>Parola:</label>
                            <input className='eroare-camp' type='text' maxLength={255} required onChange={(e) => {setParola(e.target.value)}}/>
                            <label>Nume de profil:</label>
                            <input className='eroare-camp' type='text' maxLength={255} placeholder={userData.NumeDisplay} required onChange={(e) => {setNumeDisplay(e.target.value)}}/>

                            {eroareMail && 
                                <p>Mail invalid</p>
                            }
                            <label>Adresa de mail:</label>
                            <input className='eroare-camp' type='text' maxLength={255} placeholder={userData.Email} required onChange={(e) => {setEmail(e.target.value)}}/>

                            <label>Poza:</label>
                            <input type='file' id='inputPozaProfil' name='pozaProfilEdit' accept='.png, .jpg, .jpeg' required onInput={(e) => {
                                if(e.target.files[0].name.slice(-4).match(/^(.png|.jpg|jpeg)$/))
                                {
                                    setPozaUser(e.target.files[0])
                                    console.log(pozaUser)
                                }
                                else
                                {
                                    alert("Fisier cu extensie gresita. Te rog sa incarci o poza!")
                                }}}/>

                            <button className='buton' type='submit'>Termina editare</button>
                        </form>
                    </div>
                </div>
                }
            </div>
        }

        {user === null &&
            <div>
                <h1 className='titlu tw-text-4xl tw-text-rosu_eroare'>Nu esti conectat!</h1>
            </div>
        } 
    </div>
  )
}

export default EditProfil