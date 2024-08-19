"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, jwt_required
from api.models import db, User, TokenBlockedList, Contacts, Payment
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import datetime
from pytz import timezone
from paypal_funciones import paypal_Login, create_order, transfer_money

app = Flask(__name__)
bcrypt = Bcrypt(app)

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

#********************************************************************************************************
#********************************************USERS*******************************************************
#********************************************************************************************************

#--------------------------SIGNUP-OR-CREATE-USER--------------------------------------------------------

@api.route('/signup', methods=['POST'])
def user_signup():

    body = request.get_json()

    if "username" not in body:
        return jsonify({"msg":"Username is required"}), 400
    
    if "email" not in body:
        return jsonify({"msg":"Email is required"}), 400
    
    if "password" not in body:
        return jsonify({"msg":"Password is required"}), 400
    
    encrypted_password = bcrypt.generate_password_hash(body["password"]).decode('utf-8')
    
    new_user = User(username = body["username"], email = body["email"], password = encrypted_password,  is_active = True)

    if "first_name" in body:
        new_user.first_name = body["first_name"]
    else:
        new_user.first_name = ""

    if "last_name" in body:
        new_user.last_name = body["last_name"]
    else:
        new_user.last_name = ""

    if "age" in body:
        new_user.age = body["age"]
    else:
        new_user.age = ""

    if "address" in body:
        new_user.address = body["address"]
    else:
        new_user.address = ""

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg":"user added correctly"})


#--------------------------LOGIN------------------------------------------------------------------------

@api.route('/login', methods=['POST'])
def user_login():

    body = request.get_json()

    #1. Valido los datos de la peticion
    if "username" not in body:
        return jsonify({"msg":"Username is required"}), 400
    if "password" not in body:
        return jsonify({"msg":"Password is required"}), 400
    
    #2. Busco al usuario en la base de datos con el correo
    user = User.query.filter_by(username = body["username"]).first()

    #2.1 Si el usuario no aparece, retorna un error 404
    if user is None:
        return jsonify({"msg":"User not found"}), 404
    
    #3. Verifico el campo password del body con el password del usuario de la base de datos
    password_checked = bcrypt.check_password_hash(user.password, body["password"])

    #3.1 Si no se verifica se retorna un error de clave invalida 401
    if password_checked == False:
        return jsonify({"msg":"Invalid password"}), 401
    
    #4. Genero el token
    role = "admin"
    token = create_access_token(identity = user.id, additional_claims={"role":role})
    return jsonify({"token": token}), 200


#--------------------------LOGOUT-----------------------------------------------------------------------

@api.route('/logout', methods=['POST'])
@jwt_required()
def user_logout():
    jti = get_jwt()["jti"]
    token_blocked = TokenBlockedList(jti = jti)
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"msg":"Closed session"})


#--------------------------USER_INFO--------------------------------------------------------------------

@api.route('/user', methods=['GET'])
@jwt_required()
def user_info():
    user = get_jwt_identity()
    payload = get_jwt()
    return jsonify({"user": user, "role":payload["role"]})


#--------------------------EDIT_USER--------------------------------------------------------------------

@api.route('/user', methods=['PATCH'])
@jwt_required()
def edit_user():
    user_id = get_jwt_identity()
    
    user_db = User.query.filter_by(id=user_id).first()
    if user_db is None:
        return jsonify({"info":"Not Found"}), 404
    
    user_body = request.get_json()
    
    if "first_name" in user_body:
        user_db.first_name = user_body["first_name"]
    if "last_name" in user_body:
        user_db.last_name = user_body["last_name"]
    if "email" in user_body:
        user_db.email = user_body["email"]
    if "age" in user_body:
        user_db.age = user_body["age"]
    if "address" in user_body:
        user_db.address = user_body["address"]

    db.session.add(user_db)
    db.session.commit()
    return jsonify(user_db.serialize()), 200


#--------------------------DELETE_USER--------------------------------------------------------------------

@api.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():

    user_id = get_jwt_identity()

    print(user_id)

    user_db = User.query.filter_by(id=user_id).first()
    if user_db is None:
        return jsonify({"info":"Not Found"}), 404
    
    db.session.delete(user_db)
    db.session.commit()
    return jsonify({"info":"User deleted"}), 200

#-----------------------------------------------------------------------------------------------------
#---------------------------------PAYMENT-------------------------------------------------------------
#-----------------------------------------------------------------------------------------------------

#--------------------------PAYMENT GET-----------------------------------------------------------------

@api.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():
    payments = Payment.query.all()
    payments_list = []
    for payment in payments:
        payment_date = payment.date.astimezone(timezone('UTC'))  # Convertir a la zona horaria neutra
        payments_list.append({
            'id': payment.id,
            'date': payment_date.strftime('%d-%m-%Y %H:%M:%S'),
            'amount': payment.amount,
            'user_id': payment.user_id,
            'group_id': payment.group_id
        })
    return jsonify(payments_list), 200

#--------------------------PAYMENT GET BY ID-----------------------------------------------------------------
    

