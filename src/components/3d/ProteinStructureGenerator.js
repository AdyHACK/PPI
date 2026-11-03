import * as THREE from 'three';

// Botanical Palette Constants for 3D Protein Rendering
export const BOTANICAL_3D_PALETTE = {
  forestGreen: '#244A3B',
  deepBotanical: '#193C30',
  emerald: '#2E7D5C',
  sageGreen: '#88A58B',
  mutedOlive: '#A5B18A',
  softMint: '#DDEADF',
  mutedTeal: '#659A8B',
  warmIvory: '#FAF9F3',
  acidicCoral: '#C87575',
  basicGold: '#C69B55',
  highlight: '#E8F2EF'
};

// Seeded pseudorandom number generator for deterministic 3D folds
function createRng(seedStr = 'INTERACTOMEX') {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Procedurally generates realistic 3D protein backbone coordinates (C-alpha trace)
 * incorporating secondary structure motifs (Alpha-helices, Beta-strands, Loops)
 * and compact globular folding heuristics.
 */
export function generateProteinBackbone(proteinId = 'P04637', sequenceLength = 393, customSequence = '') {
  const rng = createRng(proteinId + (customSequence ? customSequence.slice(0, 30) : ''));
  
  // Normalize display residue count between 60 and 140 for optimal rendering performance
  const displayResidues = Math.max(50, Math.min(130, Math.round(sequenceLength / 3.2)));
  
  const residues = [];
  let currentPos = new THREE.Vector3(0, 0, 0);
  let currentDir = new THREE.Vector3(1, 0, 0).normalize();
  let upVector = new THREE.Vector3(0, 1, 0);

  // Define secondary structure segments
  const motifs = ['helix', 'loop', 'sheet', 'loop', 'helix', 'loop', 'sheet', 'loop'];
  let motifIndex = 0;
  let remainingInMotif = 8 + Math.floor(rng() * 10);
  let currentMotif = 'helix';

  const centerOfMass = new THREE.Vector3(0, 0, 0);

  for (let i = 0; i < displayResidues; i++) {
    if (remainingInMotif <= 0) {
      motifIndex = (motifIndex + 1) % motifs.length;
      currentMotif = motifs[motifIndex];
      remainingInMotif = currentMotif === 'helix' 
        ? (10 + Math.floor(rng() * 8)) 
        : currentMotif === 'sheet' 
          ? (6 + Math.floor(rng() * 6)) 
          : (4 + Math.floor(rng() * 5));
    }
    remainingInMotif--;

    // Determine residue chemical property
    const aaTypes = ['hydrophobic', 'polar', 'acidic', 'basic'];
    const weights = [0.45, 0.30, 0.12, 0.13];
    const rVal = rng();
    let type = aaTypes[0];
    let cumulative = 0;
    for (let t = 0; t < aaTypes.length; t++) {
      cumulative += weights[t];
      if (rVal <= cumulative) {
        type = aaTypes[t];
        break;
      }
    }

    // Step forward along trajectory based on secondary structure motif
    if (currentMotif === 'helix') {
      // Helical spiral around currentDir
      const theta = i * 1.7; // ~3.6 residues per turn
      const radius = 2.4 + rng() * 0.2;
      const right = new THREE.Vector3().crossVectors(currentDir, upVector).normalize();
      const realUp = new THREE.Vector3().crossVectors(right, currentDir).normalize();
      
      const spiralOffset = new THREE.Vector3()
        .addScaledVector(right, Math.cos(theta) * radius)
        .addScaledVector(realUp, Math.sin(theta) * radius);

      currentPos.addScaledVector(currentDir, 1.4);
      const pos = currentPos.clone().add(spiralOffset);
      residues.push({ pos, type, motif: 'helix', index: i });
    } else if (currentMotif === 'sheet') {
      // Extended zigzag strand
      const zigZag = (i % 2 === 0 ? 1 : -1) * 1.2;
      const right = new THREE.Vector3().crossVectors(currentDir, upVector).normalize();
      currentPos.addScaledVector(currentDir, 3.2);
      const pos = currentPos.clone().addScaledVector(right, zigZag);
      residues.push({ pos, type, motif: 'sheet', index: i });
    } else {
      // Flexible loop turn
      const turnAngle = (rng() - 0.5) * 1.6;
      const pitchAngle = (rng() - 0.5) * 1.4;
      const axis = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize();
      currentDir.applyAxisAngle(axis, turnAngle).normalize();
      
      // Pull back gently toward center to form a globular domain
      if (currentPos.length() > 22) {
        const pullDir = currentPos.clone().negate().normalize();
        currentDir.lerp(pullDir, 0.45).normalize();
      }

      currentPos.addScaledVector(currentDir, 2.5);
      residues.push({ pos: currentPos.clone(), type, motif: 'loop', index: i });
    }

    centerOfMass.add(residues[residues.length - 1].pos);
  }

  // Recenter at origin (0,0,0)
  centerOfMass.divideScalar(residues.length);
  residues.forEach(r => r.pos.sub(centerOfMass));

  return residues;
}

/**
 * Builds the 3D Ribbon / Cartoon mesh representation
 */
export function createRibbonMesh(residues, options = {}) {
  const group = new THREE.Group();
  if (!residues || residues.length < 4) return group;

  const points = residues.map(r => r.pos);
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);

  // 1. Main Backbone Tube
  const tubeGeometry = new THREE.TubeGeometry(curve, residues.length * 5, 0.72, 10, false);
  
  // Custom vertex colors or material
  const ribbonMaterial = new THREE.MeshStandardMaterial({
    color: options.primaryColor || BOTANICAL_3D_PALETTE.forestGreen,
    roughness: 0.35,
    metalness: 0.12,
    wireframe: options.wireframe || false
  });

  const backboneMesh = new THREE.Mesh(tubeGeometry, ribbonMaterial);
  backboneMesh.castShadow = true;
  backboneMesh.receiveShadow = true;
  group.add(backboneMesh);

  // 2. Alpha Helix Ribbons (thickened spiral collars)
  const helixPoints = [];
  residues.forEach((r, idx) => {
    if (r.motif === 'helix') {
      helixPoints.push(r.pos);
    } else if (helixPoints.length > 3) {
      const hCurve = new THREE.CatmullRomCurve3([...helixPoints]);
      const hGeom = new THREE.TubeGeometry(hCurve, helixPoints.length * 4, 1.15, 8, false);
      const hMat = new THREE.MeshStandardMaterial({
        color: options.helixColor || BOTANICAL_3D_PALETTE.emerald,
        roughness: 0.28,
        metalness: 0.18
      });
      const hMesh = new THREE.Mesh(hGeom, hMat);
      group.add(hMesh);
      helixPoints.length = 0;
    } else {
      helixPoints.length = 0;
    }
  });

  // 3. Beta Sheet Pleated Strands (wider flat ribbons)
  const sheetPoints = [];
  residues.forEach((r) => {
    if (r.motif === 'sheet') {
      sheetPoints.push(r.pos);
    } else if (sheetPoints.length > 2) {
      const sCurve = new THREE.CatmullRomCurve3([...sheetPoints]);
      const sGeom = new THREE.TubeGeometry(sCurve, sheetPoints.length * 3, 1.25, 4, false);
      const sMat = new THREE.MeshStandardMaterial({
        color: options.sheetColor || BOTANICAL_3D_PALETTE.sageGreen,
        roughness: 0.32,
        metalness: 0.15
      });
      const sMesh = new THREE.Mesh(sGeom, sMat);
      group.add(sMesh);
      sheetPoints.length = 0;
    } else {
      sheetPoints.length = 0;
    }
  });

  return group;
}

