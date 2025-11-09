import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { E_SHOP_TOKEN, JWT_TOKEN, LOG_IN, USER } from "./authPaths"
import Cookies from 'js-cookie'
import { Axios } from "./Axios"

// 
export const userAuth = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  // token 
  // 
  
  const checkAuth = useCallback(async () => {
    if (!JWT_TOKEN) {
      setError('You have no credentials');
      return;
    }
    try {
      setLoading(true);
      const res = await Axios.get(USER);
      setUser(res.data);

    } catch (error) {
      setError(error.response?.data?.message || error.message);
      // Cookies.remove(E_SHOP_TOKEN);
    } finally {
      setLoading(false);
    }
  }, [JWT_TOKEN]); // Only recreate when token changes

  // login function 
  const logIn = async (credentials) => {
    setLoading(true)
    try {
      const { data } = await Axios.post(`/${LOG_IN}`, { credentials })
      setUser(data.data)
      navigate('/')
    } catch (error) {
      setError(error.response?.data?.message || `Login Failed !`)
    }
  }
  // 
  const logOut = async () => {
    try {
      setLoading(true)
      Cookies.remove(E_SHOP_TOKEN)
      setUser(null)
      setError('')
      navigate('/')
    }
    catch (error) {
      setError(error.message)
      console.log(error.message)
    }
    finally {
      setLoading(false)
    }
  }
  return { user, loading, error, logIn, logOut, checkAuth }

}


