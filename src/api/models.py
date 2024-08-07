from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

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
            "is_active":self.is_active
            # do not serialize the password, its a security breach
        }
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password,password)
    

class TokenBlockedList(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(100), nullable = False)


class Contacts(db.Model):
    __tablename__ = 'contacts'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(180), unique=True, nullable=False)
    fullname = db.Column(db.String(180), unique=False, nullable=False)
    email = db.Column(db.String(180), unique=False, nullable=False)
    address = db.Column(db.String(180))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='contacts')

    def __repr__(self):
        return f'<Contacts {self.fullname} ({self.username}) - {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "fullname": self.fullname,            
            "email": self.email,
            "address": self.address,

        }

class Payment(db.Model):

    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    amount = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='payments')
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))
    group = db.relationship('Group', backref='payments')

    def __repr__(self):
        return f'<Payment {self.id} - {self.date} - {self.amount}>'

    def serialize(self):
        return {
            "id": self.id,
            "date": self.date,
            "amount": self.amount,
            "user_id": self.user_id,
            "group_id": self.group_id,
        }

class Group(db.Model):

    __tablename__ = 'groups'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    users = db.relationship('User', secondary='group_users', backref='groups')

    def __repr__(self):
        return f'<Group {self.id} - {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "users": [user.serialize() for user in self.users],
        }

class GroupUser(db.Model):

    __tablename__ = 'group_users'
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    def __repr__(self):
        return f'<GroupUser {self.group_id}>'

class Account(db.Model):

    __tablename__ = 'accounts'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(60))  # (bank, PayPal, etc.)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='accounts')

    def __repr__(self):
        return f'<Account {self.type}>'

class Transactions(db.Model):

    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    amount = db.Column(db.Float)
    origin_account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    origin_account = db.relationship('Account', foreign_keys=[origin_account_id])
    destination_account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    destination_account = db.relationship('Account', foreign_keys=[destination_account_id])

    def __repr__(self):
        return f'<Transactions {self.id}>'

class PaymentStatus(db.Model):

    __tablename__ = 'payment_statuses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))  # (pending, paid, reimbursed, etc.)
    payment_id = db.Column(db.Integer, db.ForeignKey('payments.id'))
    payment = db.relationship('Payment', backref='payment_status')

    def __repr__(self):
        return f'<PaymentStatus {self.name}>'

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(200))  # (email, text message, etc.)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='notifications')
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    event = db.relationship('Event', backref='notifications')

    def __repr__(self):
        return f'<Notification {self.type}>'

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(200))  # (payment, reimbursement, adjustment, etc.)
    payment_id = db.Column(db.Integer, db.ForeignKey('payments.id'))
    payment = db.relationship('Payment', backref='events')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='events')
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))
    group = db.relationship('Group', backref='events')

    def __repr__(self):
        return f'<Event {self.id} - {self.type} - {self.payment_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
            "payment_id": self.payment_id,
            "user_id": self.user_id,
            "group_id": self.group_id,
        }

class Comment(db.Model):

    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(300))
    payment_id = db.Column(db.Integer, db.ForeignKey('payments.id'))
    payment = db.relationship('Payment', backref='comments')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='comments')

    def __repr__(self):
        return f'<Comment {self.text}>'

class Tag(db.Model):

    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(140))
    payment_id = db.Column(db.Integer, db.ForeignKey('payments.id'))
    payment = db.relationship('Payment', backref='tags')
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))
    group = db.relationship('Group', backref='tags')

    def __repr__(self):
        return f'<Tag {self.id} - {self.name}>'