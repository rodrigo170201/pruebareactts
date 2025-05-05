import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

// Define un tipo para el estado del slice
interface AuthState {
    username: string | null
}

// Estado inicial
const initialState: AuthState = {
    username: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        },
        logoutUser: state => {
            state.username = null
        }
    }
})

// Exporta las acciones
export const { loginUser, logoutUser } = authSlice.actions

// Selector opcional si usas useSelector para acceder al username
//export const selectUsername = (state: RootState) => state.auth.username

// Exporta el reducer
export default authSlice.reducer
