import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { URLS } from "../navigation/CONTANTS";

const BeneficiarioForm = () => {
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // Verifica si estamos en modo edición

  const [nombre, setNombre] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      fetchBeneficiario();
    }
  }, [id]);

  const fetchBeneficiario = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:8000/banco/beneficiario/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("No se pudo obtener el beneficiario");

      const data = await response.json();
      setNombre(data.nombre);
      setNumeroCuenta(data.numero_cuenta);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem("access_token");
  
    const url = isEditMode
      ? `http://localhost:8000/banco/beneficiario/${id}/`
      : `http://localhost:8000/banco/beneficiario/`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          numero_cuenta: numeroCuenta,
        }),
      });

      if (!response.ok) throw new Error("Error al guardar beneficiario");

      alert(
        isEditMode
          ? "Beneficiario actualizado correctamente"
          : "Beneficiario creado correctamente"
      );

      navigate(URLS.BENEFICIARIO.LIST);
    } catch (err: any) {
      alert(err.message);
    }
  };
  
  return (
    <>
      <Menu />
      <Container>
        <Card title={isEditMode ? "Editar Beneficiario" : "Nuevo Beneficiario"}>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nombre</label>
              <input
                type="text"
                className="border p-2 w-full rounded-md"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese el nombre del beneficiario"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Número de Cuenta</label>
              <input
                type="text"
                className="border p-2 w-full rounded-md"
                value={numeroCuenta}
                onChange={(e) => setNumeroCuenta(e.target.value)}
                placeholder="Ingrese el número de cuenta"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEditMode ? "Actualizar" : "Crear"}
            </button>
          </form>
        </Card>
      </Container>
    </>
  );
};

export default BeneficiarioForm;
