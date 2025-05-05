import { SubmitHandler, useForm } from "react-hook-form"
import { Input } from "../components/Input"
import { FormField } from "../components/FormField"
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONTANTS";
import { LoginRequest } from "../models/dto/LoginRequest";
import { AuthService } from "../services/AuthService";
import { useAppDispatch } from "../redux/hooks";
import { loginUser } from "../redux/slices/authSlice";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";

type Inputs = {
    username: string
    password: string
}

export const LoginForm = () => {
    const navigate = useNavigate()
    const { doLogin } = useAuth()
    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(`Iniciando sesión para el usuario: ${data.username}`)
        const login: LoginRequest = {
            username: data.username,
            password: data.password,
        }

        new AuthService()
            .login(login.username, login.password)
            .then((response) => {
                console.log("Login successful", response)
                doLogin({
                    access_token: response.access,
                    refresh_token: response.refresh,
                    username: login.username
                })
                dispatch(loginUser(login.username))//guarda en redux
                navigate(URLS.CUENTA.LIST)
            })
            .catch((error) => {
                console.error("Login error:", error)
            })
    }

    return (
        <Container>
            <Card title="Iniciar sesión" className="mx-5 my-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField>
                        <label htmlFor="username">Usuario:</label>
                        <Input type="text" id="username" {...register("username", { required: true })} />
                        {errors.username && <span>Este campo es requerido</span>}
                    </FormField>
                    <FormField>
                        <label htmlFor="password">Contraseña:</label>
                        <Input type="password" id="password" {...register("password", { required: true })} />
                        {errors.password && <span>Este campo es requerido</span>}
                    </FormField>
                    <div className="flex justify-between items-center mt-4">
                        <Button type="submit" title="Iniciar sesión" />
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Regístrate
                        </Link>
                    </div>
                </form>
            </Card>
        </Container>
    )
}
