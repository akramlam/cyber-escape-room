import React, { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html, Float } from '@react-three/drei';
import { BaseScene } from '../3d';
import { Email } from '../../types';
import { mockEmails } from '../../mocks/emailData';

interface EmailObject extends THREE.Mesh {
  userData: {
    email: Email;
    isHovered: boolean;
    isSelected: boolean;
  }
}

const PhishingScene: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const emailsRef = useRef<EmailObject[]>([]);
  const { camera } = useThree();

  useFrame((state) => {
    emailsRef.current.forEach((emailObj) => {
      if (emailObj.userData.isHovered) {
        emailObj.rotation.y += 0.02;
        emailObj.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
      } else if (emailObj.userData.isSelected) {
        emailObj.rotation.y += 0.01;
      } else {
        emailObj.rotation.y = 0;
        emailObj.scale.setScalar(1);
      }
    });
  });

  const handleEmailHover = (emailObj: EmailObject, isHovered: boolean) => {
    emailObj.userData.isHovered = isHovered;
  };

  const handleEmailSelect = (emailObj: EmailObject) => {
    emailObj.userData.isSelected = !emailObj.userData.isSelected;
    // Additional logic for email selection
  };

  return (
    <BaseScene cameraPosition={[0, 2, 5]} environmentPreset="studio">
      {/* Email Objects */}
      <group position={[0, 1.5, 0]}>
        {emails.map((email, index) => (
          <Float
            key={email.id}
            speed={1.5} 
            rotationIntensity={0.2} 
            floatIntensity={0.5}
          >
            <group
              position={[
                (index - emails.length / 2) * 2,
                0,
                0
              ]}
            >
              <mesh
                ref={(ref) => {
                  if (ref) {
                    (ref as EmailObject).userData = {
                      email,
                      isHovered: false,
                      isSelected: false
                    };
                    emailsRef.current[index] = ref as EmailObject;
                  }
                }}
                onPointerOver={(e) => handleEmailHover(e.object as EmailObject, true)}
                onPointerOut={(e) => handleEmailHover(e.object as EmailObject, false)}
                onPointerDown={(e) => handleEmailSelect(e.object as EmailObject)}
              >
                <boxGeometry args={[1.5, 1, 0.1]} />
                <meshStandardMaterial 
                  color="#ffffff"
                  metalness={0.5}
                  roughness={0.3}
                />
                
                <Html
                  transform
                  occlude
                  position={[0, 0, 0.06]}
                  style={{
                    width: '140px',
                    height: '90px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ fontSize: '12px' }}>
                    <strong>{email.subject}</strong>
                    <p>{email.sender}</p>
                  </div>
                </Html>
              </mesh>
            </group>
          </Float>
        ))}
      </group>

      {/* Security Tools Panel */}
      <Html
        transform
        position={[2, 0, 0]}
        rotation={[0, -Math.PI / 4, 0]}
        style={{
          width: '200px',
          height: '300px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          padding: '16px',
          color: '#00ff00'
        }}
      >
        <div>
          <h3>Security Tools</h3>
          <button onClick={() => {}}>Scan Email</button>
          <button onClick={() => {}}>Check Links</button>
          <button onClick={() => {}}>Verify Sender</button>
        </div>
      </Html>
    </BaseScene>
  );
};

export default PhishingScene; 