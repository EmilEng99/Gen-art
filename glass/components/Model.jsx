import React, { useRef, useEffect } from 'react'
import { useGLTF, Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber';

export default function Model() {
    const { nodes } = useGLTF('/medias/torrus.glb');
    const { viewport } = useThree();
    const torus = useRef(null);

     // 🔹 OPTIMERAD useFrame med delta time
     useFrame((_, delta) => {
        if (torus.current) {
            torus.current.rotation.x += 0.02 * delta * 60; // Delta time anpassning
        }
    });

    // 🔹 useEffect för att rensa minnet vid unmount
    useEffect(() => {
        return () => {
            if (nodes.Torus002) {
                nodes.Torus002.geometry.dispose();
                nodes.Torus002.material.dispose();
            }
        };
    }, [nodes]);

    console.log(nodes);
  return (
    <group scale={viewport.width / 3.75}>
        <Text position={[0, 0, -1]} fontSize={0.5} color='black' anchorX='center' anchorY='middle'>
            Hello world!
            </Text>
            <mesh ref={torus} geometry={nodes.Torus002.geometry} material={new THREE.MeshStandardMaterial()}>
            <meshBasicMaterial />
        </mesh>
    </group>
  )
}
