var processSepia = function (binaryData, l) {
    for (var i = 0; i < l; i += 4) {
        var r = binaryData[i];
        var g = binaryData[i + 1];
        var b = binaryData[i + 2];

        //serpia
        binaryData[i] = colorDistance(noise(), (r * 0.393) + (g * 0.769) + (b * 0.189), r);
        binaryData[i + 1] = colorDistance(noise(), (r * 0.349) + (g * 0.686) + (b * 0.168), g);
        binaryData[i + 2] = colorDistance(noise(), (r * 0.272) + (g * 0.534) + (b * 0.131), b);
    }
};

self.onmessage = function (e) {
    var canvasData = e.data.data;
    var binaryData = canvasData.data;
    
    var l = e.data.length;
    var index = e.data.index;

    processSepia(binaryData, l);

    self.postMessage({ result: canvasData, index: index });
};