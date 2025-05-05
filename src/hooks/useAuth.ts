import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { loginUser, logoutUser } from "../redux/slices/authSlice"
import { AuthService } from "../services/AuthService"

type LoginParams = {
    access_token: string,
    refresh_token: string,
    username: string,
}

export const useAuth = () => {
    const dispatch = useAppDispatch()
    const username = useAppSelector((state) => state.auth.username)

    const doLogin = (params: LoginParams) => {
        dispatch(loginUser(params.username))
        localStorage.setItem("access_token", params.access_token)
        localStorage.setItem("refresh_token", params.refresh_token)
    }

    const doLogout = () => {
        dispatch(logoutUser())
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
    }

    useEffect(() => {
        const access = localStorage.getItem("access_token")
        const refresh = localStorage.getItem("refresh_token")
        if (access && refresh) {
            new AuthService()
                .me()
                .then((response) => {
                    //console.log("User data", response)
                    if (response.username) {
                        dispatch(loginUser(response.username))
                    }
                })
                .catch((error) => {
                    console.error("No se pudo validar el usuario:", error.message)
                })
        }
    }, [dispatch])

    return { username, doLogin, doLogout }
}
