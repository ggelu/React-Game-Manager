import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { variables } from './Variables';
import Pagina404 from './Pagina404';
import CollectionCard from './CollectionCard';
import Medalie from './Medalie';
import PropTypes from 'prop-types'

function Profil({user}) {
  var UserId = window.location.pathname.substring(8);

  const [userData, setUserData] = useState(null);
  const [medalii, setMedalii] = useState([])
  const [colectie, setColectie] = useState([]);
  const [wishlist, setWishList] = useState([]);
  const [prieteni, setPrieteni] = useState([]);
  const [istoric, setIstoric] = useState([]);

  const [verificaPrieten, setVerificaPrieten] = useState(false)
  const [bifat, setBifat] = useState(false)
  const [steamUserData, setSteamUserData] = useState({})
  const [loading, setLoading] = useState(true);

  const [arataGen, setArataGen] = useState(false)
  const [arataCol, setArataCol] = useState(false)
  const [arataMed, setArataMed] = useState(false)
  const [arataWishList, setArataWishList] = useState(false)
  const [arataPrieteni, setArataPrieteni] = useState(false)
  const [arataIstoric, setArataIstoric] = useState(false)

  const [tema, setTema] = useState(localStorage.getItem('tema'));

  useEffect(() => {
    if (tema === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('tema', tema)
  }, [tema]);

  const schimbaTema = () => {
    setTema(tema === "dark" ? "light" : "dark");
    console.log(tema)
  };
  
  const schimbaBifa = () => {
    setBifat(!bifat)
  }

  const schimbaOptProfil = (buton) => {
    const butoane = document.querySelectorAll('.tab-profil')
    
    butoane.forEach( butonLista => {
      butonLista.classList.remove('tab-profil-activ')
    })

    buton.classList.add('tab-profil-activ')
  }

  const setUserPagina = async () => {
    const raspuns = await fetch(
      variables.API_URL + "user/getUser/" + UserId
    ).then((raspuns) => raspuns.json());
    setUserData(raspuns[0]);
  };

  const getVechime = async () => {
    const raspuns = await fetch(
      variables.API_URL + `medalie/getVechime?userId=${UserId}&dataCont=${userData.DataCont}` , {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
    }
    ).then((raspuns) => raspuns.json());
  };

  const setColectieMedalii = async () => {
    const raspuns = await fetch(
      variables.API_URL + `medalie/getMedaliiUser?userId=${UserId}`
    ).then((raspuns) => raspuns.json());
    setMedalii(raspuns[0]);
  };
  
  const setMedalieSteam = async (valoare) => {
    const raspuns = await fetch(variables.API_URL + `medalie/getConectatSteam?userId=${user.UserId}&valoareMedalie=${valoare}`,{
      method: 'PUT',
      headers: {'Content-Type': 'application/json'}
    }).then((raspuns) => raspuns.json());
  };

  const setSteamUser = async () => {
    const raspuns = await fetch(
      variables.API_URL + "steam/steamUserProfil?steamId=" + user.SteamId
    ).then((raspuns) => raspuns.json());
    
    setSteamUserData(raspuns.response.players[0]);
    setMedalieSteam("conectat")
  };
  
  const getUserColectie = async () => {
    const raspuns = await fetch(
      variables.API_URL + "getUserColectie/" + UserId
    ).then((raspuns) => raspuns.json());
    setColectie(raspuns);
  };

  const getWishlist = async () => {
    const raspuns = await fetch(
      variables.API_URL + "wishlist/getUserWishlist/" + UserId
    ).then((raspuns) => raspuns.json());
    setWishList(raspuns);
  };

  const getIstoric = async () => {
    const raspuns = await fetch(
      variables.API_URL + `istoric/getIstoric?userId=${UserId}`
    ).then((raspuns) => raspuns.json());
    setIstoric(raspuns);
  };

  const getPrieteni = async () => {
    if(user !== null && user !== undefined){
      const raspuns = await fetch(
        variables.API_URL + `prieteni/getPrieteni?userId=${UserId}`
      ).then((raspuns) => raspuns.json());
      setPrieteni(raspuns);
    }
  };

  const verPrieten = async () => {
    if(user !== null)
    {
      const raspuns = await fetch(
        variables.API_URL + `prieteni/verificaPrieten?userId=${user.UserId}&prietenId=${UserId}`
      ).then((raspuns) => raspuns.json());
      
      if(raspuns[0] !== undefined)
        setVerificaPrieten(true)
    }
  };

  const adaugaPrieten = async () => {
    if(user !== null)
    {
      const raspuns = await fetch(variables.API_URL + `prieteni/adaugaPrieten?userId=${user.UserId}&prietenId=${UserId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }).then((raspuns) => raspuns.json());
      console.log(raspuns)
    }
    updateMedaliePrieteni()
    variables.addIstoric(user.UserId, "Adaugat prieten")
    verPrieten()
  };

  const stergePrieten = async (userId, prietenId) => {
    const raspuns = await fetch(variables.API_URL + `prieteni/stergePrieten?userId=${userId}&prietenId=${prietenId}` , {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    }).then((raspuns) => raspuns.json());
    updateMedaliePrieteni()
    window.location.reload()
  };

  const updateMedaliePrieteni = async () => {
    const raspuns = await fetch(variables.API_URL + `medalie/getNrPrieteni?userId=${user.UserId}`,{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
    }).then((raspuns) => raspuns.json());
    console.log(raspuns)
};

  const stergeProfil = async () => {
    variables.stergeInfoUser(UserId)

    const raspuns = await fetch(variables.API_URL + `user/deleteProfil?id=${UserId}` , {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    }).then((raspuns) => raspuns.json());
    console.log(raspuns)
  };

  const steamLogin = () => {
    window.location.replace("http://localhost:5000/auth/steam")
  };

  const gogLogin = () => {
    //window.location.replace("http://localhost:5000/auth/gog")
    var gogWindow = "http://auth.gog.com/auth?client_id=46899977096215655&redirect_uri=https%3A%2F%2Fembed.gog.com%2Fon_login_success%3Forigin%3Dclient&raspuns_type=code&layout=client2"
    
    /*
    let iframe = document.createElement("iframe")
    iframe.src = gogWindow
    iframe.height = "50%"
    iframe.width = "50%"
    document.body.prepend(iframe)
    document.body.style.overflow = "hidden"
    setInterval(() => {
      console.log(gogWindow.history);
    }, 1500);
    */
  };

  const getSteamUser = async () => {
    await fetch("http://localhost:5000/auth/steam/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application-json",
        "Content-Type": "application-json",
        "Access-Control-Allow-Credentials": true
      },
    })
    .then((raspuns) => {
      if(raspuns.status === 200) 
        return raspuns.json();
      throw new Error("Conectarea la steam nu a mers");
    })
    .then((resObject) => {
      setSteamId(resObject.user.id);
    })
    .catch((err) => {
      console.log(err);
    })
  };

  const setSteamId = async (steamId) => {
    const raspuns = await fetch(variables.API_URL + `user/setSteamId?userId=${user.UserId}&steamId=${steamId}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json-patch+json"}
    })
    .then((raspuns) => raspuns.json());
  };

  const deconecteazaSteam = async () => {
    const raspuns = await fetch(variables.API_URL + `user/deconecteazaSteam?userId=${UserId}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json-patch+json"}
    })
    .then((raspuns) => raspuns.json());

    setSteamUserData({})
    setMedalieSteam("0")

    await fetch("http://localhost:5000/auth/steam/logout", {
      method: "GET",
      credentials: "include"
    })
  };

  useEffect(() => {
    setUserPagina();
    getUserColectie();
    getWishlist();
    
    if(user !== null && user !== undefined)
    {
      if(user.SteamId === null)
        getSteamUser();
      else if (user.SteamId !== null && user.UserId.toString() === UserId)
        setSteamUser()
    }

    if(userData !== null && userData !== undefined)
    {
      getVechime()
      getIstoric()
      verPrieten()
      getPrieteni()

      setColectieMedalii()
    }
    
    setTimeout(() => {
      setLoading(false)
    }, 1200)
  }, [userData? userData.UserId : null, userData? userData.SteamId : null, user ? user.UserId : null, verificaPrieten, medalii.length, verificaPrieten, steamUserData ? steamUserData.personaname : null]);

  
  if(loading){
    return <h2 className='titlu'>Se incarca...</h2> 
  }

  return (
    <div className='tw-ml-1'>
      {userData !== null && userData !== undefined &&
        <div>
          <h1 className='titlu'>Nume: {userData.NumeDisplay}</h1>
          <img className='tw-mt-1 tw-w-[100px]' src={`../images/Users/${userData.PozaUser}`} alt='poza-profil'/>
          
          {(user !== null && user !== undefined) &&
            <div>
              {userData.UserId === user.UserId && 
                <div>
                  <button className="buton tw-mt-4 tw-mb-5 mediu:tw-ml-5 tw-ml-2" onClick={() => schimbaTema()}>
                    {tema !== "dark" ? "Mod intunecat" : "Mod deschis"}
                  </button>

                  <ul className="tw-flex mediu:tw-flex-row tw-flex-col mediu:tw-items-end tw-items-center tw-border-b dark:tw-border-aquamarin tw-border-albastru_fundal tw-gap-2 mare:tw-gap-0">
                    <li className="mediu:tw-mr-1 mediu:tw-ml-5">
                      <button className={"tab-profil"} onClick={(e) => {
                        schimbaOptProfil(e.target)
                        setArataCol(false)
                        setArataGen(true)
                        setArataMed(false)
                        setArataWishList(false)
                        setArataPrieteni(false)
                        setArataIstoric(false)
                        }}>Date generale</button>
                    </li>
                    <li className="mediu:tw-mr-1">
                      <button className="tab-profil" onClick={(e) => {
                        schimbaOptProfil(e.target)
                        setArataCol(true)
                        setArataGen(false)
                        setArataMed(false)
                        setArataWishList(false)
                        setArataPrieteni(false)
                        setArataIstoric(false)
                        }}>Colectie</button>
                    </li>
                    <li className="mediu:tw-mr-1">
                      <button className="tab-profil" onClick={(e) => {
                        schimbaOptProfil(e.target)
                        setArataCol(false)
                        setArataGen(false)
                        setArataMed(true)
                        setArataWishList(false)
                        setArataPrieteni(false)
                        setArataIstoric(false)
                        }}>Medalii</button>
                    </li>
                    <li className="mediu:tw-mr-1">
                      <button className="tab-profil" onClick={(e) => {
                        schimbaOptProfil(e.target)
                        setArataCol(false)
                        setArataGen(false)
                        setArataMed(false)
                        setArataWishList(false)
                        setArataPrieteni(true)
                        setArataIstoric(false)
                        }}>Lista de prieteni</button>
                    </li>
                    <li className="mediu:tw-mr-1">
                      <button className="tab-profil" onClick={(e) => {
                        schimbaOptProfil(e.target)
                        setArataCol(false)
                        setArataGen(false)
                        setArataMed(false)
                        setArataWishList(true)
                        setArataPrieteni(false)
                        setArataIstoric(false)
                        }}>Wishlist</button>
                    </li>
                    <li className="mediu:tw-mr-1">
                      <button className="tab-profil" onClick={(e) => {
                        schimbaOptProfil(e.target)
                        setArataCol(false)
                        setArataGen(false)
                        setArataMed(false)
                        setArataWishList(false)
                        setArataPrieteni(false)
                        setArataIstoric(true)
                        }}>Istoric</button>
                    </li>
                  </ul>

                  {medalii !== undefined && medalii !== null && arataMed &&
                    <div className='tw-grid tw-col-1 tw-justify-center'>
                      {medalii.map(medalie => (
                        <Medalie key={medalie.ColectieMedaliiId} medalie={medalie}/>
                      ))}
                    </div>
                  }

                  {arataGen &&
                    <div>
                      <p>Email: {userData.Email}</p>
                      <p>Data deschiderii contului: {userData.DataCont}</p>

                      <Link to={`/profil/${UserId}/editProfil`}>
                        <button className='buton'>Edit Profil</button>
                      </Link>
                      
                      <button className='buton tw-ml-1 tw-mr-1' onClick={() => stergeProfil()} disabled={!bifat}>Sterge Profil</button>
                      <div className='mic:tw-block mediu:tw-inline-block tw-mb-3'>
                        <label>Esti sigur ca vrei sa-ti stergi contul?</label>
                        <input className='checkbox tw-align-middle tw-ml-1' type='checkbox' checked={bifat} onChange={schimbaBifa}/>
                      </div>

                      

                      {user.SteamId && steamUserData ?
                        <div>
                          <h3 className='tw-text-xl'>Conectat la Steam</h3>
                          <div className='tw-flex tw-flex-row tw-gap-2 tw-items-center'>
                            <p>Numele contului: {steamUserData.personaname}</p>
                            <a href={steamUserData.profileurl}>
                              <img src={steamUserData.avatar} alt='avatar-steam'></img>
                            </a>
                            <button className='buton' onClick={() => deconecteazaSteam()}>Deconecteaza Steam</button>
                          </div>
                          </div>
                        :
                        <button onClick={() => steamLogin()}>
                          <img className='tw-border-0 tw-inline-block' src="..\images\SteamLoginButton.png" border="0" alt='buton-steam'/>
                        </button>
                      }
                    </div>
                  }

                  {arataCol &&
                    <div className='tw-grid tw-col-1 tw-justify-center'>
                      {colectie.map(collectionEntry => (
                        <CollectionCard key={collectionEntry.CollectionId} collectionEntry={collectionEntry}/>
                      ))}
                    </div>
                  }

                  {arataWishList &&
                    <div className='tw-grid tw-col-1 tw-justify-center'>
                      {wishlist.map(wishlistEntry => (
                        <div className='container'>
                          <h3>
                              <Link to = {`/joc/${wishlistEntry.JocId}`}>
                                  Joc: {wishlistEntry.Nume}
                              </Link>
                          </h3>
                          <span>Scor: {wishlistEntry.Scor}</span>
                          <button className='buton' onClick={() => variables.stergeWishlistEntry(UserId, wishlistEntry.GameId)}>Sterge din wishlist</button>
                        </div>
                      ))}
                    </div>
                  }

                  {arataIstoric &&
                    <div className='tw-grid tw-col-1 tw-justify-center'>
                      {istoric.map(istoricEntry => (
                        <div className='container'>
                          <h3>Descriere actiune: {istoricEntry.Descriere}</h3>
                          <span>Data: {istoricEntry.DataActiune}</span>
                        </div>
                      ))}
                    </div>
                  }

                  {arataPrieteni &&
                    <div className='tw-grid tw-col-1 tw-justify-center'>
                      {prieteni.map(prieten => (
                        <div>
                          {prieten.NumeDisplay !== userData.NumeDisplay &&
                            <div className='container'>
                              <h3>
                                {userData.UserId === prieten.UserId?
                                  <a  href={`http://localhost:3000/profil/${prieten.PrietenId}`}>
                                    Nume: {prieten.NumeDisplay}
                                  </a>
                                  :
                                  <a  href={`http://localhost:3000/profil/${prieten.PrietenId}`}>
                                    Nume: {prieten.NumeDisplay}
                                  </a>
                                }   
                              </h3>

                              <button className='buton' onClick={() => stergePrieten(prieten.UserId, prieten.PrietenId)}>Sterge prieten</button>
                            </div>
                          }
                        </div>
                      ))}
                    </div>
                  }
                </div>
              }

              {(user.UserId.toString() !== UserId && !verificaPrieten) ? 
                <button className='buton tw-mt-2' onClick={() => adaugaPrieten()}>Adauga prieten</button> 
                : null
              }
            </div>
          }
        </div>
      } 

      {(userData === null || userData === undefined) &&
          <Pagina404/>
      } 
    </div>
  )
}

Profil.propTypes = {
  user: PropTypes.object.isRequired
}
export default Profil