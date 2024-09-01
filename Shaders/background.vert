attribute vec2 vertex;

varying vec4 fColor;

uniform float sunFlareAmount;
uniform vec4 sunColor;

void main()
{

    //faded sun color depends on sun color
    vec3 fadedSunColor = vec3(sunColor.r * 0.4, sunColor.g * 0.35, sunColor.b * 0.3);

    //z set to 0.9999 so renders behind everything
    gl_Position = vec4(vertex, 0.99999, 1);

    //mix in faded sun color if looking near sun
    fColor = vec4(sunFlareAmount * fadedSunColor.r,0.05 + sunFlareAmount * fadedSunColor.g,0.12 + sunFlareAmount * fadedSunColor.b,1);
}