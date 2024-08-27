import os

# import requests
# import urllib.parse

# # Clave de acceso a la API de PayPal
# PAYPAL_SECRET_KEY=os.getenv("PAYPAL_SECRET_KEY")
# PAYPAL_CLIENT_ID=os.getenv("PAYPAL_CLIENT_ID")
# PAYPAL_REDIRECT_URI='https://ominous-space-telegram-x5rp6rgqvv9pfvp9x-3000.app.github.dev/homeUser/callback'


# # Ruta para la página de inicio
# @app.route('/paypal')
# def paypal_index():
#     return render_template('paypal_index.html')

# # Ruta para la página de autenticación con PayPal
# @app.route('/paypal/login', methods=['GET'])
# def paypal_login():
#     # Redirige al usuario a la página de autenticación de PayPal
#     auth_url = 'https://www.sandbox.paypal.com/signin/authorize'
#     params = {
#         'client_id': PAYPAL_CLIENT_ID,
#         'response_type': 'code',
#         'redirect_uri': PAYPAL_REDIRECT_URI,
#         'scope': 'openid profile email'
#     }
#     return redirect(auth_url + '?' + urllib.parse.urlencode(params))

# # Ruta para la página de callback de PayPal
# @app.route('/paypal/callback', methods=['GET'])
# def paypal_callback():
#     code = request.args.get('code')
#     # Exchange the authorization code for an access token
#     token_url = 'https://api-m.sandbox.paypal.com/v1/identity/openidconnect/tokenservice'
#     headers = {
#         'Content-Type': 'application/x-www-form-urlencoded',
#         'Authorization': f'Basic {PAYPAL_CLIENT_ID}:{PAYPAL_SECRET_KEY}',
#     }
#     data = {
#         'grant_type': 'authorization_code',
#         'code': code,
#         'redirect_uri': PAYPAL_REDIRECT_URI,
#     }
#     response = requests.post(token_url, headers=headers, data=data)

#     if response.status_code == 200:
#         # Get the access token and use it to authenticate the user
#         access_token = response.json()['access_token']
#         # Authenticate the user and redirect to the home page
#         return redirect(url_for('home'))
#     else:
#         # Handle errors
#         return 'Error exchanging authorization code for access token', 500

# # Ruta para la página de inicio con la información del usuario
# @app.route('/paypal/inicio')
# def paypal_inicio(user_name, user_email):
#     return render_template('paypal_inicio.html', user_name=user_name, user_email=user_email)