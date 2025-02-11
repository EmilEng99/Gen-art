/**
 * Shader used for combining the multiple render passes
 *
 * Basically we set render target screen to false for our effects passes, so they render to a texture. Then for each pixel we blend the layers together.
 */

export class CompositionShader {
  static fragment = `
          precision highp float;
  
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;
          uniform sampler2D overlayTexture;
  
          varying vec2 vUv;
  
          void main() {
              // Baselayer + bloomlayer + 0.25(overlay)
              gl_FragColor = ( texture( baseTexture, vUv ) + vec4( 1.0 ) * texture( bloomTexture, vUv ) + vec4(0.25) * texture(overlayTexture, vUv) );
          }
      `;

  static vertex = `
          varying vec2 vUv;
  
          void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
      `;
}
