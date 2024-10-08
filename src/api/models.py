from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

app = Flask(__name__)
bcrypt = Bcrypt(app)

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(60), unique=False, nullable=False)
    last_name = db.Column(db.String(60), unique=False, nullable=False)
    age = db.Column(db.String(60), unique=False, nullable=False)
    address = db.Column(db.String(180), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    contacts = db.relationship('Contact', backref='user', lazy=True)
    groups = db.relationship('Group', secondary='group_members', back_populates='members')
    paypal_username= db.Column(db.String(200), unique= True, nullable=False)

    def __repr__(self):
        return f'<User {self.id} - {self.first_name} {self.last_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "age": self.age,
            "address": self.address,
            "email": self.email,
            "paypal_username":self.paypal_username,
            "is_active": self.is_active
        }
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

class TokenBlockedList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(100), nullable=False)

class Contact(db.Model):
    __tablename__ = 'contacts'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(180), unique=False, nullable=False)
    fullname = db.Column(db.String(180), unique=False, nullable=False)
    email = db.Column(db.String(180), unique=False, nullable=False)
    paypal_username = db.Column(db.String(180), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<Contact {self.fullname} ({self.username}) - {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "fullname": self.fullname,            
            "email": self.email,
            "paypal_username": self.paypal_username,
        }

class Group(db.Model):
    __tablename__ = 'groups'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    creator = db.relationship('User', backref='created_groups')
    members = db.relationship('User', secondary='group_members', back_populates='groups')

    def __repr__(self):
        return f'<Group {self.id} - {self.name}>'

    def serialize(self):
        members = [member.serialize() for member in self.members]
        return {
            "id": self.id,
            "name": self.name,
            "creator_id": self.creator_id,
            "members": members,  
        }

class GroupMember(db.Model):
    __tablename__ = 'group_members'
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    def __repr__(self):
        return f'<GroupMember {self.group_id} - {self.user_id}>'

class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='payments')
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))
    group = db.relationship('Group', backref='payments')
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    event = db.relationship('Event', backref='payments')
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'))  # <--- Agrega esta columna
    contact = db.relationship('Contact', backref='payments')  # <--- Modifica la relación
    paypal_username = db.Column(db.String)

    def __repr__(self):
        return f'<Payment {self.id} - {self.amount}>'
    def serialize(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "user_id": self.user_id,
            "group_id": self.group_id,
            "event_id": self.event_id,
            "contact_id": self.contact_id,
            "paypal_username": self.paypal_username
        }

# el evento es el producto
class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(180), unique=True, nullable=False)
    amount = db.Column(db.String(180), unique=False, nullable=False)
    description = db.Column(db.String(180), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='events')
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))
    group = db.relationship('Group', backref='events')

    def __repr__(self):
        return f'<Event {self.id} - {self.amount} - {self.description}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "amount": self.amount,
            "description": self.description,
            "user_id": self.user_id,
            "group_id": self.group_id,
        }