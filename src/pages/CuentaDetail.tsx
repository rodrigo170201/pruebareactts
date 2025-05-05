import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button"; // Asegúrate de tener este componente

interface Cuenta {
    id: number;
    numero_cuenta: string;
    saldo: number;
}

const CuentaDetail = () => {
    useAuth();
    const { id } = useParams<{ id: string }>();
    const [cuenta, setCuenta] = useState<Cuenta | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        fetch(`http://localhost:8000/banco/cuenta/${id}/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error al obtener el detalle de la cuenta");
                }
                return res.json();
            })
            .then((data) => {
                setCuenta(data);
            })
            .catch((error) => {
                console.error("Error: ", error);
                alert(error.message);
            });
    }, [id]);

    return (
        <>
            <Menu />
            <Container>
            <Card title="Detalle de la Cuenta">
    <div className="flex justify-end gap-2 mb-4">
        <Button title="Depositar" onClick={() => navigate(`/cuenta/${id}/depositar`)} />
        <Button title="Retirar" onClick={() => navigate(`/cuenta/${id}/retirar`)} />
        <Button title="Transferir" onClick={() => navigate(`/cuenta/${id}/transferir`)} />
    </div>
    {cuenta ? (
        <div className="p-4 space-y-4">
            <p><strong>Número de Cuenta:</strong> {cuenta.numero_cuenta}</p>
            <p><strong>Saldo:</strong> {cuenta.saldo} Bs.</p>
        </div>
    ) : (
        <p>Cargando...</p>
    )}
</Card>

            </Container>
        </>
    );
};

export default CuentaDetail;
