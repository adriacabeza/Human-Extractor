import os 
import argparse

from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--original', type=str, default='data/original')
parser.add_argument('--segmentated', type=str, default='segmentated')
args = parser.parse_args()


def make_square(im, min_size=256, fill_color=(255, 255, 255, 1)):
	x, y = im.size
	size = max(min_size, x, y)
	new_im = Image.new('RGBA', (size, size), fill_color)
	new_im.paste(im, (int((size - x) / 2), int((size - y) / 2)))
	return new_im


for root, dirs, files in os.walk(args.original, topdown=False):
	for i, name in enumerate(files):
		try:
			both = Image.new("both", (512, 1024))
			print('Cropping {}'.format(os.path.join(args.original, name)))

			img = Image.open(os.path.join(args.original, name))
			img2 = Image.open(os.path.join(args.segmentated, name.replace('jpg', 'png')))
			img.thumbnail((512, 512), Image.ANTIALIAS)
			img2.thumbnail((512, 512), Image.ANTIALIAS)
			both.paste(img, (0, 0, 512, 512))
			both.paste(img2, (512, 0, 1024, 512))
			both.save('./prepared/'+str(i)+'.png')
		except:
			print('Failed')

