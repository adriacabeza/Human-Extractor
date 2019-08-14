import argparse
import os

import cv2
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('--original', type=str, default='data/original')
parser.add_argument('--segmentated', type=str, default='data/segmentated')
args = parser.parse_args()

if not os.path.exists('../data/transparency'):
    os.makedirs('../data/transparency')
    print('Folder transparency created')

for root, dirs, files in os.walk(args.original, topdown=False):
    for i, name in enumerate(files):
        print('Processing {}'.format(os.path.join(args.original, name)))
        try:
            img = cv2.imread(os.path.join(args.original, name))
            img = cv2.cvtColor(img, cv2.COLOR_RGB2RGBA)
            img = img.astype(float)
            if name.endswith('jpeg'):
                name = name.replace('jpeg', 'png')
            alpha = cv2.imread(os.path.join(args.segmentated, name))
            img[np.all(alpha == 0, axis=2)] = [255, 255, 255, 255]

            cv2.imwrite('../data/transparency/'+ name, img)
            log = '../data/transparency/'+ name
            print('Saved in {}'.format(log))
        except Exception as e:
            print(e)
