attribute vec4 vertex;

varying vec4 fColor;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main()
{
    //solid red for laser
    fColor = vec4(1,0,0,1);

    gl_Position =  projectionMatrix * modelViewMatrix * vertex;
}