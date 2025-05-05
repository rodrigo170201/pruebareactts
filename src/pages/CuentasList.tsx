import { useEffect, useState } from "react";
import { useNavigate } from "react-router"; 
import { Card } from "../components/Card";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";

interface Cuenta {
  id: number;
  numero_cuenta: string;
  saldo: number; // Nuevo campo asumido
}

const CuentaList = () => {
  useAuth();
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mostrarSaldo, setMostrarSaldo] = useState<{ [id: number]: boolean }>({});
  const navigate = useNavigate();

  const getCuentas = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:8000/banco/cuenta/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("No autorizado. Token inválido o expirado.");
      }

      const data = await response.json();
      setCuentas(data);

      // Inicializar el estado del saldo oculto para cada cuenta
      const visibilidadInicial: { [id: number]: boolean } = {};
      data.forEach((cuenta: Cuenta) => {
        visibilidadInicial[cuenta.id] = false;
      });
      setMostrarSaldo(visibilidadInicial);
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    }
  };

  const deleteCuenta = async (id: number) => {
    const confirmation = window.confirm("¿Está seguro de que desea eliminar esta cuenta?");
    if (!confirmation) return;

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:8000/banco/cuenta/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la cuenta");
      }

      getCuentas();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleSaldo = (id: number) => {
    setMostrarSaldo((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    getCuentas();
  }, []);

  return (
    <>
      <Menu />
      <Container>
        <Card title="Mis Cuentas">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : cuentas.length === 0 ? (
            <p>No tienes cuentas registradas.</p>
          ) : (
            <ul className="space-y-2">
              {cuentas.map((cuenta) => (
                <li
                  key={cuenta.id}
                  className="p-3 border rounded-md shadow-sm flex justify-between items-center"
                >
                  <div
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => navigate(`/cuenta/${cuenta.id}`)}
                  >
                    <p>
                      <strong>N° Cuenta:</strong> {cuenta.numero_cuenta}
                    </p>
                    <p>
                      <strong>Saldo:</strong>{" "}
                      {mostrarSaldo[cuenta.id] ? `Bs ${cuenta.saldo}` : "****"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleSaldo(cuenta.id)}
                      className="text-gray-600 hover:text-black text-xl"
                      title="Mostrar/Ocultar Saldo"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => deleteCuenta(cuenta.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Container>
    </>
  );
};

export default CuentaList;
