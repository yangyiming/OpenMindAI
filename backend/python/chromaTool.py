import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
import os
from transformers import AutoTokenizer,AutoConfig

# 全局变量缓存tokenizer和config
_tokenizer = None
_config = None
_max_length = None

def load_tokenizer():
    global _tokenizer, _config, _max_length
    if _tokenizer is None or _config is None:
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        _tokenizer = AutoTokenizer.from_pretrained(model_name)
        _config = AutoConfig.from_pretrained(model_name)
        # 获取上下文最大的token长度
        config_dict = _config.to_dict()
        _max_length = config_dict['max_position_embeddings']
    return _tokenizer, _config, _max_length
# 获取集合名称 或者创建集合
def getCollection(collectionName:str):
  tokenizer, config, max_length = load_tokenizer()
  # Initialize embedding function
  model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
  embedding_function = SentenceTransformerEmbeddingFunction(model_name=model_name)
  # 创建一个新的数据库或连接到已存在的数据库
  client = chromadb.Client()
  # 使用持久化客户端
  # 原代码中的相对路径  
  relative_path = "./chroma_db"
  # 方法1：直接组合绝对路径（推荐）
  full_path = os.path.abspath(relative_path)
  print(f"完整存储路径：{full_path}")
  client = chromadb.PersistentClient(path=relative_path)  # 指定存储路径
  # 获取所有集合名称
  existing_collections = [col for col in client.list_collections()]
  if collectionName in existing_collections:
      print("✅ 集合已存在")
      collection = client.get_collection(
          name=collectionName,
          embedding_function=embedding_function
      )
  else:
      print("🆕 集合不存在，正在创建")
      collection = client.create_collection(
          name=collectionName,
          embedding_function=embedding_function
      )
  return collection

# 使用内置截断机制
# 通过encode_plus()的max_length和truncation=True参数，利用Hugging Face内置的截断策略，比手动切片更安全可靠
def truncate_text(text: str) -> str:
    """截断文本至指定token数（基于特定分词器）"""
    tokenizer, config, max_length = load_tokenizer()
    # 编码时添加return_overflowing_tokens可查看溢出部分（可选）
    encoded = tokenizer.encode_plus(
        text,
        max_length=max_length,
        truncation=True,
        return_overflowing_tokens=False,
        return_tensors=None
    )
    # 直接解码截断后的文本
    return tokenizer.decode(encoded.input_ids, skip_special_tokens=True)

# 文档按照128个token分割成多个块
def split_document_into_token_chunks(document: str) -> list:
    """
    将文档列表按指定token数切分成块
    :param document: 每个文档是一个字符串
    :param chunk_size: 每个块的token数（默认128）
    :return: 切分后的块列表
    """
    tokenizer, config, max_length = load_tokenizer()
    # 1. 将文档拼接成一个长字符串
    full_text = document
    
    # 2. 使用分词器将长字符串编码为token
    tokens = tokenizer.encode(full_text, add_special_tokens=False)
    
    # 3. 按chunk_size切分token
    chunks = [
        tokens[i:i + max_length] for i in range(0, len(tokens), max_length)
    ]
    
    # 4. 将token块解码为字符串
    chunk_texts = [
        tokenizer.decode(chunk, skip_special_tokens=True) for chunk in chunks
    ]
    
    return chunk_texts
def tokenizer_test():
    text = "这是一个测试句子。"
    tokens = tokenizer.tokenize(text)
    token_ids = tokenizer.encode(text)
    print("Tokens:", tokens) 
    print("Token IDs:", token_ids)
