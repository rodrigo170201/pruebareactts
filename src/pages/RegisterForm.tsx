import React from 'react'
import { SubmitHandler, useForm } from "react-hook-form"
import { Input } from "../components/Input"
import { FormField } from "../components/FormField"
import { Card } from '../components/Card'
import { Button } from "../components/Button"
import { useNavigate } from "react-router"
import { URLS } from "../navigation/CONTANTS"
import { AuthService } from "../services/AuthService"
import { RegisterRequest } from "../models/dto/RegisterRequest"
import { Container } from "../components/Container"

type Inputs = {
    nombre_completo: string
    ci: string
    username: string
    password: string
}

export const RegisterForm: React.FC = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log("Register data:", data)
        const registerData: RegisterRequest = {
            nombre_completo: data.nombre_completo,
            ci: data.ci,
            username: data.username,
            password: data.password,
        }

        new AuthService()
            .register(
                registerData.nombre_completo,
                registerData.ci,                
                registerData.username,
                registerData.password,
            )
            .then((response) => {
                console.log("Register successful", response)
                navigate(URLS.LOGIN)
            })
            .catch((error) => {
                console.error("Register error:", error)
            })
    }

    return (
        <Container>
            <Card title="Registro" className="mx-5 my-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField>
                        <label htmlFor="nombre_completo">Nombre completo:</label>
                        <Input type="text" id="nombre_completo" {...register("nombre_completo", { required: true })} />
                        {errors.nombre_completo && <span>Este campo es requerido</span>}
                    </FormField>
                    <FormField>
                        <label htmlFor="ci">Cédula de Identidad (CI):</label>
                        <Input type="text" id="ci" {...register("ci", { required: true })} />
                        {errors.ci && <span>Este campo es requerido</span>}
                    </FormField>
                    <FormField>
                        <label htmlFor="username">Usuario:</label>
                        <Input type="text" id="username" {...register("username", { required: true })} />
                        {errors.username && <span>Este campo es requerido</span>}
                    </FormField>
                    <FormField>
                        <label htmlFor="password">Contraseña:</label>
                        <Input type="password" id="password" {...register("password", { required: true, minLength: 6 })} />
                        {errors.password && <span>La contraseña debe tener al menos 6 caracteres</span>}
                    </FormField>
                    <div className="flex justify-between items-center mt-4">
                        <Button type="submit" title="Registrar" />
                    </div>
                </form>
            </Card>
        </Container>
    )
}
