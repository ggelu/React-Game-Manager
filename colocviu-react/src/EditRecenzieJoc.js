import React, { useEffect, useState } from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom';
import { variables } from './Variables';

function EditRecenzieJoc({user}) {
    const { state } = useLocation()
    const joc = state.joc
    const dateRecenzie = state.dateRecenzie[0]

    const [nrOre, setNrOre] = useState()
    const [recenzie, setRecenzie] = useState('')

    const [jocUserSteam, setJocUserSteam] = useState([])
    const [nrRealizari, setNrRealizari] = useState([])
    const [redirect ,setRedirect] = useState(false)

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

    const schimbaStare = (event) => {
        setStariValue(event.target.value);
    };
    
    const editColectie = async () => {
        const raspuns = await fetch(variables.API_URL + "editColectie", {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "colectieId": dateRecenzie.ColectieId,
                "userId": user.UserId,
                "jocId": joc.JocId,
                "scor": scorValue,
                "stare": stariValue,
                "nrOre" : nrOre,
                "recenzie": recenzie
              })
        }).then((raspuns) => raspuns.json());
        console.log(raspuns)
        variables.addIstoric(user.UserId, "Modificat recenzie")
        variables.stergeWishlistEntry(user.UserId, joc.JocId)
    }

    const updateScorJoc = async () => {
        const raspuns = await fetch(variables.API_URL + `joc/updatescor/${joc.JocId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        }).then((raspuns) => raspuns.json());
        console.log(raspuns)
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

        editColectie();
        updateScorJoc();
        verificaSteam()

        setRedirect(true)
    }

    if (redirect){
        return <Navigate to={`/joc/${joc.JocId}`}/>
    }

  return (
    <div>
        {user !== undefined &&     
            <div>
                {dateRecenzie !== undefined &&  
                    <div className='tw-border-b dark:tw-border-verde_d tw-border-albastru_i'>
                        <h1 className='titlu'>Date actuale recenzie</h1>
                        <p>Scor: {dateRecenzie.Scor}</p>
                        <p>Stare: {dateRecenzie.Stare}</p>
                        <p>Numar de ore jucate: {dateRecenzie.NrOre}</p>
                        <p>Text recenzie: {dateRecenzie.Recenzie}</p>
                        <br/>
                    </div>
                }

                {joc? <h2 className='titlu tw-mt-7 tw-mb-5'>{joc.Nume} - Modificare Recenzie</h2> : ''}
                <form onSubmit={submit}>
                    <label>Scor:</label>
                    <select value={scorValue} onChange={schimbaScor} disabled={stariValue === 'Nejucat'}>
                        {scor.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <label>Stare:</label>
                    <select value={stariValue} onChange={schimbaStare}>
                        {stari.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <label>Text recenzie:</label>
                    <input className='eroare-camp' type='textarea' name='recenzie' maxLength={255} required onChange={(e) => {setRecenzie(e.target.value)}}/>
                    <label>Numar de ore jucate:</label>
                    <input className='eroare-camp' type='number' pattern='[1-9][0-9]*' min={0} max={9999} placeholder='Numarul de ore jucate...' required onChange={(e) => {setNrOre(e.target.value)}}/>
                    <button className='buton' type='submit' disabled={stariValue === 'Nejucat'}>Termina editare recenzie</button>
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

export default EditRecenzieJoc