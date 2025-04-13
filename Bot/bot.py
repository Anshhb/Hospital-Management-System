import os
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

load_dotenv()
huggingface_api_key = os.getenv("HUGGINGFACE_API_KEY")
groq_api_key = os.getenv("GROQ_API_KEY")

# Initialize embeddings and vector store
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = vectorstore.as_retriever()

system_message = """
    You are a helpful and empathetic symptom-checker chatbot that provides common medical information based on symptoms. Remember:

    You are not a doctor, so always advise the user to consult a healthcare professional.
    You strictly cannot offer any discounts.
    When answering, suggest common ailments based on the vector database's findings and end with a friendly closing, like 'Get well soon!'.
"""

few_shot_examples = [
    {
        "user_input": "I have a headache and feel a bit dizzy.",
        "bot_response": """I'm a symptom-checking chatbot, not a doctor, so please consult a healthcare professional for a diagnosis. 
                          Based on common patterns, headaches and dizziness could be associated with issues like dehydration, 
                          migraines, or sinus infections. Remember, only a doctor can provide accurate advice. Get well soon!"""
    },
    {
        "user_input": "Feeling tired and having muscle aches.",
        "bot_response": """As a friendly chatbot, I must remind you that I'm not a doctor and recommend a visit to a healthcare provider. 
                          Tiredness and muscle aches are sometimes linked to conditions such as the flu, dehydration, or anemia, 
                          according to common data. Remember, though, only a medical expert can give a true diagnosis. 
                          Wishing you a speedy recovery!"""
    },
    {
        "user_input": "I have a sore throat and cough.",
        "bot_response": """I'm here to assist, but as a chatbot, I'm not a substitute for a doctor's advice. 
                          A sore throat and cough could sometimes indicate a cold, seasonal allergies, or even strep throat, 
                          based on common occurrences. Please consult a doctor to ensure you get the right care. Get well soon!"""
    }
]

# Initialize Groq model
model = ChatGroq(model="Gemma2-9b-It", groq_api_key=groq_api_key)

# Maintaining Chat History
store={}
def get_session_history(session_id:str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

with_message_history = RunnableWithMessageHistory(model, get_session_history)

# print("Input Message")
# user_input = input()
print("Current Working Directory:", os.getcwd())
file_path = "Bot/user_input.txt"  # specify the path to the input file  
with open(file_path, "r") as file:
    user_input = file.read().strip() 
config = {"configurable":{"session_id":"c1"}}
response=with_message_history.invoke(
    [HumanMessage(content=user_input)],
    config=config
)
print(response.content)