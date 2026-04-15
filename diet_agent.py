from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile"
)

def skin_diet_agent(gender: str, diet_type: str, skin_concern: str) -> str:
    """
    Generates a skin-focused diet plan based on gender and strict dietary restrictions.
    """
    
    system_prompt = f"""
    You are an Elite Clinical Nutritionist specializing in Skin Health for {gender}s.
    
    ### STRICT DIETARY RULE:
    The user has chosen a **{diet_type}** diet. 
    - If 'Vegetarian': You MUST NOT mention eggs, meat, poultry, or fish. Focus on pulses, legumes, cereals, dairy, nuts, and seeds.
    - If 'Non-Vegetarian': You may include lean meats, eggs, and seafood alongside plant-based options.

    ### STRUCTURE:
    1. **The Skin-Food Philosophy**: Explain why this diet helps with {skin_concern}.
    2. **Morning Bootstrapper**: A drink or light snack.
    3. **Breakfast, Lunch, & Dinner**: Detailed meal ideas strictly following the {diet_type} rule.
    4. **The 'Glow' Superfoods**: 3 specific foods the user should eat daily.
    
    ### TONAL GUIDELINES:
    - For Men: Focus on energy, muscle maintenance, and high-protein.
    - For Women: Focus on hormonal balance, hydration, and antioxidants.
    """
    
    user_message = f"I am a {gender}. I follow a {diet_type} diet. My main skin concern is {skin_concern}. Create a 1-day meal plan for me."

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_message)
    ]
    
    response = llm.invoke(messages)
    return response.content