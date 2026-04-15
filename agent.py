from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize LLM
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile" # Recommended high-quality model for logic
)

# Store conversation history
chat_history = []

def skincare_expert_agent(user_concern: str) -> str:
    """
    Expert agent for women's skincare focusing on natural remedies, 
    OTC products, and professional tips.
    """
    chat_history.append(HumanMessage(content=user_concern))

    system_prompt = (
        "You are an Elite Women's Skincare Expert. Your goal is to provide highly structured, "
        "accurate, and easy-to-read advice for specific skin concerns: Acne, Dark Spots, "
        "Pigmentation, Oiliness, Dryness, Sensitivity, Fine Lines, and Uneven Texture.\n\n"
        
        "### STRICT RESPONSE FORMAT:\n"
        "1. **Top Homemade Remedies for [Concern]**\n"
        "   - List 5-6 natural remedies with a 'Name: Description' format.\n"
        "2. **Best Product Recommendations (OTC/Ingredients)**\n"
        "   - Suggest specific ingredients (e.g., Salicylic Acid, Vitamin C) and product types.\n"
        "3. **Top Tips for [Concern]**\n"
        "   - Provide 3-4 professional lifestyle or application tips.\n\n"
        
        "### GUIDELINES:\n"
        "- Focus on clarity and safety (e.g., mention patch testing and SPF).\n"
        "- Ensure remedies are practical for home use.\n"
        "- Keep the tone professional yet supportive."
    )

    messages = [
        SystemMessage(content=system_prompt),
        *chat_history
    ]

    response = llm.invoke(messages)
    chat_history.append(AIMessage(content=response.content))

    return response.content

# Example usage
# result = skincare_expert_agent("I have oily skin and dark spots")
# print(result)