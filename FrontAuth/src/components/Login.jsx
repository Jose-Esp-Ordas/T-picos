import React, { useState, useEffect } from "react";
import axios from "axios";

const Login = ({ onLog }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // --- LOGIN ---
  const onLogin = async (user) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", user);
      const { access_token, refresh_token } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      console.log("Login exitoso:", response.data.message);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  // --- REGISTER ---
  const onRegister = async (userData) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register", userData);
      console.log("Usuario creado:", response.data);
      alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
      setIsRegister(false);
    } catch (error) {
      console.error("Error al registrar:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Error al registrar usuario");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log("Datos del usuario:", response.data);
      onLog(response.data.user);
    } catch (error) {
      console.error("Error obteniendo perfil:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        // Crear usuario nuevo
        const newUser = {
          username,
          email,
          password,
          role,
        };
        await onRegister(newUser);
      } else {
        // Iniciar sesión
        const user = { email, password };
        await onLogin(user);
        await fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-rose-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-rose-800 mb-6">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <p className="text-red-500 text-center font-semibold">Error: {error}</p>
          )}

          {loading && (
            <div className="text-center text-gray-600">Cargando...</div>
          )}

          {/* Campo de usuario (solo en registro) */}
          {isRegister && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-black  px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="josesito2"
              />
            </div>
          )}

          {/* Campo de correo */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border text-black  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="********"
            />
          </div>

          {/* Campo de rol (solo en registro) */}
          {isRegister && (
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rol
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 text-black  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>
          )}

          {/* Botón principal */}
          <button
            type="submit"
            className="w-full py-2 bg-rose-700 text-white font-semibold rounded-lg hover:bg-rose-800 transition duration-300"
          >
            {isRegister ? "Registrarse" : "Iniciar sesión"}
          </button>
        </form>

        {/* Toggle entre login y registro */}
        <p className="text-center text-gray-700 mt-4">
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={toggleMode}
                className="text-rose-700 font-semibold hover:underline"
              >
                Inicia sesión
              </button>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{" "}
              <button
                onClick={toggleMode}
                className="text-rose-700 font-semibold hover:underline"
              >
                Regístrate
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
