import pandas as pd
import snowflake.connector as sf

snowflake_config = {
    'account': 'lpwzxkb-pk40285',
    'user': 'zakariabouachra',
    'password': 'Lilopipo09@'   
}
try:
        # Connexion à Snowflake
        connection = sf.connect(**snowflake_config)
        cs = connection.cursor()
        cs.execute('SELECT current_version()')
        row = cs.fetchone()
        print(f'Version: {row[0]}')
        print('Creating Warehouse ...')
        sql = "CREATE WAREHOUSE IF NOT EXISTS rcw_warehouse"
        cs.execute(sql)
        sql = "USE WAREHOUSE rcw_warehouse"
        cs.execute(sql)
        print('Creating Database ...')
        sql = "CREATE DATABASE IF NOT EXISTS rcw_database"
        cs.execute(sql)
        sql = "USE DATABASE rcw_database"
        cs.execute(sql)
        print('Creating Schema ...')
        sql = "CREATE SCHEMA IF NOT EXISTS rcw_schema"
        cs.execute(sql)
        sql = "USE SCHEMA rcw_schema"
        cs.execute(sql)
        print('Creating table ...')
        sql = ("CREATE OR REPLACE TABLE rcw_table" 
               "(id integer, comment string)")
        cs.execute(sql)
        sql = ("INSERT INTO rcw_table (id, comment)"
               "VALUES (1, 'My comment 1')")
        cs.execute(sql)
        sql = ("INSERT INTO rcw_table (id, comment)"
               "VALUES (2, 'My comment 2')")
        cs.execute(sql)
        sql = ("INSERT INTO rcw_table (id, comment)"
               "VALUES (3, 'My comment 3')")
        cs.execute(sql)
        sql = 'SELECT * FROM rcw_table'
        data = cs.execute(sql).fetchall()
        print('All data at one\n----------')
        print(data)
        print('Data one by one\n-----------------')
        for row in data:
                print(row)

finally:
        cs.close()