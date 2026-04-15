import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import random
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
import os
from dotenv import load_dotenv

# Load environment variables from parent directory's .env
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

@asynccontextmanager
async def lifespan(app: FastAPI):
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        print("WARNING: MONGODB_URI not found in environment variables.")
        # Proceeding without database; endpoints relying on db will fail gracefully or raise 500
        yield
        return
        
    try:
        # Initialize MongoDB Client
        app.state.mongodb_client = AsyncIOMotorClient(mongodb_uri)
        app.state.db = app.state.mongodb_client.get_database("derma_db")
        print("Successfully connected to MongoDB Cloud.")
        yield
    finally:
        # Close the connection shutting down
        if hasattr(app.state, "mongodb_client"):
            app.state.mongodb_client.close()
            print("MongoDB connection closed.")

app = FastAPI(title="DermaIA API", version="1.0.0", lifespan=lifespan)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile"
)


# ─── Request / Response Models ───

class MenSkincareRequest(BaseModel):
    concern: str

class WomenSkincareRequest(BaseModel):
    concern: str

class DietPlanRequest(BaseModel):
    gender: str
    dietType: str
    skinConcern: str

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class DermaChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

class ReportResponse(BaseModel):
    id: str
    report: str
    date: str
    score: int
    type: str
    summary: str

class ChatResponse(BaseModel):
    reply: str
    
class HistoryItemResponse(BaseModel):
    id: str
    type: str
    date: str
    summary: str
    score: int


# ─── Agent Functions (from app4.py prompts) ───

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


def women_skincare_agent(user_concern: str) -> str:
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


def derma_specialist_agent(user_message: str, history: list[ChatMessage]) -> str:
    system_prompt = """
    You are DermaIA — an Elite AI Dermatology Specialist with decades of clinical expertise.
    
    ### YOUR CAPABILITIES:
    - Diagnose common skin conditions from descriptions
    - Recommend skincare routines (both homemade and clinical)
    - Suggest diet modifications for skin health
    - Provide grooming advice for all genders
    - Answer questions about ingredients, products, and treatments
    
    ### RESPONSE STYLE:
    - Be warm yet professional — like a trusted dermatologist
    - Use markdown formatting for readability (headers, bold, bullet points)
    - If the user describes symptoms, provide possible conditions but ALWAYS recommend consulting a real dermatologist for serious concerns
    - Keep responses concise but thorough
    - Ask clarifying questions when needed
    
    ### SAFETY:
    - Never diagnose serious medical conditions definitively
    - Always include disclaimers for prescription-level treatments
    - Recommend professional consultation when appropriate
    """
    
    # Build message history for context
    messages = [SystemMessage(content=system_prompt)]
    
    for msg in history:
        if msg.role == "user":
            messages.append(HumanMessage(content=msg.content))
        else:
            from langchain_core.messages import AIMessage
            messages.append(AIMessage(content=msg.content))
    
    messages.append(HumanMessage(content=user_message))
    
    response = llm.invoke(messages)
    return response.content


# ─── API Endpoints ───

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "DermaIA API"}


async def save_analysis(db, type_str: str, report: str) -> dict:
    """Helper to save the generated analysis to MongoDB and return the complete record."""
    record = {
        "type": type_str,
        "date": datetime.utcnow().isoformat() + "Z",
        "summary": report[:200] + "...",
        "report": report,
        "score": random.randint(75, 95),
        "user_id": "1",  # Hardcoded for now
    }
    
    if db is not None:
        result = await db.analyses.insert_one(record)
        record["id"] = str(result.inserted_id)
    else:
        # Fallback if DB is not connected
        record["id"] = str(ObjectId())
        
    return record


@app.post("/api/men-skincare", response_model=ReportResponse)
async def men_skincare(req: MenSkincareRequest, request: Request):
    try:
        report = men_skincare_agent(req.concern)
        db = getattr(request.app.state, "db", None)
        record = await save_analysis(db, "mens-skincare", report)
        return ReportResponse(**record)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@app.post("/api/women-skincare", response_model=ReportResponse)
async def women_skincare(req: WomenSkincareRequest, request: Request):
    try:
        report = women_skincare_agent(req.concern)
        db = getattr(request.app.state, "db", None)
        record = await save_analysis(db, "womens-skincare", report)
        return ReportResponse(**record)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@app.post("/api/diet-plan", response_model=ReportResponse)
async def diet_plan(req: DietPlanRequest, request: Request):
    try:
        report = skin_diet_agent(req.gender, req.dietType, req.skinConcern)
        db = getattr(request.app.state, "db", None)
        record = await save_analysis(db, "diet", report)
        return ReportResponse(**record)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@app.post("/api/derma-chat", response_model=ChatResponse)
async def derma_chat(req: DermaChatRequest):
    try:
        reply = derma_specialist_agent(req.message, req.history)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@app.get("/api/history", response_model=list[HistoryItemResponse])
async def get_history(request: Request):
    db = getattr(request.app.state, "db", None)
    if db is None:
        return []
    
    cursor = db.analyses.find({"user_id": "1"}).sort("date", -1)
    history = []
    async for doc in cursor:
        history.append({
            "id": str(doc["_id"]),
            "type": doc["type"],
            "date": doc["date"],
            "summary": doc["summary"],
            "score": doc["score"],
        })
    return history


@app.get("/api/history/{analysis_id}")
async def get_analysis_result(analysis_id: str, request: Request):
    db = getattr(request.app.state, "db", None)
    if db is None:
        raise HTTPException(status_code=404, detail="Database not connected")
        
    try:
        obj_id = ObjectId(analysis_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid analysis ID")
        
    doc = await db.analyses.find_one({"_id": obj_id, "user_id": "1"})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    return {
        "id": str(doc["_id"]),
        "type": doc["type"],
        "date": doc["date"],
        "summary": doc["summary"],
        "report": doc["report"],
        "score": doc["score"],
        "recommendations": []
    }
