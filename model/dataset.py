import tensorflow as tf

from model import IMG_WIDTH, IMG_HEIGHT


def load(image_file):
	image = tf.io.read_file(image_file)
	image = tf.image.decode_jpeg(image)
	w = tf.shape(image)[1]

	w = w // 2
	input_image = image[:, :w, :]
	real_image = image[:, w:, :]

	input_image = tf.cast(input_image, tf.float32)
	real_image = tf.cast(real_image, tf.float32)

	return input_image, real_image


def resize(input_image, real_image, height, width):
	input_image = tf.image.resize(input_image, [height, width], method=tf.image.ResizeMethod.NEAREST_NEIGHBOR)
	real_image = tf.image.resize(real_image, [height, width], method=tf.image.ResizeMethod.NEAREST_NEIGHBOR)

	return input_image, real_image


def random_crop(input_image, real_image):
	stacked_image = tf.stack([input_image, real_image], axis=0)
	cropped_image = tf.image.random_crop(stacked_image, size=[2, IMG_HEIGHT, IMG_WIDTH, 3])

	return cropped_image[0], cropped_image[1]


# normalizing the images to [-1, 1]
def normalize(input_image, real_image):
	input_image = (input_image / 127.5) - 1
	real_image = (real_image / 127.5) - 1

	return input_image, real_image


def load_image(image_file):
	input_image, real_image = load(image_file)
	input_image, real_image = resize(input_image, real_image, IMG_HEIGHT, IMG_WIDTH)
	input_image, real_image = normalize(input_image, real_image)

	return input_image, real_image
