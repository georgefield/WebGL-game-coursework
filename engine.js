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