/**
 * Builds the Space-Filling (CPK) Van der Waals Sphere representation
 */
export function createSpaceFillingMesh(residues, options = {}) {
  const group = new THREE.Group();
  if (!residues || residues.length === 0) return group;

  const sphereGeom = new THREE.SphereGeometry(1.65, 16, 16);
  const colorMap = {
    hydrophobic: new THREE.Color(BOTANICAL_3D_PALETTE.forestGreen),
    polar: new THREE.Color(BOTANICAL_3D_PALETTE.mutedTeal),
    acidic: new THREE.Color(BOTANICAL_3D_PALETTE.acidicCoral),
    basic: new THREE.Color(BOTANICAL_3D_PALETTE.basicGold)
  };

  const instancedMesh = new THREE.InstancedMesh(
    sphereGeom,
    new THREE.MeshStandardMaterial({
      roughness: 0.38,
      metalness: 0.10
    }),
    residues.length
  );

  const dummy = new THREE.Object3D();
  residues.forEach((r, i) => {
    dummy.position.copy(r.pos);
    dummy.scale.setScalar(options.scale || 1.0);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);

    const c = colorMap[r.type] || new THREE.Color(BOTANICAL_3D_PALETTE.sageGreen);
    instancedMesh.setColorAt(i, c);
  });

  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
  instancedMesh.castShadow = true;
  group.add(instancedMesh);

  return group;
}

