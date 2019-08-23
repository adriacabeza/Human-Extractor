const MODEL_URL = 'generator/model.json';
const model = tf.loadGraphModel(MODEL_URL);


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
		spinner = document.getElementById("spinner");
		spinner.className="lds-grid--hidden";
		button = document.getElementById("boton");
		button.style.visibility="visible";
		document.getElementById("original1").src = file
		document.getElementById("original2").src = result
	}
};
