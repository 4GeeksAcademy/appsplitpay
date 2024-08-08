
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
						"Authorization": "Bearer" + token
					}
				})
				if (!resp.ok) return false
				setStore({ token: null, user_info: null })
				localStorage, removeItem("token")
				return true
			}
		}

	}
};


export default getState;
