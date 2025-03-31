# from llm.deepseek_llm import DeepSeekLLM
from llm.openai_api_llm import OpenAIApiLLM

# 使用封装好的方法创建对话链
# conversation = DeepSeekLLM().create_conversation_chain()
conversation = OpenAIApiLLM().create_conversation_chain()

# 对话演示
def chat():
    print("AI助手已启动，输入'退出'结束对话")
    while True:
        user_input = input("你: ")
        if user_input.lower() in ['退出', 'exit', 'quit']:
            break
            
        response = conversation.run(input=user_input)
        print(f"AI助手: {response}")

if __name__ == "__main__":
    chat()
