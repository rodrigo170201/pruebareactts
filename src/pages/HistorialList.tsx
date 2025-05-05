import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { Menu } from "../components/Menu";

interface Movimiento {
    id: number;
    cuenta: number;
    numero_cuenta: string; // ✅ nuevo campo
    tipo: string;
    monto: number;
    descripcion: string;
    fecha: string;
}

const HistorialList = () => {
    useAuth();
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState<string | "">("");

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchMovimientos = async () => {
            try {
                const response = await fetch("http://localhost:8000/banco/movimiento/", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setMovimientos(data);
            } catch (error) {
                console.error("Error al obtener los movimientos:", error);
            }
        };

        fetchMovimientos();
    }, []);

    // ✅ Obtener lista única de número_cuenta
    const cuentasUnicas = Array.from(new Set(movimientos.map((m) => m.numero_cuenta)));

    // ✅ Filtrar movimientos por número_cuenta seleccionada
    const movimientosFiltrados = cuentaSeleccionada === ""
        ? movimientos
        : movimientos.filter((m) => m.numero_cuenta === cuentaSeleccionada);

    return (
        <>
            <Menu />
            <Container>
                <Card title="Historial de Movimientos">
                    <div className="mb-4">
                        <label htmlFor="cuenta-select" className="block text-sm font-medium text-gray-700">
                            Filtrar por número de cuenta:
                        </label>
                        <select
                            id="cuenta-select"
                            value={cuentaSeleccionada}
                            onChange={(e) => setCuentaSeleccionada(e.target.value)}
                            className="mt-1 block w-full max-w-xs border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Todas las cuentas</option>
                            {cuentasUnicas.map((numeroCuenta) => (
                                <option key={numeroCuenta} value={numeroCuenta}>
                                    Cuenta {numeroCuenta}
                                </option>
                            ))}
                        </select>
                    </div>

                    <table className="w-full border mt-4 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">Número de Cuenta</th> {/* ✅ Cambiado */}
                                <th className="border px-2 py-1">Tipo</th>
                                <th className="border px-2 py-1">Monto</th>
                                <th className="border px-2 py-1">Descripción</th>
                                <th className="border px-2 py-1">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientosFiltrados.map((m) => (
                                <tr key={m.id}>
                                    <td className="border px-2 py-1">{m.numero_cuenta}</td> {/* ✅ Cambiado */}
                                    <td className="border px-2 py-1 capitalize">{m.tipo}</td>
                                    <td className="border px-2 py-1">Bs. {m.monto}</td>
                                    <td className="border px-2 py-1">{m.descripcion}</td>
                                    <td className="border px-2 py-1">{new Date(m.fecha).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </Container>
        </>
    );
};

export default HistorialList;
