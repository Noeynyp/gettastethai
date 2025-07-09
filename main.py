from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Serve static files from the 'dist' folder (Vite build output) ...
app.mount("/", StaticFiles(directory="dist", html=True), name="static")
