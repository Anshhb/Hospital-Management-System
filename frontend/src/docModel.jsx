import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const MyModel = () => {
  const { scene } = useGLTF('/doctor'); // replace with your model path

  return <primitive object={scene} />;
};

const App = () => {
  return (
    <Canvas>
      <ambientLight />
      <spotLight position={[10, 10, 10]} />
      <MyModel />
    </Canvas>
  );
};

export default App;
