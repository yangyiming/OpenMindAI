from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments,Trainer, DataCollatorForLanguageModeling,BitsAndBytesConfig
from peft import LoraConfig, get_peft_model
from datasets import load_dataset
from accelerate import Accelerator
import torch
accelerator = Accelerator()

# 1. 加载基础模型
model_name = "deepseek-ai/deepseek-llm-7b-base"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    torch_dtype=torch.float16   # 使用半精度减少内存占用
)
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# 2. 配置LoRA
lora_config = LoraConfig(
    r=8,  # 秩
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],  # 目标注意力层
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # 显示可训练参数占比

# 3. 准备数据
dataset = load_dataset("json", data_files="train_data.json")["train"]

def format_fn(example):
      # 更清晰的模板 + 添加EOS Token
    text = (
        "### Instruction:\n{instruction}\n\n"
        "### Response:\n{response}{eos_token}"
    ).format(
        instruction=example["instruction"],
        response=example["response"],
        eos_token=tokenizer.eos_token  # 明确结束
    )
    
    # 分词时统一处理
    return tokenizer(
        text,
        truncation=True,
        max_length=512,
        padding="max_length"  # 保证批量训练时长度一致
    )

dataset = dataset.map(format_fn, batched=True)

# 4. 训练配置
training_args = TrainingArguments(
    output_dir="./results",
    per_device_train_batch_size=4,
    gradient_accumulation_steps=2,
    learning_rate=2e-5,
    num_train_epochs=3,
    fp16=True,
    logging_steps=50,
    save_strategy="epoch"
)

# 5. 开始训练
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False)
)
trainer.train()

# 6. 保存适配器
model.save_pretrained("lora_adapter") 