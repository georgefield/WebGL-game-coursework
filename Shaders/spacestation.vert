attribute vec4 vertex;
attribute vec3 normal;

varying vec4 fColor;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 inverseRotationMatrix;

uniform vec3 ambientLightDirection;
uniform float grayOutFactor; //ranges from 0 to 1, 1 is full gray

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
        redness += 20.0/(distance * distance);
    }

    //ambient lighting
    vec3 aldAccountingForRotation = vec3(inverseRotationMatrix * vec4(ambientLightDirection, 1.0));
    float brightnessFactor = (dot(aldAccountingForRotation, normal) / 2.0 + 0.5);

    //combine lighting
    vec4 normalColor = vec4(redness, 0, 0, 0) + vec4(brightnessFactor, brightnessFactor, brightnessFactor, 1);
    //apply any gray out
    fColor = mix(normalColor, vec4(0.5,0.5,0.5,1), grayOutFactor);

    gl_Position =  screenVertex;
}