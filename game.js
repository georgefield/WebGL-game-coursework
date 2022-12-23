var gl;
var points;

function main() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas); //what webgl-utils is needed for
    if (!gl) {
        alert("WebGL isn't available");
    }

    var vertices = new Float32Array(
	[-0.5, -0.5,
	-0.5, 0.5,
	0.5, 0.5,
	]);

    var vColor = new Float32Array(
    [1.0, 0.0, 1.0,
    0.0, 1.0, 1.0,
    1.0,1.0,0
    ]);

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3, 0.3, 0.5, 1.0);
    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    // Load the data into the GPU

    //--position data
    var vPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    //--color data
    var vColBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vColBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vColor, gl.STATIC_DRAW);

    //color attrib location
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw a triangles starting from index 0 and 
    // using 3 indices 
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}