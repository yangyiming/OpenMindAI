from llmTool import chat
from chromaTool import getCollection, truncate_text
from mysqlTool import query_by_id
import os


def query_knowledge_base(user_query):
    # 1. 获取 ChromaDB 集合
    collection = getCollection('my_collection')
    
    # 2. 查询相关文档
    results = collection.query(
        query_texts=[user_query],
        n_results=3  # 返回最相关的3个结果
    )
    
    # 3. 获取相关文档内容
    # related_docs = []
    # for doc_id in results['ids'][0]:
    #     # 从 MySQL 获取完整文档内容
    #     mysql_id = doc_id.split('_')[0]  # 提取原始文档ID
    #     doc = query_by_id('my_file_document', mysql_id)
    #     if doc:
    #         related_docs.append(doc['csv_content'])
    documents = results['documents'][0]
    response = chat(user_query,documents)
    return response

if __name__ == "__main__":
    while True:
        user_query = input("请输入您的问题（输入'退出'结束）：")
        if user_query.lower() in ['退出', 'exit']:
            break
            
        answer = query_knowledge_base(user_query)
        print("\n" + "="*50 + "\n")
