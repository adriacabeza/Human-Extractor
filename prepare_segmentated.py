import os
import argparse
import cv2
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('--original', type=str, default='data/original')
parser.add_argument('--segmentated', type=str, default='data/segmentated')
args = parser.parse_args()

for root, dirs, files in os.walk(args.original, topdown=False):
    for i, name in enumerate(files):
        print('Processing {}'.format(os.path.join(args.original, name)))
        try:
            img = cv2.imread(os.path.join(args.original, name))
            img = cv2.cvtColor(img, cv2.COLOR_RGB2RGBA)
            img = img.astype(float)

            alpha = cv2.imread(os.path.join(args.segmentated, name.replace('jpg', 'png')))
            img[np.all(alpha == 0, axis=2)] = [0, 0, 0, 0]
            cv2.imwrite('./data/transparency/'+str(i)+'_transparency.png', img)
        except Exception as e:
            print(e)
