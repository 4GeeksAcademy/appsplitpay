const apiUrl = process.env.BACKEND_URL + "/api";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token: null,
			userInfo: null,
			isAuthenticated: false,
			errorMessage: null,
			loading: false,
		},
		actions: {
			login: async (email, password) => {
				setStore({ loading: true });
				try {
					const response = await fetch(apiUrl + "/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Cross-Origin-Opener-Policy": "same-origin-allow-popups",
						},
						body: JSON.stringify({ email, password })
					});

					if (response.ok) {
						const data = await response.json();
						setStore({
							token: data.token,
							isAuthenticated: true,
							loading: false,
							errorMessage: null
						});

						localStorage.setItem("token", data.token);
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

			loginPaypal: async () => {
				setStore({ loading: true });
				try {
					const clientId = 'https://sandbox.paypal.com';
					const clientSecret = 'AYAHrre39sJu0_FFsnRKrWr0X4mxM1d5od9RNOIx_oP3gv7jKXHVHBO1lnE4G7LpePT9cEvj3EHxLvJI';
					const redirectUri = 'https://ominous-space-telegram-x5rp6rgqvv9pfvp9x-3000.app.github.dev/homeUser/callback';
					const scope = 'openid profile email';

					const authUrl = `https://www.sandbox.paypal.com/signin/authorize?client_id=AYAHrre39sJu0_FFsnRKrWr0X4mxM1d5od9RNOIx_oP3gv7jKXHVHBO1lnE4G7LpePT9cEvj3EHxLvJI&response_type=code&redirect_uri=https://ominous-space-telegram-x5rp6rgqvv9pfvp9x-3000.app.github.dev/homeUser/callback&scope=openid+profile+email`;
					window.location.href = authUrl;

					// Handle callback
					const code = new URLSearchParams(window.location.search).get('code');
					if (code) {
						const response = await fetch(`https://api.sandbox.paypal.com/v1/identity/openidconnect/tokenservice`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
							},
							body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
						});

						const data = await response.json();
						const accessToken = data.access_token;

						// Generate JWT token
						const user = await fetch(`https://api.sandbox.paypal.com/v1/identity/openidconnect/userinfo`, {
							headers: {
								'Authorization': `Bearer ${accessToken}`,
							},
						});
						const userData = await user.json();
						const jwtToken = jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: '1h' });

						setStore({
							token: jwtToken,
							isAuthenticated: true,
							loading: false,
							errorMessage: null,
						});

						return true;
					} else {
						setStore({
							errorMessage: 'Error al autenticar con PayPal',
							loading: false,
						});
						return false;
					}
				} catch (error) {
					console.error('Error al autenticar con PayPal:', error);
					setStore({
						errorMessage: 'Error al autenticar con PayPal',
						loading: false,
					});
					return false;
				}
			},

			signup: async (username, email, password, first_name, last_name, age, address) => {
				setStore({ loading: true });
				try {
					const response = await fetch(apiUrl + "/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ username, email, password, first_name, last_name, age, address })
					});

					if (response.ok) {
						const data = await response.json();
						setStore({
							token: data.token,
							isAuthenticated: true,
							loading: false,
							errorMessage: null
						});

						if (data.token) {
							localStorage.setItem("token", data.token);
						}

						return true;
					} else {
						const errorData = await response.json();
						setStore({
							errorMessage: errorData.msg || "Signup failed",
							loading: false
						});
						return false;
					}
				} catch (error) {
					console.error("There was an error signing up:", error);
					setStore({
						errorMessage: "An error occurred during signup.",
						loading: false
					});
					return false;
				}
			},
			logout: async () => {
				try {
					// Suponiendo que no necesitas una llamada al backend para el logout
					setStore({
						token: null,
						userInfo: null,
						isAuthenticated: false,
						errorMessage: null,
					});

					localStorage.removeItem("token");
					localStorage.removeItem("userInfo");

					return true;
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
                const store = getStore();

                if (token && !store.isAuthenticated) {
                    setStore({
                        token: token,
                        isAuthenticated: true,
                    });
                } else if (!token && store.isAuthenticated) {
                    setStore({
                        isAuthenticated: false,
                    });
                }
            },
			updateUserInfo: (newUserInfo) => {
				const store = getStore();
				setStore({
					userInfo: { ...store.userInfo, ...newUserInfo }
				});
			},
			getMessage: () => {
				const store = getStore();
				return store.message;
			},
			setMessage: (msg) => {
				setStore({ message: msg });
			},

			// Función para solicitar un enlace de recuperación de contraseña
			requestPasswordRecovery: async (email) => {
				try {
					// Realiza la solicitud POST al servidor
					const response = await fetch(apiUrl + "/requestpasswordrecovery", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email })
					});
					// Verifica si la respuesta del servidor es exitosa
					if (response.ok) {
						const data = await response.json();
			
						// Verifica si el servidor ha enviado un token en la respuesta
						if (data.token) {
							// Si hay un token, lo podemos registrar y devolverlo junto con el mensaje
							console.log("Token recibido:", data.token);
							return { 
								msg: "Correo enviado con las instrucciones para cambiar la contraseña.", 
								token: data.token 
							};
						} else {
							// Si no hay token, solo devolvemos el mensaje
							return { 
								msg: "Correo enviado con las instrucciones para cambiar la contraseña." 
							};
						}
					} else {
						// Maneja el caso en que la respuesta del servidor no es exitosa
						const errorData = await response.json();
						throw new Error(errorData.msg || "Error al solicitar la recuperación de contraseña.");
					}
				} catch (error) {
					// Maneja cualquier error que pueda ocurrir durante la solicitud
					console.error("Error:", error);
					throw error;
				}
			},
			
			
			
			// Función para cambiar la contraseña
			// changePassword: async (token, password) => {
			// 	try {
			// 		const response = await fetch(`${apiUrl}/changepassword`, {
			// 			method: "PATCH",
			// 			headers: {
			// 				"Content-Type": "application/json",
			// 				"Authorization": `Bearer ${token}`
			// 			},
			// 			body: JSON.stringify({ password })
			// 		});
			
			// 		if (!response.ok) {
			// 			const result = await response.json();
			// 			throw new Error(result.msg || "Error al cambiar la contraseña.");
			// 		}
			
			// 		const result = await response.json();
			// 		return result.msg;
			// 	} catch (error) {
			// 		console.error("Error al cambiar la contraseña:", error);
			// 		throw new Error(error.message || "Error al cambiar la contraseña.");
			// 	}
			// },
			
		}
	};
};

export default getState;