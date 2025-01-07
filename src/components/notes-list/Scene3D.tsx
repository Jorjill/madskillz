import React from 'react';
import { useThree } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';

export const Scene3D = () => {
  const { camera } = useThree();
  
  React.useEffect(() => {
    camera.position.z = 5;
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.5}
            height={0.2}
            curveSegments={12}
          >
            Notes
            <meshStandardMaterial color="#93c5b1" />
          </Text3D>
        </Center>
      </Float>
    </>
  );
};
