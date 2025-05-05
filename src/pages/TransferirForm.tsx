import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

interface Beneficiario {
  id: number;
  nombre: string;
  numero_cuenta: string;
}

const TransferirForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [numeroDestino, setNumeroDestino] = useState("");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [errores, setErrores] = useState<{ numeroDestino?: string; monto?: string }>({});

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("http://localhost:8000/banco/beneficiario", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBeneficiarios(data))
      .catch((err) => console.error("Error al cargar beneficiarios", err));
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const beneficiario = beneficiarios.find((b) => b.id === selectedId);
    if (beneficiario) {
      setNumeroDestino(beneficiario.numero_cuenta);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores({});

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:8000/banco/cuenta/${id}/transferir/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numero_cuenta: numeroDestino,
          monto: parseFloat(monto),
          descripcion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorText = data.error || "Error desconocido";

        if (errorText.includes("destino")) {
          setErrores((prev) => ({ ...prev, numeroDestino: "Cuenta destino inválida o no encontrada" }));
        } else if (errorText.includes("saldo") || errorText.includes("Monto")) {
          setErrores((prev) => ({ ...prev, monto: "Saldo insuficiente o monto inválido" }));
        } else {
          alert(errorText);
        }

        return;
      }

      alert("Transferencia realizada con éxito");
      navigate(`/cuenta/${id}`);
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al transferir");
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title="Transferir Fondos">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select beneficiario */}
            <div>
              <label className="block mb-1 font-medium">Seleccionar beneficiario (opcional)</label>
              <select
                onChange={handleSelectChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                defaultValue=""
              >
                <option value="" disabled>-- Selecciona un beneficiario --</option>
                {beneficiarios.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nombre} ({b.numero_cuenta})
                  </option>
                ))}
              </select>
            </div>

            {/* Input número de cuenta */}
            <div>
              <label className="block mb-1 font-medium">Cuenta destino</label>
              <input
                type="text"
                value={numeroDestino}
                onChange={(e) => setNumeroDestino(e.target.value)}
                required
                className={`w-full border px-3 py-2 rounded-md ${
                  errores.numeroDestino ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errores.numeroDestino && (
                <p className="text-red-500 text-sm mt-1">{errores.numeroDestino}</p>
              )}
            </div>

            {/* Monto */}
            <div>
              <label className="block mb-1 font-medium">Monto</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
                className={`w-full border px-3 py-2 rounded-md ${
                  errores.monto ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errores.monto && (
                <p className="text-red-500 text-sm mt-1">{errores.monto}</p>
              )}
            </div>

            {/* Descripción */}
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

            <Button title="Transferir" />
          </form>
        </Card>
      </Container>
    </>
  );
};

export default TransferirForm;
