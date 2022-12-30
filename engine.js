function bufferDataToAttrib(program, attribName, data, dataLength, dataType){
    //--position data
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    
    // Associate our shader variables with our data buffer
    var location = gl.getAttribLocation(program, attribName);
    gl.vertexAttribPointer(location, dataLength, dataType, false, 0, 0);
    gl.enableVertexAttribArray(location);
}

function bufferQuad(program, quad, locString){

    bufferDataToAttrib(program, locString, quad.getVertices(), 2, gl.FLOAT);
}

function render(numVertices) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw a triangles starting from index 0 and 
    // using 3 indices 
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}