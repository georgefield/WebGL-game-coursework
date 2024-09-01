attribute vec4 vertex;

varying vec4 fColor;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform vec4 sunColor;


void main()
{
    fColor = sunColor;

    gl_Position =  projectionMatrix * modelViewMatrix * vertex;
}