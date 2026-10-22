from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import shutil
import os
import cv2

from explainability.gradcam import generate_gradcam
from preprocessing.mri_preprocess import preprocess_mri
from api.routes import mri_model
from config.settings import DEVICE

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/explain/mri")
async def explain_mri(file: UploadFile = File(...)):
    image_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        original_image = cv2.imread(image_path)
        if original_image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        image_tensor = preprocess_mri(image_path, DEVICE)
        output_path = generate_gradcam(mri_model, image_tensor, original_image)

        return FileResponse(
            output_path,
            media_type="image/png"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
