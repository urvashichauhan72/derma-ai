import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(r'c:\Users\vikas\Downloads\dermaia mini project\.env')
uri = os.getenv("MONGODB_URI")
print(f"Loaded URI: {uri}")

if uri:
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        db = client.get_database("derma_db")
        count = db.analyses.count_documents({})
        docs = list(db.analyses.find({}))
        print(f"Documents count: {count}")
        print(f"First doc: {docs[0] if docs else 'None'}")
    except Exception as e:
        print(f"Error connecting: {e}")
else:
    print("MONGODB_URI not found in environment.")
