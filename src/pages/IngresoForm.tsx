import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Menu } from "../components/Menu";
import { useAuth } from "../hooks/useAuth";

const IngresoForm = () => {
    useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [monto, setMonto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(`http://localhost:8000/banco/cuenta/${id}/depositar/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    monto: parseFloat(monto),
                    descripcion
                })
            });

            if (!response.ok) {
                throw new Error("Error al realizar el depósito");
            }

            alert("Depósito realizado con éxito");
            navigate(`/cuenta/${id}`); // redirige a la página del detalle de cuenta
        } catch (error: any) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Menu />
            <Container>
                <Card title="Realizar Depósito">
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <div>
                            <label className="block font-medium">Monto:</label>
                            <input
                                type="number"
                                step="0.01"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                required
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Descripción:</label>
                            <input
                                type="text"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <Button type="submit" title={loading ? "Procesando..." : "Depositar"} />
                    </form>
                </Card>
            </Container>
        </>
    );
};

export default IngresoForm;
