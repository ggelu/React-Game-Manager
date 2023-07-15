import { createContext, useContext, useEffect, useState } from "react";
import { variables } from './Variables';

const AuthContext = createContext({
    auth: null,
    setAuth: () => {},
    user: null
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const isAuth = async () => {
            try{
            const response = await fetch(variables.API_URL + "userAuth", {
              headers: {'Content-Type': 'application/json'},
              credentials : 'include'
            });
    
            const content = await response.json();
            setUser(content[0])
            
          }catch(error){
            setUser(null);
          }
        }
        //console.log(auth);
        isAuth();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

