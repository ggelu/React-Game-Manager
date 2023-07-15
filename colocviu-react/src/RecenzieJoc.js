import React, { useState } from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom';
import { variables } from './Variables';

function RecenzieJoc({user}) {
    const { state } = useLocation()
    const joc = state.joc

    const [nrOre, setNrOre] = useState()
    const [recenzie, setRecenzie] = useState('')

    const [jocUserSteam, setJocUserSteam] = useState([])
    const [nrRealizari, setNrRealizari] = useState([])
    const [redirect, setRedirect] = useState(false)

    const scor = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 }
    ]

    const stari = [
        { label: 'Nejucat', value: 'Nejucat' },
        { label: 'Jucat', value: 'Jucat' },
        { label: 'Terminat', value: 'Terminat' },
        { label: 'Completat', value: 'Completat' }
    ]

    const [scorValue, setScorValue] = useState(10);
    const [stariValue, setStariValue] = useState('Nejucat')

    const schimbaScor = (event) => {
        setScorValue(event.target.value);
    };

    const schimbaStari = (event) => {
        setStariValue(event.target.value);
    };
    
    const addColectie = async () => {
        const response = await fetch(variables.API_URL + "addColectie", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "userId": user.UserId,
                "jocId": joc.JocId,
                "scor": scorValue,
                "stare": stariValue,
                "nrOre" : nrOre,
                "recenzie": recenzie
              })
        }).then((response) => response.json());
        variables.addIstoric(user.UserId, "Adaugat joc la colectie")
        variables.stergeWishlistEntry(user.UserId, joc.JocId)
    }

    const updateGameScor = async () => {
        const response = await fetch(variables.API_URL + `joc/updatescor/${joc.JocId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        }).then((response) => response.json());
        console.log(response)
    };

    const updateMedalieJocuri = async () => {
        const response = await fetch(variables.API_URL + `medalie/getNrJocuri?userId=${user.UserId}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        }).then((response) => response.json());
        console.log(response)
    };

    const getVerSteam = async () => {
        if(user.SteamId !== null)
        {
            const raspunsUserSteam = await fetch(variables.API_URL + `steam/getJocUserSteam?steamId=${user.SteamId}`
            ).then((raspunsUserSteam) => raspunsUserSteam.json());
            console.log(raspunsUserSteam)
            setJocUserSteam(raspunsUserSteam)

            const raspunsRealizari = await fetch(variables.API_URL + `steam/getNrRealizari?steamId=${user.SteamId}&appId=${joc.SteamId}`
            ).then((raspunsRealizari) => raspunsRealizari.json());
            console.log(raspunsRealizari)
            setNrRealizari(raspunsRealizari)
        }
    };

    const verificaSteam = async () => {
        if(user.SteamId !== null)
        {
            getVerSteam()

            var verVal
            var jocuriAvute = jocUserSteam.filter(joc => joc.appid === joc.SteamId)

            var JocNecompletat= nrRealizari.filter(realizare => realizare.achieved === 0)

            if(jocuriAvute.length > 0)
                verVal = 1
            else
                verVal = 0

            const raspunsUserSteam = await fetch(variables.API_URL + `verJocUserSteam?verVal=${verVal}`
            ).then((raspunsUserSteam) => raspunsUserSteam.json());
            console.log(raspunsUserSteam)

            if(jocuriAvute.length > 0)
            {
                if(nrOre <= ((jocuriAvute[0].playtime_windows_forever / 60) - 1) || nrOre <= ((jocuriAvute[0].playtime_windows_forever / 60) + 1))
                    verVal = 1
                else
                    verVal = 0
            }
            else
                verVal = 0

            const raspunsOreSteam = await fetch(variables.API_URL + `verNrOreSteam?verVal=${verVal}`
            ).then((raspunsOreSteam) => raspunsOreSteam.json());
            console.log(raspunsOreSteam)

            if(jocuriAvute.length > 0)
            {
                if(jocuriAvute[0].playtime_windows_forever > 0)
                    verVal = "Jucat"
                else
                    verVal = "Nejucat"
            }
            else
                verVal = "Nejucat"

            if(JocNecompletat.length <= 0)
                verVal = "Completat"

            const raspunsStareSteam = await fetch(variables.API_URL + `verStareSteam?verVal=${verVal}`
            ).then((raspunsStareSteam) => raspunsStareSteam.json());
            console.log(raspunsStareSteam)
        }
    };

    const submit = (e) => {
        e.preventDefault();  
        addColectie();
        updateGameScor();
        updateMedalieJocuri();
        verificaSteam()

        setRedirect(true)
    }

    if (redirect){
        return <Navigate to={`/joc/${joc.JocId}`}/>
    }
    
  return (
    <div>
        {user.UserId !== undefined &&
            <div>
                <h1 className='titlu'>{joc.Nume} - Recenzie noua</h1>
                <form onSubmit={submit}>
                    <label>Scor:</label>
                    <select value={scorValue} onChange={schimbaScor} disabled={stariValue === 'Nejucat'}>
                        {scor.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <label>Stare:</label>
                    <select value={stariValue} onChange={schimbaStari}>
                        {stari.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <label>Text recenzie:</label>
                    <input className='eroare-camp' type='textarea' name='recenzie' maxLength={255} required onChange={(e) => {setRecenzie(e.target.value)}}/>
                    <label>Numar de ore jucate:</label>
                    <input className='eroare-camp' type='number' pattern='[1-9][0-9]*' min={0} max={9999} placeholder='Numarul de ore jucate...' required onChange={(e) => {setNrOre(e.target.value)}}/>
                    <button className='buton' type='submit' disabled={stariValue === 'Nejucat'}>Termina recenzie</button>
                </form>
            </div>
        }

        {user.UserId === undefined &&
            <div>
                <h1 className='titlu tw-text-4xl tw-text-rosu_eroare'>Nu esti conectat!</h1>
            </div>
        }
    </div>
  )
}

export default RecenzieJoc