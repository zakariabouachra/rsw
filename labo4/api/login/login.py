from flask import Blueprint, jsonify, request , session
import snowflake.connector
from flask_jwt_extended import create_access_token

global_user_info = {}

auth_blueprint = Blueprint('auth', __name__)

def get_global_user_info():
    return global_user_info

def set_global_user_info(user_info):
    global global_user_info
    global_user_info = user_info

@auth_blueprint.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        account = data['account']
        user = data['user']
        password = data['password']

        snowflake_config = {
            'account': account,
            'user': user,
            'password': password
        }

        connection = snowflake.connector.connect(**snowflake_config)
        cursor = connection.cursor()
        cursor.close()
        connection.close()

        session['user'] = user
        session['account'] = account
        session['password'] = password

        user_info = {'user': session['user'], 'account': session['account'], 'password': session['password']}

        set_global_user_info(user_info)

        current_user_info = user_info

        access_token = create_access_token(identity=current_user_info)

        return jsonify({'status': 'success', 'token': access_token})

    except Exception as e:
        return jsonify({'error': str(e)})
