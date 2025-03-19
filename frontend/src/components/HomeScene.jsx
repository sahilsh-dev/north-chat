import { useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function AnimatedBox({ initialPosition }) {
	const meshRef = useRef(null);
	const [targetPosition, setTargetPosition] = useState(
		new THREE.Vector3(...initialPosition)
	);
	const currentPosition = useRef(new THREE.Vector3(...initialPosition));

	const getAdjacentIntersection = (current) => {
		const directions = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
		];
		const randomDirection =
			directions[Math.floor(Math.random() * directions.length)];
		return new THREE.Vector3(
			current.x + randomDirection[0] * 3,
			0.5,
			current.z + randomDirection[1] * 3
		);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			const newPosition = getAdjacentIntersection(currentPosition.current);
			newPosition.x = Math.max(-15, Math.min(15, newPosition.x));
			newPosition.z = Math.max(-15, Math.min(15, newPosition.z));
			setTargetPosition(newPosition);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useFrame((state, delta) => {
		if (meshRef.current) {
			currentPosition.current.lerp(targetPosition, 0.1);
			meshRef.current.position.copy(currentPosition.current);
		}
	});

	return (
		<mesh ref={meshRef} position={initialPosition}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color="#ffffff" opacity={0.9} transparent />
			<lineSegments>
				<edgesGeometry
					attach="geometry"
					args={[new THREE.BoxGeometry(1, 1, 1)]}
				/>
				<lineBasicMaterial attach="material" color="#000000" linewidth={2} />
			</lineSegments>
		</mesh>
	);
}

export function SpinningLogo() {
	const groupRef = useRef(null);

	useFrame((state, delta) => {
		if (groupRef.current) {
			groupRef.current.rotation.y += delta * 0.5;
		}
	});

	return (
		<group ref={groupRef}>
			<mesh position={[0, 0, 0]}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="#ffffff" />
			</mesh>
			<mesh position={[0.5, 0.5, 0.5]}>
				<boxGeometry args={[0.5, 0.5, 0.5]} />
				<meshStandardMaterial color="#cccccc" />
			</mesh>
			<mesh position={[-0.5, -0.5, -0.5]}>
				<boxGeometry args={[0.5, 0.5, 0.5]} />
				<meshStandardMaterial color="#999999" />
			</mesh>
		</group>
	);
}

export function Scene() {
	const initialPositions = [
		[-9, 0.5, -9],
		[-3, 0.5, -3],
		[0, 0.5, 0],
		[3, 0.5, 3],
		[9, 0.5, 9],
		[-6, 0.5, 6],
		[6, 0.5, -6],
		[-12, 0.5, 0],
		[12, 0.5, 0],
		[0, 0.5, 12],
	];

	return (
		<>
			<OrbitControls />
			<ambientLight intensity={0.5} />
			<pointLight position={[10, 10, 10]} />
			<Grid
				renderOrder={-1}
				position={[0, 0, 0]}
				infiniteGrid
				cellSize={1}
				cellThickness={0.5}
				sectionSize={3}
				sectionThickness={1}
				sectionColor={[0.5, 0.5, 0.5]}
				fadeDistance={50}
			/>
			{initialPositions.map((position, index) => (
				<AnimatedBox key={index} initialPosition={position} />
			))}
		</>
	);
}
