
import pandas as pd
import mysql.connector
from mysql.connector import Error
# 配置信息
db_config = {
    "host": "localhost",  # 数据库主机地址
    "user": "root",  # 数据库用户名
    "password": "y1angyiming",  # 数据库密码
    #  "password": "",  # 数据库密码
    "database": "chromadb"  # 数据库名
}
def read_csv_file(file_path):
    """读取 CSV 文件内容并返回字符串"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            csv_content = file.read()
        print("CSV 文件内容已读取！")
        return csv_content
    except Exception as e:
        print(f"读取 CSV 文件时发生错误：{e}")
        return None
    
def connect_to_mysql():
    """连接到 MySQL 数据库并返回连接对象"""
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            print("成功连接到 MySQL 数据库！")
            return conn
    except Error as e:
        print(f"连接到 MySQL 数据库时发生错误：{e}")
    return None


def create_table(conn, table_name):
    """创建表（如果表不存在）"""
    cursor = conn.cursor()
    create_table_query = f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        csv_content TEXT,
        source TEXT
    )
    """
    cursor.execute(create_table_query)
    print(f"表 {table_name} 创建成功（如果不存在）！")


def insert_csv_content(conn, table_name, csv_content,source):
    """将 CSV 文件内容插入到表中"""
    cursor = conn.cursor()
    insert_query = f"""
    INSERT INTO {table_name} (csv_content,source) VALUES (%s,%s)
    """
    cursor.execute(insert_query, (csv_content,source))
    conn.commit()
    insert_id = cursor.lastrowid
    print("CSV 文件内容已成功存储到数据库中！")
    return insert_id
 



def query_by_id(table_name, id):
    conn = mysql.connector.connect(**db_config)
    """通过 id 查询表中的数据"""
    cursor = conn.cursor(dictionary=True)  # 使用 dictionary=True 返回字典格式的结果
    query = f"""
    SELECT * FROM {table_name} WHERE id = %s
    """
    cursor.execute(query, (id,))
    result = cursor.fetchone()  # 获取查询结果
    if result:
        print(f"查询到的数据：{result}")
        return result
    else:
        print(f"未找到 ID 为 {id} 的数据。")
        return None
    

def query_all_data(conn, table_name):
    """查询表中的所有数据并返回结果"""
    cursor = conn.cursor(dictionary=True)  # 使用 dictionary=True 返回字典格式的结果
    query = f"""
    SELECT * FROM {table_name}
    """
    cursor.execute(query)
    results = cursor.fetchall()  # 获取所有查询结果
    cursor.close()  # 关闭游标

    if results:
        print(f"查询到 {len(results)} 条数据。")
        return results
    else:
        print("表中没有数据。")
        return []