@api.route('/payments/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    
    payment = Payment.query.get(payment_id)
    if payment is None:
        return jsonify({'error': 'Payment not found'}), 404
    payment_date = payment.date.astimezone(timezone('UTC'))  # Convertir a la zona horaria neutra
    return jsonify({
        'id': payment.id,
        'date': payment_date.strftime('%d-%m-%Y %H:%M:%S'),
        'amount': payment.amount,
        'user_id': payment.user_id,
        'group_id': payment.group_id
    }), 200

#--------------------------PAYMENT POST----------------------------------------------------------------

@api.route('/payments', methods=['POST'])
@jwt_required()
def create_payment():
    user_id = get_jwt_identity()
    data = request.get_json()
    if 'group_id' in data:
        group_id = data['group_id']
    else:
        group_id = None
    payment_date = datetime.strptime(data['date'], '%d-%m-%Y %H:%M:%S')
    # comment = data.get('comment')
    # user_comment_id = data.get('user_comment_id')
    payment = Payment(date=payment_date,
                        amount=data['amount'],
                        user_id=user_id,
                        group_id=group_id
                        # comment=comment,
                        # user_comment_id=user_comment_id
                    )
    db.session.add(payment)
    db.session.commit()
    return jsonify(payment.serialize()), 201

#--------------------------PAYMENT PUT-----------------------------------------------------------------

@api.route('/payments/<int:payment_id>', methods=['PUT'])
@jwt_required()
def update_payment(payment_id):
    user_id = get_jwt_identity()
    payment = Payment.query.get(payment_id)
    
    if payment is None:
        return jsonify({'error': 'Payment not found'}), 404
    
    # Verifica que el pago no tenga más de 10 minutos de antigüedad, pasado este tiempo no debe permitir modificar
    if (datetime.utcnow() - payment.created_at).total_seconds() > 600:
        return jsonify({'error': 'Payment is too old to be updated'}), 403
    
    data = request.get_json()
    print("esta es la data", data)
    print("payment antes de actualizar", payment.serialize())
    
    if 'date' not in data or 'amount' not in data:
        return jsonify({'error': 'Date and amount are required'}), 400
    
    payment_date = datetime.strptime(data['date'], '%d-%m-%Y %H:%M:%S')
    payment.date = payment_date
    payment.amount = data['amount']
    payment.user_id = user_id
    
    # No permitimos la actualización del grupo
    if 'group_id' in data:
        return jsonify({'error': 'Cannot update group_id'}), 400
    
     # Actualizamos el comentario si se proporciona
    # if 'comment' in data:
    #     payment.comment = data['comment']
    # if 'user_comment_id' in data:
    #     payment.user_comment_id = data['user_comment_id']
    
    db.session.commit()
    return jsonify(payment.serialize()), 200

#------------------------PAYMENT DELETE------------------------------------

@api.route('/payments/<int:payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if payment is None:
        return jsonify({'error': 'Payment not found'}), 404
    db.session.delete(payment)
    db.session.commit()
    return jsonify({'message': 'Payment deleted'})

#----------------------------------------------------------------------------------------------------------
#-------------------------- PAYMENT PAYPAL ----------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------

#ruta para solicitar pago entre usuarios
@api.route('/transfer_money', methods=['POST'])
def transfer_money_route():
    
    sender_id = request.form['sender_id']
    recipient_id = request.form['recipient_id']
    
    # monto a transferir, convertimos en "float" para que se puedan agregar numeros decimales
    amount = float(request.form['amount'])

    # Llamamos a la funcion
    if transfer_money(sender_id, recipient_id, amount):
        return jsonify({"message": "Transferencia realizada con éxito"}), 200
    else:
        return jsonify({"message": "Error al realizar la transferencia"}), 400



#********************************************************************************************************
#*****************************************CONTACTS*******************************************************
#********************************************************************************************************

#--------------------------ADD_CONTACT--------------------------------------------------------------------

@api.route('/contact', methods=['POST'])
@jwt_required()
def add_contact():

    user_id = get_jwt_identity()
    print(user_id)

    body = request.get_json()

    if "username" not in body:
        return jsonify({"msg":"Username is required"}), 400
    
    contact = Contacts(username=body["username"], user_id = user_id)

    if "fullname" in body:
        contact.fullname = body["fullname"]
    else:
        contact.fullname = ""

    if "email" in body:
        contact.email = body["email"]
    else:
        contact.email = ""

    if "address" in body:
        contact.address = body["address"]
    else:
        contact.address = ""

    db.session.add(contact)
    db.session.commit()
    return jsonify({"msg":"contact added correctly"}), 200


#--------------------------GET_CONTACTS--------------------------------------------------------------------

@api.route('/contact', methods=['GET'])
@jwt_required()
def get_contacts():

    user_id = get_jwt_identity()
    
    contacts = Contacts.query.filter_by(user_id=user_id)
    contact_list = list(map(lambda contact: contact.serialize(), contacts))

    return jsonify(contact_list), 200


#--------------------------GET_SINGLE_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['GET'])
@jwt_required()
def get_single_contact(contactId):

    contact = Contacts.query.get(contactId)

    if contact is None:
        return jsonify({"error":"User not found"}),404
    
    return jsonify({"Contact": contact.serialize()}),200


#--------------------------EDIT_USER--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['PATCH'])
@jwt_required()
def edit_contact(contactId):
    
    contact_db = Contacts.query.filter_by(id=contactId).first()
    if contact_db is None:
        return jsonify({"info":"Not Found"}), 404
    
    contact_body = request.get_json()
    
    if "fullname" in contact_body:
        contact_db.fullname = contact_body["fullname"]
    if "email" in contact_body:
        contact_db.email = contact_body["email"]
    if "address" in contact_body:
        contact_db.address = contact_body["address"]

    db.session.add(contact_db)
    db.session.commit()
    return jsonify(contact_db.serialize()), 200


#--------------------------DELETE_USER--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['DELETE'])
@jwt_required()
def delete_contact(contactId):

    contact_db = Contacts.query.filter_by(id=contactId).first()
    if contact_db is None:
        return jsonify({"info":"Not Found"}), 404
    
    db.session.delete(contact_db)
    db.session.commit()
    return jsonify({"info":"User deleted"}), 200

#********************************************************************************************************
#*******************************************GROUPS*******************************************************
#********************************************************************************************************

