attribute vec4 vertex;
attribute vec3 normal;

varying vec4 fColor;
varying vec3 fvPosition;
varying float fSunFlareAmount;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 inverseRotationMatrix;

uniform vec4 vColor;
uniform vec3 ambientLightDirection;
uniform float sunFlareAmount; //need to calculate background color for fog

uniform int numProjectiles;
uniform vec3 projectilePositions[12]; //4 per second, gone after 3 seconds

void main()
{
    vec4 worldVertex = modelViewMatrix * vertex;
    vec4 screenVertex = projectionMatrix * worldVertex;

    //projectile light source
    float redness = 0.0;
    for (int i = 0; i < 12; i++) {
        if (i >= numProjectiles){ //loop must have constant value sadly
            break;
        }
        float distance = length(vec3(worldVertex) - projectilePositions[i]);
        redness += 125.0/(distance * distance);
    }

    //ambient lighting
    vec3 aldAccountingForRotation = vec3(inverseRotationMatrix * vec4(ambientLightDirection, 1.0));
    vec4 sunShadedColor = vec4(vec3(vColor) * (dot(aldAccountingForRotation, normal) / 2.0 + 0.5),1); //normal calculated as approximation of icosahedron (a sphere)
    
    //combine
    fColor = vec4(redness,0,0,0) + sunShadedColor; //sun and redness shaded colour

    gl_Position = screenVertex;

    //pass to frag to create fog
    fvPosition = screenVertex.xyz;
    fSunFlareAmount = sunFlareAmount;
}