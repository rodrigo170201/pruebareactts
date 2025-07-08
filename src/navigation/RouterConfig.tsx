import { Routes, Route } from "react-router"; // <- NOT 'react-router'
import { ConsultaForm } from "../pages/ConsultaForm";
import PadronList from "../pages/PadronList";
import { EmpadronarForm } from "../pages/EmpadronarForm";

export const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/consulta" element={<ConsultaForm />} />
      <Route path="/padron/lista" element={<PadronList />} />
      <Route path="/padron/crear" element={<EmpadronarForm />} />
    </Routes>
  );
};
