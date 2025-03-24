
from mysqlTool import (
    read_csv_file, 
    connect_to_mysql, 
    create_table, 
    insert_csv_content,
)
import os

def read_txt_file(txt_file_path):
    """读取TXT文件内容"""
    try:
        with open(txt_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            return content.strip()
    except Exception as e:
        print(f"读取TXT文件失败：{e}")
        return None

def store_file_to_mysql(file_path, table_name):
    """主函数：将文件内容存储到 MySQL 数据库中"""
    # 1. 检查文件类型
    file_name = os.path.basename(file_path)
    file_ext = os.path.splitext(file_path)[1].lower()
    
    if file_ext == '.csv':
        # 处理CSV文件
        csv_content = read_csv_file(file_path)
        if csv_content is None:
            print("CSV 文件读取失败，程序终止。")
            return
        content_type = 'csv'
        content_length = len(csv_content)
    elif file_ext == '.txt':
        # 处理TXT文件
        txt_content = read_txt_file(file_path)
        if txt_content is None:
            print("TXT 文件读取失败，程序终止。")
            return
        csv_content = (txt_content,)
        content_type = 'txt'
        content_length = len(txt_content)
    else:
        print(f"不支持的文件类型：{file_ext}")
        return

    # 2. 连接到 MySQL 数据库
    conn = connect_to_mysql()
    if conn is None:
        print("数据库连接失败，程序终止。")
        return

    try:
        # 3. 创建表（如果表不存在）
        create_table(conn, table_name)

        # 4. 插入文件内容
        insert_csv_content(
            conn, 
            table_name, 
            txt_content,
            'my'
        )

    except Exception as e:
        print(f"操作数据库时发生错误：{e}")
    finally:
        if conn.is_connected():
            conn.close()
            print("MySQL 连接已关闭！")

# 示例文件路径
# csv_file_path = "file/250306-解析线路梳理-Sheet1.csv"
csv_file_path = "file/无题.txt"
table_name = "my_file_document"

# 根据需要选择处理的文件类型
store_file_to_mysql(csv_file_path, table_name)
# store_file_to_mysql(txt_file_path, table_name)
