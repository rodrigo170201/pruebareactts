// pages/egresoForm.tsx
import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

const EgresoForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [monto, setMonto] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(`http://localhost:8000/banco/cuenta/${id}/retirar/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    monto: parseFloat(monto),
                    descripcion,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al realizar el retiro");
            }

            alert("Retiro exitoso");
            navigate(`/cuenta/${id}`);
        } catch (error) {
            console.error(error);
            alert("Error al procesar el retiro");
        }
    };

    return (
        <>
            <Menu />
            <Container>
                <Card title="Retirar Fondos">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Monto</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                required
                                className="w-full border px-3 py-2 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Descripción</label>
                            <input
                                type="text"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                                className="w-full border px-3 py-2 rounded-md"
                            />
                        </div>
                        <Button title="Retirar" />
                    </form>
                </Card>
            </Container>
        </>
    );
};

export default EgresoForm;
