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
                    const response = await fetch(apiUrl + "/requestpasswordrecovery", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email })
                    });

                    if (response.ok) {
						print (data)
                        const data = await response.json();
                        return ({"msg": "Correo enviado con las instrucciones para cambiar la contraseña."}) ;
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.msg || "Error al solicitar la recuperación de contraseña.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    throw error;
                }
            },

			// Función para cambiar la contraseña
			changePassword: async (token, password) => {
				try {
					const response = await fetch(apiUrl + "/changepassword", {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						},
						body: JSON.stringify({ password })
					});
					const result = await response.json();
					if (!response.ok) {
						throw new Error(result.msg || "Error al cambiar la contraseña.");
					}
					return result.msg;
				} catch (error) {
					console.error("Error al cambiar la contraseña:", error);
					throw new Error(error.message || "Error al cambiar la contraseña.");
				}
			},
		}
	};
};

export default getState;