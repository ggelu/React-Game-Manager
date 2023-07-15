import React from 'react'
import { Link } from 'react-router-dom'
import { variables } from './Variables';

function CollectionCard({collectionEntry}) {

  const stergeReview = async (ID) => {
    const response = await fetch(variables.API_URL + `deleteColectie?colectieId=${ID}`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json-patch+json"}
    })
    .then((response) => response.json());
    window.location.reload()
  };

  return (
    <div>
      {collectionEntry !== undefined &&
        <div className='container'>
          <h3>
              <Link to = {`/joc/${collectionEntry.JocId}`}>
                  Joc: {collectionEntry.Nume}
              </Link>
          </h3>
          {collectionEntry.VerJocSteam === 1 && 
            <span>Detinere joc verificata Steam</span>
          }
          
          <span>Scor: {collectionEntry.Scor}</span>

          {collectionEntry.VerStare === collectionEntry.Stare && 
            <span>Stare verificata Steam</span>
          }
          <span>Stare: {collectionEntry.Stare}</span>

          {collectionEntry.VerNrOre === 1 && 
            <span>Numar de ore jucate verificate Steam</span>
          }
          <span>Numar de Ore: {collectionEntry.NrOre}</span>

          <button className='buton mediu:tw-inline-block' onClick={() => stergeReview(collectionEntry.ColectieId)}>Sterge din colectie</button>
        </div>
      }
    </div>
  )
}

export default CollectionCard