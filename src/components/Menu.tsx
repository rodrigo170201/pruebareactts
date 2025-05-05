import { useState } from "react";
import { Link } from "react-router";
import { URLS } from "../navigation/CONTANTS";
import { ChevronDown, List } from "react-bootstrap-icons";
import { useAuth } from "../hooks/useAuth";

export const Menu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const { username, doLogout } = useAuth();

    const toggleSubMenu = (id: string) => {
        const subMenu = document.getElementById(id);
        const shownSubMenus = document.getElementsByClassName("submenu-shown");
        if (shownSubMenus.length > 0) {
            for (let i = 0; i < shownSubMenus.length; i++) {
                const element = shownSubMenus[i] as HTMLElement;
                if (element.id !== id) {
                    element.classList.toggle("hidden");
                    element.classList.toggle("submenu-shown");
                }
            }
        }
        if (subMenu) {
            subMenu.classList.toggle("hidden");
            subMenu.classList.toggle("submenu-shown");
        }
    }

    const handleCrearCuenta = async () => {
        const confirmed = window.confirm("¿Estás seguro que deseas crear una nueva cuenta?");
        if (!confirmed) return;

        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch("http://localhost:8000/banco/cuenta/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error("Error al crear la cuenta");
            }

            const data = await response.json();
            alert("Cuenta creada exitosamente con número: " + data.numero_cuenta);
            window.location.href = URLS.CUENTA.LIST;
        } catch (error) {
            console.error("Error al crear la cuenta:", error);
            alert("Hubo un error al crear la cuenta");
        }
    };

    const onLogoutClick = () => {
        doLogout();
        window.location.href = URLS.LOGIN;
    };

    return (
        <nav className="bg-black shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-white">BancoTuBanco</span>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setShowMenu(!showMenu)} className="text-white">
                            <List />
                        </button>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to={URLS.CUENTA.LIST} className="text-white hover:text-blue-600">Inicio</Link>
                        <button onClick={handleCrearCuenta} className="text-white hover:text-blue-600">Crear cuenta</button>

                        <div className="relative group">
                            <button onClick={() => toggleSubMenu('beneficiario')} className="cursor-pointer text-white hover:text-blue-600">
                                Beneficiarios<span> <ChevronDown size={10} className="inline" /></span>
                            </button>
                            <div id="beneficiario" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <Link to={URLS.BENEFICIARIO.LIST} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de beneficiarios</Link>
                                <Link to={URLS.BENEFICIARIO.CREATE} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Crear beneficiario</Link>
                            </div>
                        </div>

                        <Link to={URLS.HISTORIAL} className="text-white hover:text-blue-600">Historial</Link>

                        <div className="relative group">
                            <button
                                onClick={() => {
                                    const menu = document.getElementById('authMenu');
                                    menu?.classList.toggle("hidden");
                                }}
                                className="cursor-pointer text-white hover:text-blue-600"
                            >
                                {username}<span> <ChevronDown size={10} className="inline" /></span>
                            </button>
                            <div id="authMenu" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10 w-64">
                                <button onClick={onLogoutClick} className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 border-t">
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menú móvil */}
            <div id="mobile-menu" className={(showMenu ? "" : "hidden ") + "md:hidden px-4 pb-4 space-y-2"}>
                <Link to={URLS.CUENTA.LIST} className="block text-white py-2">Inicio</Link>
                <button onClick={handleCrearCuenta} className="block text-white py-2">Crear cuenta</button>
                {/* Submenu móvil Beneficiarios */}
                <div>
                    <button onClick={() => toggleSubMenu('mobileBeneficiario')} className="w-full text-left text-white py-2 flex justify-between items-center">
                        Beneficiarios <ChevronDown size={10} />
                    </button>
                    <div id="mobileBeneficiario" className="hidden pl-4 space-y-1">
                        <Link to={URLS.BENEFICIARIO.LIST} className="block text-white py-1">Lista de beneficiarios</Link>
                        <Link to={URLS.BENEFICIARIO.CREATE} className="block text-white py-1">Crear beneficiario</Link>
                    </div>
                </div>
                <Link to={URLS.HISTORIAL} className="block text-white py-2">Historial</Link>
                <button onClick={onLogoutClick} className="block text-white py-2">Cerrar sesión</button>
            </div>
        </nav>
    );
};
