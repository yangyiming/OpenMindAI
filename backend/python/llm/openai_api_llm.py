from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from typing import Optional
import os

api_key = os.getenv("OPEN_API_KEY")
base_url = os.getenv("OPEN_BASE_URL")
model_name = os.getenv("OPEN_MODEL_NAME")

class OpenAIApiLLM:
    def __init__(self, base_url: str=base_url, api_key: str=api_key):
        """
        初始化OpenAI兼容API模型
        
        参数:
            base_url: API基础地址
            api_key: 认证密钥
        """
        self.base_url = base_url 
        self.api_key = api_key
        self.llm = None
        
    def initialize(self, model_name: str = model_name, temperature: float = 1.3):
        """
        初始化LLM实例
        
        参数:
            model_name: 模型名称
            temperature: 生成温度(默认0.6)
            max_tokens: 最大token数(默认350)
        """
        self.llm = ChatOpenAI(
            model_name=model_name,
            temperature=temperature,
            openai_api_base=self.base_url,
            openai_api_key=self.api_key
        )
        return self.llm

    def get_llm(self):
        """获取初始化的LLM实例"""
        if not self.llm:
            return self.initialize()
        return self.llm

    @staticmethod
    def get_default_prompt():
        """获取默认对话模板(支持背景知识)"""
        template = """<|system|>
你是一个专业的AI助手，正在进行多轮对话。请根据对话历史和背景知识提供有帮助的回答。

{knowledge}

对话历史:
{history}

<|user|>
{input}

<|assistant|>"""
        return PromptTemplate(
            input_variables=["history", "input", "knowledge"],
            template=template
        )

    @staticmethod 
    def get_default_memory():
        """获取默认记忆配置"""
        return ConversationBufferWindowMemory(
            memory_key="history",
            input_key="input"
        )
    
    def create_conversation_chain(self, prompt=None, memory=None, verbose=True):
        """创建完整的对话链
        
        参数:
            prompt: 自定义对话模板(默认使用get_default_prompt())
            memory: 自定义记忆系统(默认使用get_default_memory())
            verbose: 是否显示详细日志
        """
        llm = self.get_llm()
        prompt = prompt or self.get_default_prompt()
        memory = memory or self.get_default_memory()
        
        return LLMChain(
            llm=llm,
            prompt=prompt,
            memory=memory,
            verbose=verbose
        )
