from langchain.llms import HuggingFacePipeline
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
import torch

class DeepSeekLLM:
    def __init__(self):
        self.model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"
        self.tokenizer = None
        self.model = None
        self.pipeline = None
        self.llm = None
        
    def initialize(self):
        """初始化DeepSeek模型"""
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            torch_dtype=torch.float16,
            device_map="auto",
        )

        generation_config = {
            "max_new_tokens": 350,
            "temperature": 0.6,
            "top_p": 0.9,
            "repetition_penalty": 1.1,
            "do_sample": True,
            "pad_token_id": self.tokenizer.eos_token_id,
            "eos_token_id": self.tokenizer.eos_token_id
        }

        self.pipeline = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            **generation_config
        )

        self.llm = HuggingFacePipeline(pipeline=self.pipeline)
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
