attribute vec2 vertex;

varying vec4 fColor;

uniform mat4 arrowModelViewMatrix;
uniform vec4 color;

void main()
{
    fColor = color;

    //0.01 z so renders above everything
    gl_Position = arrowModelViewMatrix * vec4(vertex,0.01,1);
}