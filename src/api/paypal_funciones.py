import requests
import os
import paypalrestsdk
from flask import request, jsonify

# Configuración de PayPal
paypalrestsdk.configure({
  "mode": PAYPAL_MODE,
  "client_id": PAYPAL_CLIENT_ID,
  "client_secret": PAYPAL_CLIENT_SECRET
})

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
    if response.sttus_code == 200:
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

# Llama a la función paypal_Login para obtener el token de acceso
paypal_Login()
access_token = access_token

# Llama a la función create_order con el token de acceso
create_order(access_token)

#--------------------------transfer_money---------------------------

# Crea una orden para poder enviar dinero de un usuario a otro

def transfer_money(sender_id, recipient_id, amount):
    # Obtener la información de pago del remitente y del destinatario
    sender_payment_info = get_payment_info(sender_id)
    recipient_payment_info = get_payment_info(recipient_id)

    # Crear una transacción de pago con PayPal
    payment = paypalrestsdk.Payment({
      "intent": "transfer",
      "payer": {
        "payment_method": "paypal",
        "payer_info": {
          "email": sender_payment_info["email"]
        }
      },
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": amount
        },
        "payee": {
          "email": recipient_payment_info["email"]
        }
      }]
    })

    # Realizar la transferencia de dinero
    if payment.create():
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