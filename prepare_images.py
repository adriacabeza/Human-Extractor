from PIL import Image
import os 
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('directory')
args = parser.parse_args()


def make_square(im, min_size=256, fill_color=(255, 255, 255, 1)):
    x, y = im.size
    size = max(min_size, x, y)
    new_im = Image.new('RGBA', (size, size), fill_color)
    new_im.paste(im, (int((size - x) / 2), int((size - y) / 2)))
    return new_im



for root, dirs, files in os.walk(args.directory, topdown=False):
    for i, name in enumerate(files):
        print('Processing {}'.format(os.path.join(args.directory,name)))
        img = Image.open(os.path.join(args.directory, name))
        img.thumbnail((512, 512), Image.ANTIALIAS)
        img = make_square(img)
        img.save('./cropped/'+str(i+50)+'.png')
