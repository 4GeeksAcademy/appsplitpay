import requests
import os
from flask import request, jsonify
from requests.auth import HTTPBasicAuth

# Configuración de PayPal

access_token = ""
app_id = ""
expires_in = ""


#---------------------------- paypal_Login------------------------

# Permite que los usuarios puedan ingresar y realizar gestiones.

def paypal_Login():
    # Reemplaza CLIENT_ID y CLIENT_SECRET con tus credenciales de PayPal
    client_id = os.getenv('PAYPAL_CLIENT_ID')
    client_secret = os.getenv('PAYPAL_SECRET_KEY')

    # Establece la URL de la API
    url = os.getenv('PAYPAL_URL') + "/v1/oauth2/token"

    # Establece los encabezados
    headers = {
    "Content-Type": "application/x-www-form-urlencoded"
    }

    # Establece los datos de la solicitud
    data = {
    "grant_type": "client_credentials"
    }

    # Realiza la solicitud POST
    response = requests.post(url, headers=headers, data=data, auth=(client_id, client_secret))

        # Verifica si la solicitud fue exitosa
    if response.status_code == 200:
        # Obtiene el token de acceso
        access_token = response.json()["access_token"]
        expires_in = response.json()["expires_in"]
        app_id = response.json()["app_id"]
        print("Token de acceso:", access_token)
    else:
        print("Error:", response.status_code)

#--------------------------crear una orden------------------------------------

# crea una orden para poder gestionar un pago.

def create_order(access_token):
    # Establece la URL de la API
    url = os.getenv('PAYPAL_URL') + "/v1/payments/payment"

    # Establece los encabezados
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    # Establece los datos de la solicitud
    data = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://example.com/return", # establecer cuando esten creadas las vistas 
            "cancel_url": "https://example.com/cancel"  # establecer cuando esten creadas las vistas
        },
        "transactions": [
            {
                "amount": {
                    "currency": "EUR",
                    "total": "10.00"
                },
                "description": "Test payment"
            }
        ]
    }

    # Realiza la solicitud POST
    response = requests.post(url, headers=headers, json=data)

    # Verifica si la solicitud fue exitosa
    if response.status_code == 201:
        # Obtiene la orden creada
        order_id = response.json()["id"]
        print("Orden creada:", order_id)
    else:
        print("Error:", response.status_code)

# # Llama a la función paypal_Login para obtener el token de acceso
# paypal_Login()
# access_token = access_token

# # Llama a la función create_order con el token de acceso
# create_order(access_token)

#--------------------------transfer_money---------------------------

# Crea una orden para poder enviar dinero de un usuario a otro

# def transfer_money(sender_id, recipient_id, amount):
#     # Obtener la información de pago del remitente y del destinatario
#     sender_payment_info = get_payment_info(sender_id)
#     recipient_payment_info = get_payment_info(recipient_id)

#     # Reemplaza con tus credenciales de PayPal
#     client_id = os.getenv('PAYPAL_CLIENT_ID')
#     client_secret = os.getenv('PAYPAL_SECRET_KEY')

#     # URL de Sandbox para la obtención del token
#     url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'

#     # Parámetros de la solicitud
#     payload = {
#         'grant_type': 'client_credentials'
#     }

#     # Hacer la solicitud POST para obtener el access token
#     response = requests.post(url, data=payload, auth=HTTPBasicAuth(client_id, client_secret))
#     access_token = response.json().get('access_token')

#     # Crear la solicitud de pago
#     payload = {
#         "intent": "transfer",
#         "payer": {
#             "payment_method": "paypal",
#             "payer_info": {
#                 "email": "user@example.com"
#             }
#         },
#         "transactions": [{
#             "amount": {
#                 "currency": "EUR",
#                 "total": 500
#             },
#             "payee": {
#                 "email": "user2@example.com"
#             }
#         }]
#     }

#     # Realizar la solicitud de pago a la API de PayPal
#     # data = '{ "sender_batch_header": { "sender_batch_id": "Payouts_2018_100007", "email_subject": "You have a payout!", "email_message": "You have received a payout! Thanks for using our service!" }, "items": [ { "recipient_type": "EMAIL", "amount": { "value": "9.87", "currency": "USD" }, "note": "Thanks for your patronage!", "sender_item_id": "201403140001", "receiver": "receiver@example.com", "alternate_notification_method": { "phone": { "country_code": "91", "national_number": "9999988888" } }, "notification_language": "fr-FR" }, { "recipient_type": "PHONE", "amount": { "value": "112.34", "currency": "USD" }, "note": "Thanks for your support!", "sender_item_id": "201403140002", "receiver": "91-734-234-1234" }, { "recipient_type": "PAYPAL_ID", "amount": { "value": "5.32", "currency": "USD" }, "note": "Thanks for your patronage!", "sender_item_id": "201403140003", "receiver": "G83JXTJ5EHCQ2", "purpose": "GOODS" } ] }'
#     # headers={
#     #          "Content-Type": "application/json",
#     #          "Authorization": "Token " + access_token,
#     #         }
#     # response = requests.post('https://api-m.sandbox.paypal.com/v1/payments/payouts', headers=headers, data=data)
#     response = requests.post(
#         "https://api-m.sandbox.paypal.com/v1/payments/payment",
#         data=payload,
#         headers={
#             "Content-Type": "application/json",
#             "Authorization": "Token " + access_token,
#         }
#     )
#     data=response.json
#     print(data)
#     # Verificar si la solicitud fue exitosa
#     if response.status_code == 201:
#         return True
#     else:
#         return False

# def get_payment_info(user_id):
#     # Obtener la información de pago del usuario desde la base de datos
#     # ...
#     return {
#         "email": "user@example.com",
#         "payment_method": "paypal"
#     }




def transfer_money(sender_id, recipient_id, amount):
    # Obtener la información de pago del remitente y del destinatario
    sender_payment_info = get_payment_info(sender_id)
    recipient_payment_info = get_payment_info(recipient_id)

    # Reemplaza con tus credenciales de PayPal
    client_id = os.getenv('PAYPAL_CLIENT_ID')
    client_secret = os.getenv('PAYPAL_SECRET_KEY')

    # URL de Sandbox para la obtención del token
    url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'

    # Parámetros de la solicitud
    payload = {
        'grant_type': 'client_credentials'
    }

    # Hacer la solicitud POST para obtener el access token
    response = requests.post(url, data=payload, auth=HTTPBasicAuth(client_id, client_secret))
    access_token = response.json().get('access_token')

    # Crear la solicitud de pago
    payload = {
        "sender_batch_header": {
            "sender_batch_id": "Payouts_2018_100007",
            "email_subject": "You have a payout!",
            "email_message": "You have received a payout! Thanks for using our service!"
        },
        "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": amount,
                    "currency": "EUR"
                },
                "note": "Thanks for your patronage!",
                "sender_item_id": "201403140001",
                "receiver": recipient_payment_info["email"]
            }
        ]
    }

    # Realizar la solicitud de pago a la API de PayPal
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token
    }
    response = requests.post('https://api-m.sandbox.paypal.com/v1/payments/payouts', headers=headers, json=payload)

    # Verificar si la solicitud fue exitosa
    if response.status_code == 201:
        return True
    else:
        return False

def get_payment_info(user_id):
    # Obtener la información de pago del usuario desde la base de datos
    # ...
    return {
        "email": "user@example.com",
        "payment_method": "paypal"
    }