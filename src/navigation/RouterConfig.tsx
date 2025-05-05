import { Routes, Route } from "react-router";
import { URLS } from "./CONTANTS";
import { LoginForm } from "../pages/LoginForm";
import { RegisterForm } from "../pages/RegisterForm";
import CuentasList from "../pages/CuentasList";
import CuentaDetail from "../pages/CuentaDetail";
import IngresoForm from "../pages/IngresoForm";
import HistorialList from "../pages/HistorialList";
import EgresoForm from "../pages/EgresoForm";
import TransferirForm from "../pages/TransferirForm";
import BeneficiarioList from "../pages/BeneficiarioList";
import BeneficiarioForm from "../pages/BeneficiarioForm";


const RouterConfig = () => {
    return (
        <Routes>
            <Route path={URLS.HOME} element={< LoginForm />} />
            <Route path={URLS.LOGIN} element={< LoginForm />} />
            <Route path={URLS.REGISTER} element={< RegisterForm />} />
            <Route path={URLS.CUENTA.LIST} element={<CuentasList/>}/>
            <Route path="/cuenta/:id" element={<CuentaDetail/>}/>
            <Route path="/cuenta/:id/depositar" element={<IngresoForm />} />
            <Route path="/cuenta/:id/retirar" element={<EgresoForm/>}/>
            <Route path="/cuenta/:id/transferir" element={<TransferirForm/>}/>
            <Route path={URLS.BENEFICIARIO.LIST} element={<BeneficiarioList/>}/>
            <Route path={URLS.BENEFICIARIO.CREATE} element={<BeneficiarioForm/>}/>
            <Route path="/beneficiarios/edit/:id" element={<BeneficiarioForm />} />
            <Route path={URLS.HISTORIAL} element={<HistorialList/>}/>
        </Routes>
    );
}
export default RouterConfig;