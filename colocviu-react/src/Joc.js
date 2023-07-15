import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { variables } from './Variables';
import Pagina404 from './Pagina404'
import ReviewCard from './ReviewCard';

function Joc({user}) {
    var JocId = window.location.pathname.substring(5);
    const [varJoc, setVarJoc] = useState({});
    const [recenzii, setRecenzii] = useState([]);
    const [stareColectie, setStareColectie] = useState();
    const [stareWishlist, setStareWishlist] = useState(null);

    const [steamInfo, setSteamInfo] = useState();
    const [gogInfo, setGogInfo] = useState();
    const [loading, setLoading] = useState(true);

    const setPaginaJoc = async () => {
      const raspuns = await fetch(
        variables.API_URL + "joc/" + JocId
      ).then((raspuns) => raspuns.json())
      
      setVarJoc(raspuns[0]);
    };

    const setJocSteam = async () => {
      const raspuns = await fetch(
        variables.API_URL + `steam/getSteamJocStore?appId=${varJoc.SteamId}`
      ).then((raspuns) => raspuns.json())
  
      setSteamInfo(raspuns);
    };

    const setJocGog = async () => {
      const raspuns = await fetch(
        variables.API_URL + `gog/getGogJocStore?jocName=${varJoc.Nume}&jocId=${varJoc.GogId}`
      ).then((raspuns) => raspuns.json())
  console.log(varJoc)
      setGogInfo(raspuns);
    };

    const setjocReviewCards = async () => {
      const raspuns = await fetch(
        variables.API_URL + "joc/getReviewsJoc/" + JocId
      ).then((raspuns) => raspuns.json());
  
      setRecenzii(raspuns);
    };

    const updateScorJoc = async () => {
      const raspuns = await fetch(variables.API_URL + `joc/updatescor/${JocId}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'}
      }).then((raspuns) => raspuns.json());
      console.log(raspuns)
    };

    const adaugaWishlistEntry = async () => {
      const raspuns = await fetch(variables.API_URL + `wishlist/adaugaWishlistEntry?userId=${user.UserId}&jocId=${JocId}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'}
      }).then((raspuns) => raspuns.json());

      variables.addIstoric(user.UserId, "Adaugat joc la wishlist")
      verWishlist()
    }

    const verColectie = async () => {
      if(user !== null && user !== undefined)
      {
        const raspuns = await fetch(
          variables.API_URL + "checkColectie/" + user.UserId + ',' + JocId 
        ).then((raspuns) => raspuns.json());
  
        setStareColectie(raspuns);
      }
    };

    const verWishlist = async () => {
      if(user !== null && user !== undefined)
      {
        const raspuns = await fetch(
          variables.API_URL + "wishlist/checkWishlist/" + user.UserId + ',' + JocId 
        ).then((raspuns) => raspuns.json());
        setStareWishlist(raspuns);
      }
    };

    useEffect(() => {
        setPaginaJoc();
        
        if(varJoc !== undefined)
        {
          if(varJoc.SteamId !== undefined && varJoc.SteamId !== null)
            setJocSteam()

          if(varJoc.GogId !== undefined && varJoc.GogId !== null)
            setJocGog()
        }

        updateScorJoc();
        setjocReviewCards();
        
        verColectie();
        verWishlist();

        setTimeout(() => {
          setLoading(false)
        }, 2000)
    }, [varJoc ? varJoc.SteamId : null, varJoc ? varJoc.GogId : null, user ? user.UserId : null], stareWishlist);

    if(loading){
      return <h2 className='titlu'>Se incarca...</h2> 
    }

    return (
        <div>
          <h1></h1> 
            {varJoc !== undefined &&
                <div className='tw-grid tw-col-1 tw-justify-center tw-text-center'>
                    <h2 className='titlu'>{varJoc.Nume}</h2>
                    <h2>Scor: {varJoc.Scor}</h2>
                    <p>{recenzii.length > 19 ? `Din ${recenzii.length} de recenzii` : `Din ${recenzii.length} recenzii`}</p>

                    {steamInfo !== undefined && 
                      <div className='steam-info'>
                        <div className='tw-flex mediu:tw-flex-row mediu:tw-w-[1100px] mediu:tw-gap-2 mediu:tw-items-center tw-flex-col tw-mb-2 tw-mt-2'>
                          <img src={steamInfo.header_image} alt='poza-steam'></img>
                          <p className='mediu:tw-mt-0 tw-mt-1'>Descriere: {steamInfo.short_description}</p>
                        </div>

                        <h2 className='titlu'>Informatii Steam</h2>
                        <div className='tw-flex mediu:tw-flex-row mediu:tw-gap-2 tw-items-center mediu:tw-justify-center tw-flex-col tw-mb-2 tw-mt-2'>
                        <p>Developeri: {steamInfo.developers}</p>
                        <p>Platforme: {steamInfo.platforms.windows ? "Windows " : ""}{steamInfo.platforms.linux ? "Linux " : ""}{steamInfo.platforms.windows ? "Mac " : ""}</p>
                          {steamInfo.is_free ? 
                            <p>Joc Gratis</p> : 
                            <p>Pret Steam: {steamInfo.price_overview.final_formatted}</p>
                          }

                          {steamInfo.recommendations ? 
                            <p>Recenzii pozitive pe Steam: {steamInfo.recommendations.total}</p> : ''
                          }
                          
                          {steamInfo.metacritic ? 
                            <p>Scor Metacritic: {steamInfo.metacritic.score}</p> : ''
                          }
                            
                          <a className='buton !tw-bg-negru !tw-text-alb hover:!tw-bg-albastru_i' href={`https://store.steampowered.com/app/${varJoc.SteamId}/?l=romanian`}>
                            Vezi pe Steam
                          </a>
                        </div>
                      </div>
                    }

                    {gogInfo !== undefined && 
                      <div>
                        <h2 className='titlu'>Informatii GOG</h2>
                        <div className='tw-flex mediu:tw-flex-row mediu:tw-gap-2 tw-items-center mediu:tw-justify-center tw-flex-col tw-mb-2 tw-mt-2'>
                          {gogInfo.price ? 
                            <p>Pret Gog: {gogInfo.price.finalAmount}{gogInfo.price.symbol}</p> : 
                            <p>Joc Gratis</p>
                          }

                          {gogInfo.rating ? 
                            <p>Scor Gog: {gogInfo.rating}/50</p> : ''
                          }
                            
                          <a className='buton !tw-bg-violet_d !tw-text-alb hover:!tw-bg-violet_i' href={`https://www.gog.com/en/game/${gogInfo.slug}`}>
                            Vezi pe Gog
                          </a>
                        </div>
                      </div>
                    }

                    <br/>
                    {(user !== null && user !== undefined) &&
                      <div>
                        {stareColectie ? 
                          <Link to={`/joc/${JocId}/editRecenzie`} state= {{joc: varJoc, dateRecenzie: stareColectie}}>
                            <button className='buton'>Modifica recenzie</button>
                          </Link> :
                          <div className='tw-flex mediu:tw-flex-row tw-flex-col tw-gap-1 tw-items-center tw-justify-center'>
                            <Link to={`/joc/${JocId}/recenzie`} state= {{joc: varJoc}}>
                              <button className='buton'>Recenzie noua</button>
                            </Link>

                            {stareWishlist ? null : 
                              <button className='buton' onClick={() => adaugaWishlistEntry()}>Adauga la wishlist</button>
                            }
                          </div>
                        }
                      </div>
                    }
                    

                    <div className='tw-grid tw-col-1 tw-justify-center tw-mt-2'>
                      {recenzii.map(review => (
                        <ReviewCard key={review.CollectionId} review={review}/>
                      ))}
                    </div>
                </div>
            } 
            {varJoc === undefined &&
                <Pagina404/>
            } 
        </div>
    )
}

export default Joc