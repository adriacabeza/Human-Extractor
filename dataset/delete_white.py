import argparse

from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--image', type=str())
args = parser.parse_args()


img = Image.open(args.image)
img = img.convert("RGBA")

pixdata = img.load()

def bigger((r,g,b,a)):
	if r > 250 and g > 250 and b > 250 and a > 250:
		return True
	else
		return False

width, height = image.size
for y in range(height):
	for x in range(width):
		if bigger(pixdata[x, y]):
			pixdata[x, y] = (255, 255, 255, 0)

img.save("img2.png", "PNG")
