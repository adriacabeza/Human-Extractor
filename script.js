//import * as tf from '@tensorflow/tfjs';
var file = null

function thisFileUpload() {
    file = document.getElementById("file").click();
    if(file != null){
        button = document.getElementById("boton");
        button.style.visibility="hidden";
        spinner = document.getElementById("loader");
        spinner.style.visibility="visible";
    }
};

// const model = await tf.loadGraphModel(FICAR ALGU)
// model.predict(tf.browser.fromPixels(file))
