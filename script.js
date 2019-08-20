import * as tf from '@tensorflow/tfjs';
var file = null

function thisFileUpload() {
    file = document.getElementById("file").click();
};

const model = await tf.loadGraphModel(FICAR ALGU)
model.predict(tf.browser.fromPixels(file))
