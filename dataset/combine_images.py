import argparse
import os
import numpy as np

from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--original', type=str, default='../data/original')
parser.add_argument('--segmentated', type=str, default='../data/transparency')
args = parser.parse_args()


def make_square(im, min_size=256, fill_color=(255, 255, 255, 1)):
	x, y = im.size
	size = max(min_size, x, y)
	new_im = Image.new('RGBA', (size, size), fill_color)
	new_im.paste(im, (int((size - x) / 2), int((size - y) / 2)))
	return new_im

if not os.path.exists('../data/prepared'):
    os.makedirs('../data/prepared')

for root, dirs, files in os.walk(args.original, topdown=False):
    for i, name in enumerate(files):
            print(i, name)
            try:
                    both = Image.new('RGB', (1024, 512))
                    print('Cropping {}'.format(os.path.join(args.original, name)))

                    img = Image.open(os.path.join(args.original, name))
                    if name.endswith('jpeg'):
                        name = name.replace('jpeg','png')
                    img2 = Image.open(os.path.join(args.segmentated, name))
                    
                    print('Lets start to resize')
                    img = img.resize((512, 512), Image.LANCZOS)
                    img2 = img2.resize((512, 512), Image.LANCZOS)
                    
                    print('Paste resized images')
                    print(np.array(img).shape)
                    print(np.array(img2).shape)
                    both.paste(img, (0, 0, 512, 512))
                    both.paste(img2.convert('RGB'), (512, 0, 1024, 512))
                    both.save('../data/prepared/'+name)
                    print('Saved')
            except Exception as e:
                print('Error: {}'.format(e))

