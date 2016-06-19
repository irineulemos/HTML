var source = new Image();


function init() {

    var canvas = document.getElementById("canvas");
    canvas.width = source.clientWidth;
    canvas.height = source.clientHeight;

    var tempContext = canvas.getContext("2d");
    var len = canvas.width * canvas.height * 4;

    // Drawing the source image into the target canvas
    tempContext.drawImage(source, 0, 0, canvas.width, canvas.height);

    // If workers are not supported
    // Perform all calculations in current thread as usual
    if (!window.Worker) {
        // Getting all the canvas data
        var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);
        var binaryData = canvasData.data;

        // Processing all the pixel with the main thread
        processSepia(binaryData, len);

        // Copying back canvas data to canvas
        tempContext.putImageData(canvasData, 0, 0);        

        return;
    }

    // Let say we want to use 4 workers
    // We will break up the image into 4 pieces as shown above, one for each web-worker
    var workersCount = 4;
    var finished = 0;
    var segmentLength = len / workersCount; // This is the length of array sent to the worker
    var blockSize = canvas.height / workersCount; // Height of the picture chunck for every worker

    // Function called when a job is finished
    var onWorkEnded = function (e) {
        // Data is retrieved using a memory clone operation
        var canvasData = e.data.result;
        var index = e.data.index;

        // Copying back canvas data to canvas
        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
        tempContext.putImageData(canvasData, 0, blockSize * index);

       /* finished++;

        if (finished == workersCount) {
            var diff = new Date() - start;
            log.innerText = "Process done in " + diff + " ms";
        }*/
    };

    // Launching every worker
    for (var index = 0; index < workersCount; index++) {
        var worker = new Worker("atividade02.02.worker.js");
        worker.onmessage = onWorkEnded;

        // Getting the picture
        var canvasData = tempContext.getImageData(0, blockSize * index, canvas.width, blockSize);

        // Sending canvas data to the worker using a copy memory operation
        worker.postMessage({ data: canvasData, index: index, length: segmentLength });
    }
}; 

source.src = "images/dota.jpg"