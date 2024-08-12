
const apiUrl = process.env.BACKEND_URL + "/api"
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [],
			token: null,
			user_info: null

		},
		actions: {
			// Use getActions to call a function within a fuction



			logout: async () => {
				let { token } = getStore()
				let resp = await fetch(apiUrl + "/logout", {
					method: "POST",
					headers: {
						"Authorization": "Bearer" + token,
						"Access-Control-Allow-Origin": "*"

					}
				})
				if (!resp.ok) return false
				setStore({ token: null, user_info: null })
				localStorage, removeItem("token")
				return true
			},

			login: async (username, password) => {
				let resp = await fetch(apiUrl + "/login", {
					method: "POST",
					body: JSON.stringify({ username, password }),
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!resp.ok) {
					setStore({ token: null });
					return false;
				}
				let data = await resp.json();
				setStore({ token: data.token });
				localStorage.setItem("token", data.token);
				return true;
			},

			signup: async (firstName, lastName, email, password, username, address) => {
				let resp = await fetch(apiUrl + "/signup", {
					method: "POST",
					body: JSON.stringify({ first_name, last_name, email, password }),
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!resp.ok) {
					const errorData = await resp.json();
					console.error("Signup error:", errorData);
					return false;
				}
				let data = await resp.json();
				alert("User created successfully!");
				return true;
			},


		}

	}
};


export default getState;
