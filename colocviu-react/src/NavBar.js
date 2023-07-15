import  React from 'react'
import { variables } from './Variables'
import { NavLink } from 'react-router-dom'
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types'

const NavBar = ({user, setToken}) => {
    const logout = async () => {
        await fetch(variables.API_URL + "logout", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials : 'include'
        });

        sessionStorage.clear()
        setToken(null)
    }

    return (
        <section>
            <div>
                <nav className='nav'>
                    <h2 className='nav-nume'>
                        Game Manager
                    </h2>
                    <ul className='nav-opt'>
                        <li className=''>
                            <NavLink className='tw-inline-block' to='/'>
                                Home
                            </NavLink>
                        </li>
                        <li className=''>
                            <NavLink className='tw-inline-block' to={`/profil/${user.UserId}`}>
                                Profil
                            </NavLink>
                        </li>
                        <li className=''>
                            <NavLink className='tw-inline-block' to='/istoric'>
                                Istoric
                            </NavLink>
                        </li>
                        <li className='mediu:tw-mr-1'>
                            <NavLink className='tw-inline-block' to='/login' onClick={logout}>
                                Logout
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>
    )
}

NavBar.propTypes = {
    user: PropTypes.object.isRequired,
    setToken: PropTypes.func.isRequired
}

export default NavBar