/**
 * Builds the Ball-and-Stick Atomic Bonds representation
 */
export function createBallAndStickMesh(residues, options = {}) {
  const group = new THREE.Group();
  if (!residues || residues.length < 2) return group;

  // 1. Backbone and sidechain spheres
  const sphereGeom = new THREE.SphereGeometry(0.75, 14, 14);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: options.atomColor || BOTANICAL_3D_PALETTE.forestGreen,
    roughness: 0.3,
    metalness: 0.2
  });

  const instancedSpheres = new THREE.InstancedMesh(sphereGeom, sphereMat, residues.length);
  const dummy = new THREE.Object3D();

  residues.forEach((r, i) => {
    dummy.position.copy(r.pos);
    dummy.scale.setScalar(1.0);
    dummy.updateMatrix();
    instancedSpheres.setMatrixAt(i, dummy.matrix);
  });
  instancedSpheres.instanceMatrix.needsUpdate = true;
  group.add(instancedSpheres);

  // 2. Bond Cylinders connecting consecutive residues
  const cylinderGeom = new THREE.CylinderGeometry(0.22, 0.22, 1, 8);
  const cylinderMat = new THREE.MeshStandardMaterial({
    color: options.bondColor || BOTANICAL_3D_PALETTE.softMint,
    roughness: 0.45,
    metalness: 0.1
  });

  const numBonds = residues.length - 1;
  const instancedBonds = new THREE.InstancedMesh(cylinderGeom, cylinderMat, numBonds);
  const bondDummy = new THREE.Object3D();
  const yAxis = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < numBonds; i++) {
    const p1 = residues[i].pos;
    const p2 = residues[i + 1].pos;
    const distance = p1.distanceTo(p2);
    const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

    const orientation = new THREE.Vector3().subVectors(p2, p1).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(yAxis, orientation);

    bondDummy.position.copy(midPoint);
    bondDummy.quaternion.copy(quaternion);
    bondDummy.scale.set(1, distance, 1);
    bondDummy.updateMatrix();

    instancedBonds.setMatrixAt(i, bondDummy.matrix);
  }

  instancedBonds.instanceMatrix.needsUpdate = true;
  group.add(instancedBonds);

  return group;
}

/**
 * Builds a translucent Solvent-Accessible Surface envelope around the protein
 */
export function createSurfaceEnvelopeMesh(residues, options = {}) {
  const group = new THREE.Group();
  if (!residues || residues.length < 4) return group;

  const points = residues.map(r => r.pos);
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
  const surfaceGeom = new THREE.TubeGeometry(curve, residues.length * 3, 2.6, 12, false);

  const surfaceMat = new THREE.MeshPhysicalMaterial({
    color: options.surfaceColor || BOTANICAL_3D_PALETTE.sageGreen,
    transparent: true,
    opacity: 0.35,
    roughness: 0.25,
    metalness: 0.05,
    transmission: 0.2,
    depthWrite: false
  });

  const mesh = new THREE.Mesh(surfaceGeom, surfaceMat);
  group.add(mesh);

  // Internal delicate wireframe
  const wireGeom = new THREE.WireframeGeometry(surfaceGeom);
  const wireMat = new THREE.LineBasicMaterial({
    color: BOTANICAL_3D_PALETTE.forestGreen,
    transparent: true,
    opacity: 0.15
  });
  const wireLines = new THREE.LineSegments(wireGeom, wireMat);
  group.add(wireLines);

  return group;
}
