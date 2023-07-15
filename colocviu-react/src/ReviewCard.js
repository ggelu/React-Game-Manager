import React from 'react'
import { Link } from 'react-router-dom'

function ReviewCard({review}) {
  return (
    <div className='container'>
        <h3>
            <Link to = {`/profil/${review.UserId}`}>
                User: {review.Nume}
            </Link>
        </h3>
        {review.VerJocSteam === 1 && 
          <span>Detinere joc verificata Steam</span>
        }
        <span>Scor: {review.Scor}</span>

        {review.VerStare === review.Stare && 
          <span>Stare verificata Steam</span>
        }
        <span>Stare: {review.Stare}</span>

        {review.VerNrOre === 1 && 
          <span>Numar de ore jucate verificate Steam</span>
        }
        <span>Numar de Ore: {review.NrOre}</span>
        <span>Recenzie: {review.Recenzie}</span>
    </div>
  )
}

export default ReviewCard