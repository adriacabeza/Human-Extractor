import argparse
import numpy as np
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--image', type=str)
args = parser.parse_args()


img = Image.open(args.image)
img = img.convert("RGBA")

pixdata = img.getdata()

def bigger(r,g,b):
	if r > 250 and g > 250 and b > 250:
		return True
	else:
		return False
newData = []
for item in pixdata:
	if bigger(item[0],item[1],item[2]):
		newData.append((255, 255, 255, 0))
	else:
		newData.append(item)	
img.putdata(newData)
img.save("img2.png", "PNG")
