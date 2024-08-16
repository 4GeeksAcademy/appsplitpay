const apiUrl = process.env.BACKEND_URL + "/api";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,                // Para almacenar mensajes generales
			token: null,                  // Token de autenticación del usuario
			userInfo: null,               // Información del usuario autenticado
			isAuthenticated: false,       // Estado de autenticación
			errorMessage: null,           // Para manejar errores en las solicitudes
			loading: false,               // Indicador de estado de carga para solicitudes async
		},
		actions: {
			// Login del usuario
			login: async (username, password) => {
				setStore({ loading: true });
				try {
					const response = await fetch(process.env.BACKEND_URL + "/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*"
						},
						body: JSON.stringify({ username, password })
					});

					if (response.ok) {
						const data = await response.json();
						setStore({
							token: data.token,
							isAuthenticated: true,
							loading: false,
							errorMessage: null
						});

						// Almacenar el token en localStorage
						localStorage.setItem("token", data.token);

						// Podrías obtener más datos del usuario si fuera necesario
						return true;
					} else {
						const errorData = await response.json();
						setStore({
							errorMessage: errorData.msg || "Login failed",
							loading: false
						});
						return false;
					}
				} catch (error) {
					console.error("There was an error logging in:", error);
					setStore({
						errorMessage: "An error occurred during login.",
						loading: false
					});
					return false;
				}
			},

			// Registro de usuario
			signup: async (username, email, password, first_name, last_name, age, address) => {
				setStore({ loading: true });
				try {
					const response = await fetch(process.env.BACKEND_URL + "/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*"
						},
						body: JSON.stringify({ username, email, password, first_name, last_name, age, address })
					});

					if (response.ok) {
						const data = await response.json();

						// Si el registro es exitoso, podrías iniciar sesión automáticamente
						setStore({
							token: data.token, // Si la respuesta incluyera un token
							isAuthenticated: true,
							loading: false,
							errorMessage: null
						});

						// Almacenar el token en localStorage si lo recibes en la respuesta
						if (data.token) {
							localStorage.setItem("token", data.token);
						}

						return true; // Retorna true si el registro fue exitoso
					} else {
						const errorData = await response.json();
						setStore({
							errorMessage: errorData.msg || "Signup failed",
							loading: false
						});
						return false; // Retorna false si el registro falló
					}
				} catch (error) {
					console.error("There was an error signing up:", error);
					setStore({
						errorMessage: "An error occurred during signup.",
						loading: false
					});
					return false; // Retorna false si hubo un error en la petición
				}
			},

			// Logout del usuario
			logout: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/logout", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
							"Authorization": `Bearer ${getStore().token}`
						}
					});

					if (response.ok) {

						setStore({
							token: null,
							userInfo: null,
							isAuthenticated: false,
							errorMessage: null,
						});

						localStorage.removeItem("token");
						localStorage.removeItem("userInfo");

						return true;
					} else {
						const errorData = await response.json();
						setStore({
							errorMessage: errorData.msg || "Logout failed"
						});
						return false;
					}
				} catch (error) {
					console.error("There was an error logging out:", error);
					setStore({
						errorMessage: "An error occurred during logout."
					});
					return false;
				}
			},

			checkAuthentication: () => {
				const token = localStorage.getItem("token");
				const userInfo = JSON.parse(localStorage.getItem("userInfo"));

				if (token && userInfo) {
					setStore({
						token: token,
						userInfo: userInfo,
						isAuthenticated: true
					});
				}
			},

			// Ejemplo de una función que podría actualizar la información del usuario
			updateUserInfo: (newUserInfo) => {
				const store = getStore();
				setStore({
					userInfo: { ...store.userInfo, ...newUserInfo }
				});
			},

			// Obtener un mensaje almacenado en el estado
			getMessage: () => {
				const store = getStore();
				return store.message;
			},

			// Establecer un mensaje en el estado
			setMessage: (msg) => {
				setStore({ message: msg });
			}
		}
	};
};

export default getState;
