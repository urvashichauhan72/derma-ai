import streamlit as st
from men_agent import men_skincare_agent

st.set_page_config(page_title="DermAI Men", layout="wide")

# Custom "Masculine" Aesthetic CSS
st.markdown("""
    <style>
    .main { background-color: #1e1e1e; color: #ffffff; }
    .stTextInput>div>div>input { background-color: #2d2d2d; color: white; }
    .stButton>button { background-color: #3b3b3b; color: #00ffcc; border: 1px solid #00ffcc; }
    </style>
    """, unsafe_allow_html=True)

st.title("🛡️ DermAI: Men's Advanced Grooming")
st.write("Engineered for thicker skin and high-performance results.")

concern = st.text_input("What is your primary skin concern? (e.g., oily skin, beard acne, dark spots)")

if st.button("Build My Routine"):
    if concern:
        with st.spinner("Calculating formula..."):
            routine = men_skincare_agent(concern)
            
            # Using a container for a "Dashboard" feel
            with st.container():
                st.markdown("### 📋 Your Grooming Blueprint")
                st.markdown(routine)
                
                st.download_button(
                    label="Download Blueprint",
                    data=routine,
                    file_name="mens_grooming_plan.txt"
                )