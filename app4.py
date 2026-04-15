import streamlit as st
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize LLM
# Make sure your .env file has GROQ_API_KEY=your_actual_api_key
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile"
)

# --- Agent Functions ---
def skin_diet_agent(gender: str, diet_type: str, skin_concern: str) -> str:
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

def men_skincare_agent(user_query: str) -> str:
    system_prompt = """
    You are an Elite Men's Grooming & Dermatological Consultant. 
    Men's skin is thicker, oilier, and subject to shaving irritation. Your advice must reflect this.

    ### STRUCTURE:
    1. **Top Homemade Remedies for [Concern]**
       - Focus on ingredients that penetrate thicker skin (e.g., Charcoal, Coffee grounds, Apple Cider Vinegar).
    2. **High-Performance Product Recommendations**
       - Suggest products that are non-greasy and "matte-finish."
       - Focus on 'Chemical Exfoliants' (Salicylic Acid) over 'Physical Scrubs.'
    3. **The 'Grooming Edge' (Pro Tips)**
       - Include advice on shaving technique, beard hygiene, and cold-water rinsing to close pores.

    ### STYLE:
    - Use direct, "no-nonsense" language.
    - Avoid overly complex 10-step routines; keep it efficient.
    """
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_query)
    ]
    
    response = llm.invoke(messages)
    return response.content

def skincare_expert_agent(user_concern: str) -> str:
    system_prompt = """
    You are an Elite Women's Skincare Expert. Use the following format strictly:

    ### Top Homemade Remedies for [Concern]
    (Include 5-6 natural remedies like Neem, Multani Mitti, etc.)

    ### Best Product Recommendations (OTC)
    (Suggest Ingredients like Salicylic Acid, Vitamin C, Retinol)

    ### Top Tips for Success
    (Crucial tips like Sunscreen, Patch testing, Consistency)
    """
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_concern)
    ]
    
    response = llm.invoke(messages)
    return response.content


# --- Streamlit Application UI ---
st.set_page_config(page_title="AI Skincare & Diet Clinic", layout="centered", page_icon="✨")

st.title("🌟 AI Skincare & Diet Clinic")
st.write("Welcome! Select an agent from the sidebar to get personalized skincare routines or diet advice.")

# Sidebar Navigation
st.sidebar.title("Select Your Agent")
agent_choice = st.sidebar.radio(
    "Choose a service below:",
    ("🥗 Diet Planner", "🧔 Men's Skincare Guide", "✨ Women's Skincare Guide")
)

st.divider()

# --- Section 1: Diet Planner ---
if agent_choice == "🥗 Diet Planner":
    st.header("Skin-Focused Diet Planner")
    st.write("Get a customized 1-day meal plan tailored to your gender, diet preference, and skin concern.")
    
    col1, col2 = st.columns(2)
    with col1:
        gender = st.selectbox("Gender", ["Male", "Female"])
    with col2:
        diet_type = st.selectbox("Diet Type", ["Vegetarian", "Non-Vegetarian"])
        
    skin_concern = st.text_input("What is your main skin concern? (e.g., Acne, Aging, Dryness, Eczema)")
    
    if st.button("Generate Diet Plan"):
        if not skin_concern:
            st.warning("Please enter your skin concern to proceed.")
        else:
            with st.spinner("Consulting the Elite Clinical Nutritionist..."):
                try:
                    result = skin_diet_agent(gender, diet_type, skin_concern)
                    st.success("Your plan is ready!")
                    st.markdown("### Your Custom Diet Plan")
                    st.write(result)
                except Exception as e:
                    st.error(f"An error occurred: {e}")

# --- Section 2: Men's Skincare ---
elif agent_choice == "🧔 Men's Skincare Guide":
    st.header("Men's Skincare & Grooming")
    st.write("Direct, no-nonsense advice tailored for thicker, oilier skin and grooming needs.")
    
    user_query = st.text_area("Describe your skin concern or grooming goals:")
    
    if st.button("Get Grooming Advice"):
        if not user_query:
            st.warning("Please describe your skin concern to proceed.")
        else:
            with st.spinner("Consulting the Elite Men's Grooming Consultant..."):
                try:
                    result = men_skincare_agent(user_query)
                    st.success("Your routine is ready!")
                    st.markdown("### Your Grooming Strategy")
                    st.write(result)
                except Exception as e:
                    st.error(f"An error occurred: {e}")

# --- Section 3: Women's Skincare ---
elif agent_choice == "✨ Women's Skincare Guide":
    st.header("Women's Skincare Expert")
    st.write("Get top home remedies, product recommendations, and success tips for your unique skin profile.")
    
    user_concern = st.text_area("What is your main skin concern? (e.g., Hyperpigmentation, Acne scars, Fine lines)")
    
    if st.button("Get Skincare Routine"):
        if not user_concern:
            st.warning("Please enter your skin concern to proceed.")
        else:
            with st.spinner("Consulting the Elite Women's Skincare Expert..."):
                try:
                    result = skincare_expert_agent(user_concern)
                    st.success("Your routine is ready!")
                    st.markdown("### Your Skincare Plan")
                    st.write(result)
                except Exception as e:
                    st.error(f"An error occurred: {e}")