export const URLS = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER:'/register',
    CUENTA:{
        LIST:'/cuentas',
        DETAIL:(id:number | string) => '/cuenta/${id}',
        DEPOSITAR:(id: number | string) =>'/cuenta/${id}/depositar',
        RETIRAR:(id: number | string) => '/cuenta/${id}/retirar',
        TRANSFERIR:(id: number | string) => '/cuenta/${id}/transferir'
    },
    BENEFICIARIO:{
        LIST:'/beneficiarios',
        CREATE:'/beneficiarios/create',
        EDIT: (id: number | string) => `/beneficiarios/edit/${id}`
    },
    HISTORIAL:'/movimientos'
}