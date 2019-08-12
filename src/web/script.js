/* Drag & drop file input and input normalization */
fileInput = function(elements) {
  var selectors = elements || 'input[type="file"]',
    imgRegx = /\.(jpe?g|png|svg|webp|bmp|gif)$/i;
  document.querySelectorAll(selectors).forEach(function(input) {
    var dropzone =
        input.form.querySelector(".dropzone") ||
        document.body ||
        document.documentElement.body,
      parent = input.parentElement,
      preview = parent.querySelector(".preview"),
      isCapture =
        input.accept.match(/capture.*/g) || input.getAttribute("capture");
    /* Event listeners */
    dropzone.ondragover = function(e) {
      onDrag(e, dropzone);
    };
    dropzone.ondragleave = function(e) {
      onDrag(e, dropzone);
    };
    dropzone.ondrop = function(e) {
      onDrop(e, input, preview, dropzone);
    };
    input.onchange = function(e) {
      onDrop(e, input, preview, dropzone);
    };
    if (isCapture)
      input.parentElement.querySelector(".camera").onclick = function(e) {
        capturing(e, preview, input);
      };
  });
  /* Drag & drop functions */
  function onDrag(e, dropzone) {
    // e = e || window.event;get window.event if e argument missing (in IE)
    e.stopPropagation();
    e.preventDefault();
    if (e.type === "dragover") dropzone.classList.add("dragover");
    else dropzone.classList.remove("dragover");
  }
  /* Drop & error handling function */
  function onDrop(e, input, preview, dropzone) {
    onDrag(e, dropzone);
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      // Check File API support
      return showError(input, "nosupport", "fileapi");
    }
    var files = e.target.files || e.currentTarget.files || e.dataTransfer.files,
      // folders = e.target.items || e.dataTransfer.items,
      folders = e.dataTransfer ? e.dataTransfer.items : false,
      accept = input.accept || "*",
      acceptRegx = accept.split(",") || accept.split(";") || accept;
    input.files = files;
    if (folders && input.multiple) {
      for (var i = 0; i < folders.length; i++) {
        var dir = folders[i].webkitGetAsEntry();
        if (dir) directoryIterator(dir, null, preview);
      }
      return; // break further files processing
    }
    /* Preview handling */
    if (files.length === 1) {
      if (!input.multiple) {
        reset(preview); // Reset prior previews
        if (
          input.parentElement.className.indexOf("upload-photo") > -1 &&
          accept.match(/image.*/g)
        )
          createPreview(files[0], preview, true, true);
        else if (!files[0].type.match(accept))
          return showError(input, "mime", accept);
        else createPreview(files[0], preview, true);
      } else {
        createPreview(files[0], preview);
      }
    } else if (files.length > 1) {
      if (!input.multiple) {
        return showError(input, "count");
      } else {
        for (var i = 0; i < files.length; i++) createPreview(files[i], preview);
      }
    } else {
      return showError(input, "nofile");
    }
  }
  /* Error function */
  function showError(input, attribute, msg) {
    var error = input.parentElement.querySelector(".error"),
      data = input.parentElement.querySelector("[data-" + attribute + "]"),
      msg = data
        ? data.getAttribute("data-" + attribute) + (msg || "")
        : "Error" + attribute + ": " + (msg || "");
    error.innerHTML = msg;
    input.parentElement.classList.add("hasError");
  }
  /* Create a preview item */

  function createPreview(file, preview, isSingle, isImage) {
    var reader = new FileReader(),
      img = new Image(),
      item = document.createElement("li"),
      btnRemove = document.createElement("i");
    btnRemove.onclick = function(e) {
      remove(btnRemove, preview);
    };
    reader.addEventListener(
      "load",
      function() {
        img.title = file.name;
        img.alt =
          "size: " +
          file.size +
          ", type: " +
          file.type +
          ", modified: " +
          file.lastModified;
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        item.innerHTML =
          "<b>" +
          file.name +
          '</b><small data-upload="0">' +
          formatBytes(file.size) +
          " " +
          file.type +
          "</small>";
        if (file.name.match(imgRegx)) {
          img.style.backgroundImage = "url(" + reader.result + ")";
          if (isSingle && isImage)
            preview.style.backgroundImage = "url(" + reader.result + ")";
        }
        item.insertAdjacentElement("beforeend", btnRemove);
        item.insertAdjacentElement("afterbegin", img);
        item.addEventListener(
          "click",
          function(e) {
            upload(e, item, file);
          },
          false
        );
        preview.appendChild(item);
      },
      false
    );
    reader.readAsDataURL(file);
  }
  /* Camera capture */
  function capturing(e, preview, input) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function(stream) {
        var video = document.createElement("video"),
          control = preview.parentElement.querySelector(".camera"),
          title = control.title || "Camera",
          recording = control.getAttribute("data-recording") || "Recording...",
          shutter = new Audio(
            "https://www.soundjay.com/mechanical/camera-shutter-click-01.mp3"
          ),
          canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d"),
          w,
          h,
          ratio;
        reset(preview); // Reset prior previews
        preview.classList.remove("snaphot"); // Reset prior snapshots
        preview.appendChild(video);
        /* Recording button */
        control.classList.add("recording");
        control.title = recording;
        control.onclick = function() {
          reset(preview);
          this.title = title;
          this.classList.remove("recording");
        };
        /* Camera input stream */
        video.srcObject = stream;
        video.addEventListener(
          "loadedmetadata",
          function() {
            ratio = video.videoWidth / video.videoHeight;
            w = video.videoWidth - 100;
            h = parseInt(w / ratio, 10);
            canvas.width = w;
            canvas.height = h;
            video.play();
          },
          false
        );
        // video.style.zIndex = 1000;
        control.addEventListener(
          "click",
          function(e) {
            e.preventDefault();
            // e.stopPropagation();
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(video, 0, 0, w, h);
            var blob = canvas.toDataURL("image/jpeg"),
              now = new Date(),
              created =
                now.toLocaleDateString("de-CH") +
                " at " +
                now.toLocaleTimeString("de-CH");
            shutter.play();
            preview.classList.add("snaphot");
            reset(preview);
            control.title = title;
            item = document.createElement("li");
            item.innerHTML =
              '<b>Snapshot</b><small data-upload="0">' +
              created +
              "</small><i><i/>";
            preview.appendChild(item);
            preview.style.backgroundImage = "url(" + blob + ")";
          },
          false
        );
      })
      .catch(function(err) {
        showError(input, "capture", err.name + ": " + err.message);
      });
  }
  /* Clear / empty the preview element and reset all controls */
  function reset(el) {
    el.parentElement.classList.remove("hasError"); /* Reset possible errors */
    el.innerHTML = "";
    el.style.backgroundImage = "";
    el.parentElement.querySelector(".icon").classList.remove("recording");
    fileInput();
  }
  /* Remove fileElement from dom and fileList */
  function remove(el, preview) {
    preview.removeChild(el.parentElement);
  }
  function upload(e, item, file) {
    e.preventDefault();
    item.classList.add("uploading");
    item.addEventListener(
      "click",
      function() {
        item.classList.remove("uploading");
        item.classList.add("uploaded");
      },
      false
    );
    /* 
		var data = new FormData();
	  data.append('files', file);	
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'handler.cfm', true);
		xhr.onload = function(e) {
			if(this.status == 200) 
				console.log(e.currentTarget.responseText || e.target.responseText);
			else
        alert('Upload error');
		}
		xhr.send(data);*/
  }
  /* Format bytes to KB, MB */
  function formatBytes(number) {
    if (number < 1024) return number + "bytes";
    else if (number >= 1024 && number < 1048576)
      return (number / 1024).toFixed(1) + "KB";
    else if (number >= 1048576) return (number / 1048576).toFixed(1) + "MB";
  }
  /* Directory traversing function */
  function directoryIterator(item, path, preview) {
    path = path || "";
    preview = preview || "";
    if (item.isFile) {
      // Get file
      item.file(function(file) {
        // console.log("File:", path + file.name);
        createPreview(file, preview);
      });
    } else if (item.isDirectory) {
      // Get folder contents
      var dirReader = item.createReader();
      dirReader.readEntries(function(entries) {
        for (var i = 0; i < entries.length; i++) {
          directoryIterator(entries[i], path + item.name + "/", preview);
        }
      });
    }
  }
};

// Initiate file inputs
// For special element selection: fileInput('.elements, elements, #element');
fileInput();

