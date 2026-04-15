import streamlit as st
from agent import skincare_expert_agent  # Assuming your logic is in skincare_agent.py

# Page Configuration
st.set_page_config(page_title="✨ GlowGuide: AI Skincare Expert", layout="wide")

# Custom Styling (Adding a bit of that cinematic/clean aesthetic)
st.markdown("""
    <style>
    .main { background-color: #fcfaf9; }
    .stTextArea textarea { font-family: 'Inter', sans-serif; font-size: 16px; }
    </style>
    """, unsafe_allow_html=True)

st.title("✨ GlowGuide: AI Skincare Expert")
st.write("Get professional routines for acne, dark spots, fine lines, and more—structured for both natural and clinical care.")

# Input Layout
col1, col2 = st.columns([2, 1])

with col1:
    concern = st.text_area("✍️ Describe your skin concerns", 
                          placeholder="Example: I have oily skin with persistent acne and dark spots on my cheeks...",
                          height=150)

with col2:
    st.info("💡 **Tip:** Mention your skin type (oily, dry, sensitive) and how long you've had the issue for better results.")

if st.button("🚀 Generate Skincare Routine"):
    if not concern.strip():
        st.warning("Please describe your skin concern first.")
    else:
        with st.spinner("🔬 Analyzing skin concerns and formulating routine..."):
            try:
                # Call the agent function
                routine = skincare_expert_agent(concern)

                st.divider()
                st.subheader("📜 Your Personalized Routine")
                
                # Display the output in a clean text area or markdown
                st.markdown(routine)

                st.download_button(
                    label="⬇️ Download Routine",
                    data=routine,
                    file_name="my_skincare_routine.txt",
                    mime="text/plain"
                )
            except Exception as e:
                st.error(f"Error connecting to agent: {e}")

# Sidebar for extra features
with st.sidebar:
    st.header("Expert Settings")
    st.write("Targeting:")
    st.checkbox("Acne & Breakouts", value=True)
    st.checkbox("Pigmentation & Dark Spots")
    st.checkbox("Anti-Aging / Fine Lines")
    st.divider()
    st.caption("Disclaimer: This is AI-generated advice. Consult a dermatologist for medical conditions.")