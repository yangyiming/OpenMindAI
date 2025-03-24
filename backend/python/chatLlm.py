from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# 设置对话历史管理参数
max_history_length = 4  # 保留最近4轮对话
max_length = 2048      # 模型最大上下文长度

def build_prompt(history):
    """构建符合模型要求的对话格式"""
    system = "以下是与AI助手的对话。用户提出问题或指示，助手提供有帮助的回答。"
    prompt = system + "\n\n"
    for query, response in history:
        prompt += f"User: {query}\nAssistant: {response}\n"
    return prompt

def truncate_history(history, tokenizer, max_length):
    """截断过长的对话历史"""
    total_length = 0
    new_history = []
    for query, response in reversed(history):
        text = f"User: {query}\nAssistant: {response}\n"
        tokens = tokenizer(text, return_tensors="pt")["input_ids"]
        if total_length + tokens.shape[1] > max_length:
            break
        total_length += tokens.shape[1]
        new_history.insert(0, (query, response))
    return new_history

# 初始化对话历史
dialogue_history = []

print("欢迎使用DeepSeek聊天助手！输入'退出'结束对话。")
while True:
    # 获取用户输入
    user_input = input("\n用户：")
    
    if user_input.lower() in ["退出", "exit", "quit"]:
        print("再见！")
        break
        
    if not user_input.strip():
        print("请输入有效内容")
        continue

    # 添加用户输入到临时历史（等待生成回复）
    temp_history = dialogue_history + [(user_input, "")]
    
    # 构建提示
    truncated_history = truncate_history(temp_history, tokenizer, max_length)
    prompt = build_prompt(truncated_history)
    
    # 生成回复
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=500,
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
        pad_token_id=tokenizer.eos_token_id,
        eos_token_id=tokenizer.eos_token_id
    )
    
    # 解码并提取新回复
    full_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    new_response = full_text[len(prompt):].split("User:")[0].strip()
    
    # 更新对话历史（保留最近max_history_length轮对话）
    dialogue_history.append((user_input, new_response))
    dialogue_history = dialogue_history[-max_history_length:]
    
    # 打印AI回复
    print(f"\n助手：{new_response}")