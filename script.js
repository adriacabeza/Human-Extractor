
const MODEL_URL = 'generator/generator.json';
const model = await tf_converter.loadGraphModel(MODEL_URL);
// await tf_converter.loadFrozenModel(MODEL_URL, WEIGHTS_URL)

var file = null;

function thisFileUpload() {
    file = document.getElementById("file").click();
    if(file != null){
        button = document.getElementById("boton");
        button.style.visibility="hidden";
        spinner = document.getElementById("spinner");
        spinner.className="lds-grid";
	run()
    }
};


function run(){
	if(model != null & file != null){
		result= model.execute(tf.fromPixels(file))
		document.getElementById("original1").src = file
		document.getElementById("original2").src = result
	}
};
