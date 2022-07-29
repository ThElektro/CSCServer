from re import sub
import PIL
from PIL import Image
import glob
import os
import shutil

import sys

""" Crops an image to a defined aspect ratio """
def cropToAspectRatio(img : Image, aspectRatio : float):
    if aspectRatio < 0:
        raise ValueError("Aspect ratio must be positive.")
        return
    if img.width/img.height > aspectRatio:
        new_width = int(img.height * aspectRatio)
        offset = (img.width - new_width) // 2
        img = img.crop((offset, 0, img.width - offset, img.height))
    elif img.width/img.height < aspectRatio:
        new_height = img.width // aspectRatio
        offset = (img.height - new_height) // 2
        img = img.crop((0, offset, img.width, img.height - offset))
        
    return img

def loadImageAsJPG(file_path : str, load_path : str, widths : tuple = (1920), aspectRatio : float = 16/9, quality : int = 50, resample : Image.Resampling = Image.Resampling.BILINEAR, subfolders : bool = False):
    try:
        img = Image.open(file_path)
    except FileNotFoundError as err:
        print(f"Error: No se encontró el archivo {err.filename}")
    except PIL.UnidentifiedImageError as err:
        print(f"Error: El archivo {err.filename} no es una imagen.")
    else:
        img = cropToAspectRatio(img, aspectRatio)
        #Convert image to RGB to save in JPEG
        if img.mode != "RGB":
            img = img.convert("RGB")
        name = ".".join(os.path.basename(file_path).split(".")[:-1]) # Gets filename
        os.makedirs(load_path, exist_ok=True) #Creates load path if it doesn't exist

        if subfolders:
            for width in widths:
                height = img.height * width // img.width
                tmp = img.resize((width, height), resample)
                os.makedirs(load_path + f"{width}w", exist_ok=True)
                tmp.save(load_path + f"{width}w/" + f"{name}.jpg", "jpeg", quality=quality, optimize=True)
        else:
            os.makedirs(load_path, exist_ok=True)
            for width in widths:
                height = img.height * width // img.width
                tmp = img.resize((width, height), resample)
                tmp.save(load_path + f"{name}_{width}w.jpg", "jpeg", quality=quality, optimize=True)
        
        img.close()

#Clean resources directory WebServer
if os.path.exists("./WebServer/web/resources/header"):
    shutil.rmtree("./WebServer/web/resources/header")
if os.path.exists("./WebServer/web/resources/persons"):
    shutil.rmtree("./WebServer/web/resources/persons")
if os.path.exists("./WebServer/web/resources/research"):
    shutil.rmtree("./WebServer/web/resources/research")

#Resize and load header
header_widths = (640, 1000, 1440, 1920)
header_quality = 50 #Quality of header image, 0-95. 95: best quality and highest filesize
header_file_path = "./WebContent/resources/header/header.jpg"
header_load_path = "./WebServer/web/resources/header/"

loadImageAsJPG(header_file_path, header_load_path, header_widths, quality=header_quality)

#Load persons
person_widths = (128, 256, 384)
person_quality = 50 #Quality of header image, 0-95. 95: best quality and highest filesize
person_path = "./WebContent/resources/persons/"
person_load_path = "./WebServer/web/resources/persons/"

for file_path in glob.glob(person_path + "*"):
    loadImageAsJPG(file_path, person_load_path, person_widths, aspectRatio=1, quality=person_quality, subfolders=True)

#Load research
research_widths = (240, 420, 720)
research_quality = 50 #Quality of header image, 0-95. 95: best quality and highest filesize
research_path = "./WebContent/resources/research/"
research_load_path = "./WebServer/web/resources/research/"

for file_path in glob.glob(research_path + "*"):
    loadImageAsJPG(file_path, research_load_path, research_widths, aspectRatio=1.5, quality=person_quality, subfolders=True)