import os
import argparse

SPLIT = 0.95

parser = argparse.ArgumentParser()
parser.add_argument('--directory', type=str, default='data/original')
args = parser.parse_args()

images = os.listdir(args.directory)
train = images[:int(SPLIT*len(images))]
test = images[int(SPLIT*len(images)):]
os.mkdir('train')
for i in train:
    os.rename(os.path.join(args.directory, i), os.path.join(args.directory, 'train', i))
os.mkdir('test')
for i in test:
    os.rename(os.path.join(args.directory, i), os.path.join(args.directory, 'test', i))
