"""
JARVAS AI — Official Kling AI Motion Control 2.6 FastAPI Backend
Connects JARVAS AI directly to https://api-singapore.klingai.com/motion-control/kling-2.6
"""

import os
import time
import base64
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import jwt
import requests

app = FastAPI(
    title="JARVAS AI — Official Kling Motion Control Backend",
    description="Python FastAPI backend integrating official Kling AI Motion Control 2.6 API with secure JWT signing and task polling.",
    version="3.3.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kling AI Credentials from Backend Environment
KLING_API_KEY = os.environ.get("KLING_API_KEY", "")
KLING_ACCESS_KEY = os.environ.get("KLING_ACCESS_KEY", "")
KLING_SECRET_KEY = os.environ.get("KLING_SECRET_KEY", "")
KLING_BASE_ENDPOINT = os.environ.get("KLING_BASE_ENDPOINT", "https://api-singapore.klingai.com/motion-control/kling-2.6")

def get_kling_authorization_token() -> Optional[str]:
    """
    Returns signed Bearer token:
    1. If Access Key & Secret Key are present, generates HS256-signed JWT token.
    2. If direct KLING_API_KEY is present, returns that.
    """
    if KLING_ACCESS_KEY and KLING_SECRET_KEY:
        now = int(time.time())
        payload = {
            "iss": KLING_ACCESS_KEY,
            "exp": now + 1800,
            "nbf": now - 5
        }
        headers = {"alg": "HS256", "typ": "JWT"}
        return jwt.encode(payload, KLING_SECRET_KEY, algorithm="HS256", headers=headers)
    elif KLING_API_KEY:
        return KLING_API_KEY
    return None

class KlingMotionControlRequest(BaseModel):
    characterImage: str
    referenceVideo: str
    prompt: Optional[str] = "High-quality realistic motion transfer, cinematic lighting, faithful dance choreography"
    characterOrientation: Optional[str] = "video"
    keepAudio: Optional[bool] = True
    mode: Optional[str] = "pro"
    duration: Optional[int] = 15
    bodyMotion: Optional[bool] = True
    faceMotion: Optional[bool] = True
    headMotion: Optional[bool] = True
    cameraMotion: Optional[bool] = True

class KlingText2VideoRequest(BaseModel):
    prompt: str
    negativePrompt: Optional[str] = None
    model: Optional[str] = "kling-v1-6"
    duration: Optional[int] = 5
    mode: Optional[str] = "std"
    aspectRatio: Optional[str] = "16:9"
    cfgScale: Optional[float] = 0.5

class KlingImage2VideoRequest(BaseModel):
    image: str
    imageTail: Optional[str] = None
    prompt: Optional[str] = "Cinematic high-detail animation"
    negativePrompt: Optional[str] = None
    model: Optional[str] = "kling-v1-6"
    duration: Optional[int] = 5
    mode: Optional[str] = "std"
    cfgScale: Optional[float] = 0.5

@app.get("/api/kling/status")
def get_kling_status():
    has_credentials = bool(KLING_API_KEY or (KLING_ACCESS_KEY and KLING_SECRET_KEY))
    return {
        "configured": has_credentials,
        "baseUrl": "https://api-singapore.klingai.com",
        "authType": "JWT HS256 (AK/SK)" if (KLING_ACCESS_KEY and KLING_SECRET_KEY) else "Bearer API Key" if KLING_API_KEY else "Not configured",
        "supportedTypes": ["text2video", "image2video", "motion-control"],
        "models": ["kling-v1-6", "kling-v1-5", "kling-v1", "kling-v2-6"],
        "aspectRatios": ["16:9", "9:16", "1:1"],
        "durations": ["5", "10", "15", "30"]
    }

@app.post("/api/kling/v1/videos/text2video")
def submit_kling_text2video(req: KlingText2VideoRequest):
    token = get_kling_authorization_token()
    if not token:
        raise HTTPException(status_code=401, detail="KLING_API_KEY is not configured in backend environment.")

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "model_name": req.model or "kling-v1-6",
        "prompt": req.prompt,
        "mode": "pro" if req.mode == "pro" else "std",
        "duration": "10" if req.duration == 10 else "5",
        "aspect_ratio": req.aspectRatio if req.aspectRatio in ["16:9", "9:16", "1:1"] else "16:9"
    }
    if req.negativePrompt:
        payload["negative_prompt"] = req.negativePrompt
    if req.cfgScale is not None:
        payload["cfg_scale"] = req.cfgScale

    endpoint = "https://api-singapore.klingai.com/v1/videos/text2video"
    try:
        resp = requests.post(endpoint, headers=headers, json=payload, timeout=45)
        data = resp.json()
        if resp.status_code == 200 and data.get("code") == 0:
            task_info = data.get("data", {})
            return {
                "success": True,
                "type": "text2video",
                "taskId": task_info.get("task_id"),
                "status": task_info.get("task_status", "submitted")
            }
        else:
            raise HTTPException(status_code=resp.status_code, detail=data.get("message", "Kling text-to-video request failed"))
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to communicate with Kling API: {str(e)}")

