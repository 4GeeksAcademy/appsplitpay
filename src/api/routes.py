"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, jwt_required
from api.models import db, User, TokenBlockedList, Contact, Group, GroupMember, Event, Account, Payment
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import datetime
from pytz import timezone
from api.paypal_funciones import paypal_Login, create_order, transfer_money
from sqlalchemy.exc import IntegrityError
import os
import requests
import json

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

    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in body:
            return jsonify({"error": f"{field.capitalize()} is required"}), 400

    try:
        encrypted_password = bcrypt.generate_password_hash(body["password"]).decode('utf-8')
        new_user = User(
            username=body["username"],
            email=body["email"],
            password=encrypted_password,
            is_active=True,
            first_name=body.get("first_name", ""),
            last_name=body.get("last_name", ""),
            age=body.get("age", ""),
            address=body.get("address", "")
        )

        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User added successfully", "user_id": new_user.id}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Username or email already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------LOGIN------------------------------------------------------------------------

@api.route('/login', methods=['POST'])
def user_login():
    body = request.get_json()

    if "email" not in body or "password" not in body:
        return jsonify({"error": "email and password are required"}), 400

    try:
        user = User.query.filter_by(email=body["email"]).first()

        if user is None:
            return jsonify({"error": "User not found"}), 404

        if not bcrypt.check_password_hash(user.password, body["password"]):
            return jsonify({"error": "Invalid password"}), 401

        token = create_access_token(identity=user.id, additional_claims={"role": "admin"})
        return jsonify({"token": token, "user":user.serialize()}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------LOGOUT-----------------------------------------------------------------------

@api.route('/logout', methods=['POST'])
@jwt_required()
def user_logout():
    try:
        jti = get_jwt()["jti"]
        token_blocked = TokenBlockedList(jti=jti)
        db.session.add(token_blocked)
        db.session.commit()
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred during logout", "details": str(e)}), 500

#--------------------------USER_INFO--------------------------------------------------------------------

@api.route('/user', methods=['GET'])
@jwt_required()
def user_info():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        payload = get_jwt()
        return jsonify({
            "user": user.serialize(),
            "role": payload.get("role", "user")
        }), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------EDIT_USER--------------------------------------------------------------------

@api.route('/user', methods=['PATCH'])
@jwt_required()
def edit_user():
    user_id = get_jwt_identity()
    
    try:
        user_db = User.query.filter_by(id=user_id).first()
        if user_db is None:
            return jsonify({"error": "User not found"}), 404
        
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

        db.session.commit()
        return jsonify(user_db.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while updating user", "details": str(e)}), 500

#--------------------------DELETE_USER--------------------------------------------------------------------

@api.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():
    user_id = get_jwt_identity()

    try:
        user_db = User.query.filter_by(id=user_id).first()
        if user_db is None:
            return jsonify({"error": "User not found"}), 404
        
        db.session.delete(user_db)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while deleting user", "details": str(e)}), 500


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

# @api.route('/payments/<int:payment_id>', methods=['PUT'])
# @jwt_required()
# def update_payment(payment_id):
#     user_id = get_jwt_identity()
#     payment = Payment.query.get(payment_id)
    
#     if payment is None:
#         return jsonify({'error': 'Payment not found'}), 404
    
#     # Verifica que el pago no tenga más de 10 minutos de antigüedad, pasado este tiempo no debe permitir modificar
#     if (datetime.utcnow() - payment.created_at).total_seconds() > 600:
#         return jsonify({'error': 'Payment is too old to be updated'}), 403
    
#     data = request.get_json()
#     print("esta es la data", data)
#     print("payment antes de actualizar", payment.serialize())
    
#     if 'date' not in data or 'amount' not in data:
#         return jsonify({'error': 'Date and amount are required'}), 400
    
#     payment_date = datetime.strptime(data['date'], '%d-%m-%Y %H:%M:%S')
#     payment.date = payment_date
#     payment.amount = data['amount']
#     payment.user_id = user_id
    
#     # No permitimos la actualización del grupo
#     if 'group_id' in data:
#         return jsonify({'error': 'Cannot update group_id'}), 400
    
#     # Actualizamos el comentario si se proporciona
#     # if 'comment' in data:
#     #     payment.comment = data['comment']
#     # if 'user_comment_id' in data:
#     #     payment.user_comment_id = data['user_comment_id']
    
#     db.session.commit()
#     return jsonify(payment.serialize()), 200

#------------------------PAYMENT DELETE------------------------------------
#--------------------------IMPORTANTE----------------------------------------
#los usuarios no deberian poder borrar los pagos de la base de datos.

#@api.route('/payments/<int:payment_id>', methods=['DELETE'])
#@jwt_required()
#def delete_payment(payment_id):
#    payment = Payment.query.get(payment_id)
#    if payment is None:
#        return jsonify({'error': 'Payment not found'}), 404
#    db.session.delete(payment)
#    db.session.commit()
#    return jsonify({'message': 'Payment deleted'})

#----------------------------------------------------------------------------------------------------------
#-------------------------- PAYMENT PAYPAL ----------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------

#ruta para solicitar pago entre usuarios
@api.route('/transfer', methods=['POST'])
def transfer():
    data = request.get_json()

    sender_id = data.get('sender_id')
    recipient_id = data.get('recipient_id')
    amount = data.get('amount')

    if not sender_id or not recipient_id or not amount:
        return jsonify({'error': 'Faltan datos'}), 400

    success = transfer_money(sender_id, recipient_id, amount)

    if success:
        return jsonify({'message': 'Transferencia exitosa'}), 201
    else:
        return jsonify({'error': 'Fallo en la transferencia'}), 500

#********************************************************************************************************
#*****************************************CONTACTS*******************************************************
#********************************************************************************************************

#--------------------------ADD_CONTACT--------------------------------------------------------------------

@api.route('/contact', methods=['POST'])
@jwt_required()
def add_contact():
    user_id = get_jwt_identity()
    body = request.get_json()

    print(body)
 
    if "username" not in body:
        return jsonify({"error": "Username is required"}), 400
    
    try:
        contact = Contact(username=body["username"], user_id=user_id)

        if "fullname" in body:
            contact.fullname = body["fullname"]
        if "email" in body:
            contact.email = body["email"]
        if "address" in body:
            contact.address = body["address"]

        db.session.add(contact)
        db.session.commit()
        return jsonify({"message": "Contact added successfully", "contact": contact.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A contact with this username already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while adding contact", "details": str(e)}), 500

#--------------------------GET_CONTACTS--------------------------------------------------------------------

@api.route('/contact', methods=['GET'])
@jwt_required()
def get_contacts():
    user_id = get_jwt_identity()
    search_query = request.args.get('search', '')

    print(f"User ID: {user_id}, Search Query: {search_query}")  # Agrega esto para depurar

    try:
        query = Contact.query.filter_by(user_id=user_id)

        if search_query:
            query = query.filter(
                (Contact.fullname.ilike(f"%{search_query}%")) |
                (Contact.username.ilike(f"%{search_query}%")) |
                (Contact.email.ilike(f"%{search_query}%"))
            )

        contacts = query.all()

        print(f"Contacts found: {contacts}")  # Agrega esto para depurar

        contact_list = [contact.serialize() for contact in contacts]

        return jsonify({"contacts": contact_list}), 200
    except Exception as e:
        print(f"Error: {str(e)}")  # Agrega esto para depurar
        return jsonify({"error": "An unexpected error occurred while fetching contacts", "details": str(e)}), 500


#--------------------------GET_SINGLE_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['GET'])
@jwt_required()
def get_single_contact(contactId):
    user_id = get_jwt_identity()
    
    try:
        contact = Contact.query.filter_by(id=contactId, user_id=user_id).first()
        
        if not contact:
            return jsonify({"error": "Contact not found or you don't have permission to access it"}), 404
        
        return jsonify({"contact": contact.serialize()}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------EDIT_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['PATCH'])
@jwt_required()
def edit_contact(contactId):
    user_id = get_jwt_identity()
    
    try:
        contact_db = Contact.query.filter_by(id=contactId, user_id=user_id).first()
        if not contact_db:
            return jsonify({"error": "Contact not found or you don't have permission to edit it"}), 404
        
        contact_body = request.get_json()
        
        if "fullname" in contact_body:
            contact_db.fullname = contact_body["fullname"]
        if "email" in contact_body:
            contact_db.email = contact_body["email"]
        if "address" in contact_body:
            contact_db.address = contact_body["address"]

        db.session.commit()
        return jsonify(contact_db.serialize()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A contact with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------DELETE_CONTACT--------------------------------------------------------------------

@api.route('/contact/<int:contactId>', methods=['DELETE'])
@jwt_required()
def delete_contact(contactId):
    user_id = get_jwt_identity()

    try:
        contact_db = Contact.query.filter_by(id=contactId, user_id=user_id).first()
        if not contact_db:
            return jsonify({"error": "Contact not found or you don't have permission to delete it"}), 404
        
        db.session.delete(contact_db)
        db.session.commit()
        return jsonify({"message": "Contact deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#********************************************************************************************************
#*******************************************GROUPS*******************************************************
#********************************************************************************************************

#--------------------------CREATE_GROUP--------------------------------------------------------------------

@api.route('/group', methods=['POST'])
@jwt_required()
def create_group():
    user_id = get_jwt_identity()
    body = request.get_json()

    if "name" not in body:
        return jsonify({"error": "Group name is required"}), 400
    
    if "member_ids" not in body or not body["member_ids"]:
        return jsonify({"error": "At least one member is required"}), 400

    try:
        new_group = Group(name=body["name"], creator_id=user_id)
        db.session.add(new_group)
        db.session.flush()

        creator_member = GroupMember(group_id=new_group.id, user_id=user_id)
        db.session.add(creator_member)

        for member_id in body["member_ids"]:
            if member_id != user_id:
                member = user_id
                if not member:
                    return jsonify({"error": f"User with id {member_id} not found"}), 404
                member = GroupMember(group_id=new_group.id, user_id=member_id)
                db.session.add(member)

        db.session.commit()
        return jsonify({"message": "Group created successfully", "group": new_group.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A group with this name already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------GET_GROUP--------------------------------------------------------------------

@api.route('/group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group(group_id):
    user_id = get_jwt_identity()
    
    try:
        group = Group.query.get(group_id)

        if not group:
            return jsonify({"error": "Group not found"}), 404

        # Check if the user is a member of the group
        if user_id not in [member.id for member in group.members]:
            return jsonify({"error": "You are not a member of this group"}), 403

        return jsonify(group.serialize()), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
    
#--------------------------DELETE_GROUP--------------------------------------------------------------------

@api.route('/group/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    user_id = get_jwt_identity()
    try:
        group = Group.query.get(group_id)

        if not group:
            return jsonify({"error": "Group not found"}), 404

        if group.creator_id != user_id:
            return jsonify({"error": "Only the group creator can delete the group"}), 403

        db.session.delete(group)
        db.session.commit()

        return jsonify({"message": "Group deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------GET_MEMBERS_GROUP--------------------------------------------------------------------

@api.route('/groups', methods=['GET'])
@jwt_required()
def get_user_groups():
    user_id = get_jwt_identity()
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        groups = [group.serialize() for group in user.groups]
        return jsonify({"groups": groups}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------ADD_GROUP_MEMBER---------------------------------------------------------------

@api.route('/group/<int:group_id>/members', methods=['POST'])
@jwt_required()
def add_group_member(group_id):
    user_id = get_jwt_identity()
    body = request.get_json()

    if "member_id" not in body:
        return jsonify({"error": "Member ID is required"}), 400

    try:
        group = Group.query.get(group_id)
        if not group:
            return jsonify({"error": "Group not found"}), 404

        if group.creator_id != user_id:
            return jsonify({"error": "Only the group creator can add members"}), 403

        new_member = User.query.get(body["member_id"])
        if not new_member:
            return jsonify({"error": "User not found"}), 404

        if new_member in group.members:
            return jsonify({"error": "User is already a member of this group"}), 400

        group_member = GroupMember(group_id=group_id, user_id=body["member_id"])
        db.session.add(group_member)
        db.session.commit()

        return jsonify({"message": "Member added successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------DELETE_GROUP_MEMBER---------------------------------------------------------------

@api.route('/group/<int:group_id>/members', methods=['DELETE'])
@jwt_required()
def delete_group_member(group_id):
    user_id = get_jwt_identity()
    body = request.get_json()

    if "member_id" not in body:
        return jsonify({"error": "Member ID is required"}), 400
    
    try:
        group = Group.query.get(group_id)
        if not group:
            return jsonify({"error": "Group not found"}), 404

        if group.creator_id != user_id:
            return jsonify({"error": "Only the group creator can remove members"}), 403

        group_member = GroupMember.query.filter_by(group_id=group_id, user_id=body["member_id"]).first()
        if not group_member:
            return jsonify({"error": "User is not a member of this group"}), 404

        db.session.delete(group_member)
        db.session.commit()

        return jsonify({"message": "Member removed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#********************************************************************************************************
#*******************************************EVENTS*******************************************************
#********************************************************************************************************

#--------------------------CREATE_EVENT---------------------------------------------------------------
#--------------------------CREATE_EVENT---------------------------------------------------------------
@api.route('/group/<int:group_id>/event', methods=['POST'])
@jwt_required()
def create_event(group_id):
    user_id = get_jwt_identity()
    body = request.get_json()
    required_fields = ['name', 'amount', 'user_id', 'group_id']
    for field in required_fields:
        if field not in body:
            return jsonify({"error": f"{field.capitalize()} is required"}), 400
    try:
        new_event = Event(
            name=body["name"],
            amount=body["amount"],
            description=body["description"],
            user_id=user_id,
            group_id=group_id
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify({"message": "Event created successfully", "event": new_event.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "An event with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
#--------------------------GET_EVENT---------------------------------------------------------------
@api.route('/group/<int:group_id>/event/<int:event_id>', methods=['GET'])
@jwt_required()
def get_event(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
        return jsonify(event.serialize()), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
#--------------------------EDIT_EVENT---------------------------------------------------------------
@api.route('/group/<int:group_id>/event/<int:event_id>', methods=['PATCH'])
@jwt_required()
def update_event(event_id):
    body = request.get_json()
    try:
        event_db = Event.query.get(event_id)
        if not event_db:
            return jsonify({"error": "Event not found"}), 404
        if "name" in body:
            event_db.name = body["name"]
        if "amount" in body:
            event_db.amount = body["amount"]
        if "description" in body:
            event_db.description = body["description"]
        db.session.commit()
        return jsonify(event_db.serialize()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "An event with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
#--------------------------DELETE_EVENT---------------------------------------------------------------
@api.route('/group/<int:group_id>/event/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    user_id = get_jwt_identity()
    try:
        event_db = Event.query.get(event_id)
        if not event_db:
            return jsonify({"error": "Event not found"}), 404
        if event_db.user_id != user_id:
            return jsonify({"error": "Event not authorizate"}), 404
        db.session.delete(event_db)
        db.session.commit()
        return jsonify({"message": "Event deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
#--------------------------GET_ALL_EVENT---------------------------------------------------------------
@api.route('/group/<int:group_id>/events', methods=['GET'])
@jwt_required()
def get_all_events():
    try:
        events = Event.query.all()
        return jsonify([event.serialize() for event in events]), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#********************************************************************************************************
#*******************************************ACCOUNT*******************************************************
#********************************************************************************************************

#--------------------------CREATE_ACCOUNT---------------------------------------------------------------

@api.route('/account', methods=['POST'])
@jwt_required()
def create_account():
    body = request.get_json()
    required_fields = ['type', 'user_id']
    for field in required_fields:
        if field not in body:
            return jsonify({"error": f"{field.capitalize()} is required"}), 400

    try:
        new_account = Account(
            type=body["type"],
            user_id=body["user_id"]
        )
        db.session.add(new_account)
        db.session.commit()
        return jsonify({"message": "Account created successfully", "account": new_account.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "An account with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------GET_ACCOUNT---------------------------------------------------------------

@api.route('/account/<int:account_id>', methods=['GET'])
@jwt_required()
def get_account(account_id):
    try:
        account = Account.query.get(account_id)
        if not account:
            return jsonify({"error": "Account not found"}), 404
        return jsonify(account.serialize()), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------EDIT_ACCOUNT---------------------------------------------------------------

@api.route('/account/<int:account_id>', methods=['PATCH'])
@jwt_required()
def update_account(account_id):
    body = request.get_json()
    try:
        account_db = Account.query.get(account_id)
        if not account_db:
            return jsonify({"error": "Account not found"}), 404

        if "type" in body:
            account_db.type = body["type"]
        if "user_id" in body:
            account_db.user_id = body["user_id"]

        db.session.commit()
        return jsonify(account_db.serialize()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "An account with this information already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#--------------------------DELETE_ACCOUNT---------------------------------------------------------------

@api.route('/account/<int:account_id>', methods=['DELETE'])
@jwt_required()
def delete_account(account_id):
    try:
        account_db = Account.query.get(account_id)
        if not account_db:
            return jsonify({"error": "Account not found"}), 404

        db.session.delete(account_db)
        db.session.commit()
        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#********************************************************************************************************
#*******************************************COMMENTS*******************************************************
#********************************************************************************************************

@api.route('/changepassword', methods=['PATCH'])
@jwt_required()
def user_change_password():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    body = request.get_json()
    new_password = bcrypt.generate_password_hash(
        body["password"]).decode('utf-8')
    user.password = new_password
    db.session.add(user)

    if not new_password:
        return jsonify({"msg": "La contraseña no puede estar vacía."}), 400

    if get_jwt()["type"] == "password":
        jti = get_jwt()["jti"]
        token_blocked = TokenBlockedList(jti=jti)
        db.session.flush()
        db.session.add(token_blocked)

    db.session.commit()
    return jsonify({"msg": "Contraseña actualizada con éxito"}), 200


@api.route('/requestpasswordrecovery', methods=['POST'])
def request_password_recovery():
    try:
        email = request.get_json().get('email')
        if not email:
            return jsonify({"msg": "Email es requerido"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        #Token de acceso para la recuperación de contraseña
        password_token = create_access_token(identity=user.id, additional_claims={"type": "password"})
        
        #URL al FRONTEND
        url = os.getenv('FRONTEND_URL') 
        url = url + "/changepassword?token=" + password_token
        print (url)
        # Datos para la solicitud de envío de correo
        send_mail_url = os.getenv("MAIL_SEND_URL")
        service_id = os.getenv("MAIL_SERVICE_ID")
        template_id = os.getenv("MAIL_TEMPLATE_ID")
        user_id = os.getenv("MAIL_USER_ID")

        data = {
            "service_id": service_id,
            "template_id": template_id,
            "user_id": user_id,
            "template_params": {
                "url": url,
            }
        }

        headers = {"Content-Type": "application/json"}
        response = requests.post(send_mail_url, headers=headers, data=json.dumps(data))
        print("Response status code:", response.status_code)
        print("Response content:", response.text)
        print("Data sent:", json.dumps(data, indent=4))

        # Verificacion envio de correo
        if response.status_code == 200:
            return jsonify({
                "msg": "Correo enviado con éxito."

            }), 200
        else:
            return jsonify({"msg": "Ocurrió un error con el envío de correo"}), 400

    except Exception as e:
        print("Error:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500







""" @api.route('/', methods=['GET'])
@jwt_required()
def name_function():
    pass """