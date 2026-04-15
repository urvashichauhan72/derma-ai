import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    load_dotenv(r'c:\Users\vikas\Downloads\dermaia mini project\.env')
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    db = client.get_database("derma_db")
    
    try:
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
        print(history)
    except Exception as e:
        print("ERROR:", type(e), e)

asyncio.run(main())
