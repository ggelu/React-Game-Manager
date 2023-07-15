import React from 'react'

function Medalie({medalie}) {
  return (
    <div className='container medalie'>
        <h3>{medalie.NumeMedalie} : {medalie.Valoare}</h3>
        <h4>Data obtinerii: {medalie.DataObtinere}</h4>
        <h5>Descriere Medalie: {medalie.DescriereMedalie}</h5>
    </div>
  )
}

export default Medalie