from chromaTool import getCollection,truncate_text,split_document_into_token_chunks
from mysqlTool import read_csv_file,connect_to_mysql,create_table,query_by_id,query_all_data
def main(documents):
    collection = getCollection('my_collection')
    texts = []
    sources = []
    ids = []
    for doc in documents:
        chunks = split_document_into_token_chunks(doc.get("content", ""))
        source = doc.get("source", "")
        for index,chunk in enumerate(chunks):
            id = doc.get("id", "")
            texts.append(chunk)
            sources.append({source:source})
            id = str(id)+'_'+str(index)
            ids.append(id)
    # ids = [doc.get("id", "") for doc in documents]
    # 插入数据
    collection.upsert(
        documents=texts,
        metadatas=sources,
        ids=ids
    ) 
    # 写入后立即查询
    print(collection.count())  # 应该返回 2
    print(collection.get())
