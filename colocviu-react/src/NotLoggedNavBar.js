import  React from 'react'
import { NavLink } from 'react-router-dom'

const NotLoggedNavBar = () => {
  return (
    <section>
        <div>
            <nav className='nav'>
                <h2 className='nav-nume'>
                    Game Manager
                </h2>
                <ul className='nav-opt'>
                    <li>
                        <NavLink className='tw-inline-block' to='/'>
                            Home
                        </NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink className='tw-inline-block' to='/login'>
                            Login
                        </NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink className='tw-inline-block mediu:tw-mr-1' to='/register'>
                            Register
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    </section>
  )
}

export default NotLoggedNavBar