from llm.openai_api_llm import OpenAIApiLLM
# from llm.deepseek_llm import DeepSeekLLM

# 初始化OpenAI LLM
llm = OpenAIApiLLM()
conversation = llm.create_conversation_chain()

# llm = DeepSeekLLM()
# conversation = DeepSeekLLM().create_conversation_chain()


# ai回复
def chat(input='', knowledge:list[str]=None):
    if not input.strip():
        print("请输入有效内容")
        return "请输入有效内容"
    
    # 构建包含背景知识的输入
    context = {
        "input": input,
        "knowledge": "\n".join(knowledge) if knowledge else ""
    }
    
    # 调用对话链生成回复
    try:
        response = conversation.run(context)
        
        
        print(f"\n助手：{response}")
        return response
    except Exception as e:
        print(f"生成回复时出错: {str(e)}")
        return f"生成回复时出错: {str(e)}"
