import React,{useState,useEffect} from 'react'
import axios from 'axios';

const Login = ({ onLog}) => {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [error, seterror] = useState("");
    const [loading, setLoading] = useState(false);

    const onLogin = async (user) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/login", user);

            const { access_token, refresh_token } = response.data;

            // Save tokens in localStorage (for persistence)
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            console.log("Login successful:", response.data.message);
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
        }
    };
    
    const fetchData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/profile");

            console.log("User data:", response.data);
            onLog(response.data.user);
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
        }
};


    useEffect(() => {
      fetchData();
    }, [])
    
    const onSubmit = async (e) => {
    e.preventDefault();
    seterror("");
    let client = {
        email: email,
        password: password
    }
    await onLogin(client);  // performs login + saves token
    await fetchData();    // then gets email profile
    };

    const onChange = (e) => {
        if (error){
            seterror("");
        }
        if(e.target.id === 'email'){
            setemail(e.target.value)
        }else{
            setPassword(e.target.value)
        }
    }

  return (
    <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-rose-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-center text-rose-800 mb-6">Iniciar sesión</h1>

            <form onSubmit={onSubmit} className="space-y-6">
                {error && (
                <p className="text-red-500 text-center font-semibold">
                    Error: {error}
                </p>
                )}

                {loading && (
                <div className="text-center text-gray-600">Cargando...</div>
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
                    name="email"
                    value={email}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                    name="password"
                    value={password}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="********"
                />
                </div>

                {/* Botón de envío */}
                <button
                type="submit"
                className="w-full py-2 bg-rose-700 text-white font-semibold rounded-lg hover:bg-rose-800 transition duration-300"
                >
                Iniciar sesión
                </button>
            </form>
        </div>
    </div>
</>

  )
}

export default Login