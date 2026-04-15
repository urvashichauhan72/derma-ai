import streamlit as st
from diet_agent import skin_diet_agent

st.set_page_config(page_title="DermAI Nutrition", layout="wide")

st.title("🥗 DermAI: Skin-Nutrition Planner")
st.write("Fuel your skin from the inside out with a diet tailored to your lifestyle.")

# Layout for User Selection
col1, col2, col3 = st.columns(3)

with col1:
    gender = st.selectbox("Select Gender", ["Man", "Woman"])

with col2:
    diet_type = st.selectbox("Dietary Preference", ["Vegetarian", "Non-Vegetarian"])

with col3:
    concern = st.selectbox("Primary Skin Concern", 
                          ["Acne", "Dark Spots", "Anti-Aging", "Dryness", "Oily Skin"])

if st.button("Generate My Meal Plan"):
    with st.spinner("Calculating nutritional values..."):
        # Call the diet agent
        plan = skin_diet_agent(gender, diet_type, concern)
        
        st.divider()
        st.markdown(f"### 📋 1-Day {diet_type} Plan for {concern}")
        st.markdown(plan)
        
        st.download_button(
            label="Download Diet Plan",
            data=plan,
            file_name=f"{gender}_skin_diet.txt"
        )