from flask import Flask 
from flask_session import Session

from login.login import auth_blueprint

from Warehouse.readWarehouse import warehouse_read
from Warehouse.deleteWarehouse import del_warehouse
from Warehouse.createWarehouse import warehouse_insert
from Warehouse.updateWarehouse import warehouse_update

from Database.createDB import database_insert
from Database.deleteDB import database_del
from Database.readDB import database_read
from Database.updateDB import database_update

from Schema.createSchema import schema_insert
from Schema.deleteSchema import schema_del
from Schema.readSchema import schema_read
from Schema.updateSchema import schema_update

from Table.createTable import table_insert
from Table.deleteTable import table_del
from Table.readTable import table_read
from Table.updateTable import table_update

from Table.data.createData import data_insert
from Table.data.readData import data_read

from Table.column.createColumn import column_insert
from Table.column.deleteColumn import column_del
from Table.column.readColumn import column_read
from Table.column.updateColumn import column_update

from Table.analyse.analyse import table_analyse

from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'lilopipo09@'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(days=365)
jwt = JWTManager(app)

app.config['SESSION_TYPE'] = 'filesystem' 
app.config['SESSION_PERMANENT'] = True  
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=365) 
Session(app)

#route Login
app.register_blueprint(auth_blueprint, url_prefix='/auth')
#route Warehouse
app.register_blueprint(warehouse_read, url_prefix='/read')
app.register_blueprint(del_warehouse, url_prefix='/del')
app.register_blueprint(warehouse_update, url_prefix='/update')
app.register_blueprint(warehouse_insert, url_prefix='/insert')
#route Database
app.register_blueprint(database_read, url_prefix='/read')
app.register_blueprint(database_del, url_prefix='/del')
app.register_blueprint(database_update, url_prefix='/update')
app.register_blueprint(database_insert, url_prefix='/insert')
#route Schema
app.register_blueprint(schema_read, url_prefix='/read')
app.register_blueprint(schema_del, url_prefix='/del')
app.register_blueprint(schema_update, url_prefix='/update')
app.register_blueprint(schema_insert, url_prefix='/insert')
#route Table 
app.register_blueprint(table_read, url_prefix='/read')
app.register_blueprint(table_del, url_prefix='/del')
app.register_blueprint(table_update, url_prefix='/update')
app.register_blueprint(table_insert, url_prefix='/insert')
app.register_blueprint(table_analyse, url_prefix='/analyse')
#route Data
app.register_blueprint(data_read, url_prefix='/read')
app.register_blueprint(data_insert, url_prefix='/insert')
#route Column
app.register_blueprint(column_read, url_prefix='/read')
app.register_blueprint(column_del, url_prefix='/del')
app.register_blueprint(column_update, url_prefix='/update')
app.register_blueprint(column_insert, url_prefix='/insert')

if __name__ == '__main__':
    app.run(debug=True)