import { useEffect, useState } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { useNavigate } from "react-router"; // Agregado para redirigir
import { URLS } from "../navigation/CONTANTS";


interface Beneficiario {
  id: number;
  usuario: number;
  nombre: string;
  numero_cuenta: string;
}

const BeneficiarioList = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Usado para redirigir

  useEffect(() => {
    fetchBeneficiarios();
  }, []);

  const fetchBeneficiarios = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:8000/banco/beneficiario", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudieron obtener los beneficiarios");
      }

      const data = await response.json();
      setBeneficiarios(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (id: number) => {
    // Redirige a la página de edición del beneficiario
    navigate(URLS.BENEFICIARIO.EDIT(id));

  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este beneficiario?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:8000/banco/beneficiario/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar beneficiario");

      // Actualizar lista después de eliminación
      setBeneficiarios((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title="Mis Beneficiarios">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : beneficiarios.length === 0 ? (
            <p>No tienes beneficiarios registrados.</p>
          ) : (
            <ul className="space-y-2">
              {beneficiarios.map((b) => (
                <li key={b.id} className="p-3 border rounded-md shadow-sm flex justify-between items-center">
                  <div>
                    <p><strong>Nombre:</strong> {b.nombre}</p>
                    <p><strong>N° Cuenta:</strong> {b.numero_cuenta}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(b.id)} // Cambiar el handleEdit para redirigir
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
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

export default BeneficiarioList;