@app.post("/api/kling/v1/videos/image2video")
def submit_kling_image2video(req: KlingImage2VideoRequest):
    token = get_kling_authorization_token()
    if not token:
        raise HTTPException(status_code=401, detail="KLING_API_KEY is not configured in backend environment.")

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "model_name": req.model or "kling-v1-6",
        "image": req.image,
        "prompt": req.prompt or "High-quality realistic video animation",
        "mode": "pro" if req.mode == "pro" else "std",
        "duration": "10" if req.duration == 10 else "5"
    }
    if req.imageTail:
        payload["image_tail"] = req.imageTail
    if req.negativePrompt:
        payload["negative_prompt"] = req.negativePrompt
    if req.cfgScale is not None:
        payload["cfg_scale"] = req.cfgScale

    endpoint = "https://api-singapore.klingai.com/v1/videos/image2video"
    try:
        resp = requests.post(endpoint, headers=headers, json=payload, timeout=45)
        data = resp.json()
        if resp.status_code == 200 and data.get("code") == 0:
            task_info = data.get("data", {})
            return {
                "success": True,
                "type": "image2video",
                "taskId": task_info.get("task_id"),
                "status": task_info.get("task_status", "submitted")
            }
        else:
            raise HTTPException(status_code=resp.status_code, detail=data.get("message", "Kling image-to-video request failed"))
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to communicate with Kling API: {str(e)}")

@app.post("/api/kling/motion-control")
def submit_kling_motion_control(req: KlingMotionControlRequest):
    token = get_kling_authorization_token()
    if not token:
        raise HTTPException(
            status_code=401,
            detail="KLING_API_KEY is not configured in backend environment."
        )

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    kling_payload = {
        "model_name": "kling-v2-6",
        "image": req.characterImage,
        "video": req.referenceVideo,
        "prompt": req.prompt or "A realistic performance following the exact reference choreography",
        "character_orientation": req.characterOrientation or "video",
        "keep_original_sound": req.keepAudio if req.keepAudio is not None else True,
        "mode": "pro" if req.mode == "pro" else "std",
        "duration": str(min(req.duration or 15, 30)),
        "body_motion": req.bodyMotion,
        "face_motion": req.faceMotion,
        "head_motion": req.headMotion,
        "camera_motion": req.cameraMotion,
    }

    try:
        endpoint = "https://api-singapore.klingai.com/motion-control/kling-2.6"
        resp = requests.post(endpoint, headers=headers, json=kling_payload, timeout=45)
        data = resp.json()

        if resp.status_code == 200 and data.get("code") == 0:
            task_info = data.get("data", {})
            return {
                "success": True,
                "type": "motion-control",
                "taskId": task_info.get("task_id"),
                "status": task_info.get("task_status", "submitted"),
                "createdAt": task_info.get("created_at"),
            }
        else:
            error_code = data.get("code", resp.status_code)
            error_msg = data.get("message", resp.text)
            if error_code in [1001, 1002, 402] or "credit" in error_msg.lower() or "balance" in error_msg.lower():
                raise HTTPException(status_code=402, detail=f"Insufficient Kling AI account credits: {error_msg}")
            raise HTTPException(status_code=resp.status_code, detail=f"Kling API error [{error_code}]: {error_msg}")
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to communicate with Kling API: {str(e)}")

@app.get("/api/kling/task/{task_id}")
def query_kling_task(task_id: str, type: Optional[str] = ""):
    token = get_kling_authorization_token()
    if not token:
        raise HTTPException(status_code=401, detail="KLING_API_KEY is not configured.")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    endpoints = []
    if type == "text2video":
        endpoints = [f"https://api-singapore.klingai.com/v1/videos/text2video/{task_id}"]
    elif type == "image2video":
        endpoints = [f"https://api-singapore.klingai.com/v1/videos/image2video/{task_id}"]
    elif type == "motion-control":
        endpoints = [f"https://api-singapore.klingai.com/motion-control/kling-2.6/{task_id}"]
    else:
        endpoints = [
            f"https://api-singapore.klingai.com/motion-control/kling-2.6/{task_id}",
            f"https://api-singapore.klingai.com/v1/videos/text2video/{task_id}",
            f"https://api-singapore.klingai.com/v1/videos/image2video/{task_id}"
        ]

    last_err = None
    for query_url in endpoints:
        try:
            resp = requests.get(query_url, headers=headers, timeout=20)
            data = resp.json()

            if resp.status_code == 200 and (data.get("code") == 0 or data.get("data")):
                task_data = data.get("data", {})
                status = task_data.get("task_status", "processing")
                
                video_url = None
                if status == "succeed":
                    works = task_data.get("task_result", {}).get("videos", [])
                    if works and len(works) > 0:
                        video_url = works[0].get("url")
                    elif task_data.get("task_result", {}).get("video_url"):
                        video_url = task_data.get("task_result", {}).get("video_url")

                return {
                    "success": True,
                    "taskId": task_id,
                    "status": status,
                    "videoUrl": video_url,
                    "progress": 100 if status == "succeed" else 55 if status == "processing" else 20,
                    "errorMessage": task_data.get("task_status_msg") if status == "failed" else None
                }
            else:
                last_err = data.get("message")
        except requests.RequestException as e:
            last_err = str(e)

    raise HTTPException(status_code=404, detail=last_err or "Kling task not found")

@app.get("/")
def root():
    return {
        "app": "JARVAS AI Kling Motion Control Engine",
        "provider": "Official Kling AI Developer Platform",
        "version": "2.6",
        "status": "online"
    }
