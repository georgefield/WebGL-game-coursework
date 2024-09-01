precision mediump float;

varying vec3 fvPosition;
varying vec4 fColor;
varying float fSunFlareAmount;

void main() {
    vec4 fogColor = vec4(fSunFlareAmount * 0.7,0.05 + fSunFlareAmount * 0.6,0.12 + fSunFlareAmount * 0.4,1); //same as background
    float fogStart = 0.0; //the distance from the camera where the fog starts
    float fogEnd = 750.0;   //the distance from the camera where the fog is completely covering the scene = far plane

    float fogFactor = (length(fvPosition) - fogStart) / (fogEnd - fogStart);
    fogFactor = clamp(fogFactor, 0.0, 1.0); // clamp the fogFactor between 0 and 1
    gl_FragColor = vec4(mix(fColor, fogColor, fogFactor));
}