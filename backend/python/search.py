from chromaTool import getCollection
collection = getCollection('my_collection')
# 通过 ID 查询
results = collection.get(ids=["doc1"])
print(results)

# 通过元数据查询
results = collection.get(where={"source": "web"})
print(results)

# 通过文档内容查询
results = collection.query(query_texts=["doc"])
print(results)