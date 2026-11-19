// Three.js 3D Kinetic Wireframe Octagon Scene
// Ported & Optimized for SYNAPSE 2027 Hero Canvas

function initThreeHero() {
  const container = document.getElementById('threejs-hero-container');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 600;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // 1. Kinetic Octagon Wireframe
  const octagonPoints = [];
  const segments = 8;
  const radius = 9;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    octagonPoints.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
  }
  const octagonGeo = new THREE.BufferGeometry().setFromPoints(octagonPoints);
  const octagonMat = new THREE.LineBasicMaterial({ color: 0xC90016, linewidth: 2, transparent: true, opacity: 0.85 });
  const octagonLine = new THREE.Line(octagonGeo, octagonMat);
  group.add(octagonLine);

  // 2. Concentric Telemetry Rings
  const outerRingGeo = new THREE.RingGeometry(11, 11.2, 32);
  const outerRingMat = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide, transparent: true, opacity: 0.35, wireframe: true });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  group.add(outerRing);

  const innerRingGeo = new THREE.RingGeometry(6.8, 7.0, 32);
  const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xC90016, side: THREE.DoubleSide, transparent: true, opacity: 0.25, wireframe: true });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  group.add(innerRing);

  // 3. Floating Kinetic Telemetry Particles
  const particleCount = 140;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 36;
    positions[i + 1] = (Math.random() - 0.5) * 26;
    positions[i + 2] = (Math.random() - 0.5) * 20;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x111111,
    size: 0.25,
    transparent: true,
    opacity: 0.4
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  group.add(particleSystem);

  // Mouse Parallax Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotationY = mouseX * 0.45;
    targetRotationX = mouseY * 0.3;
  });

  // Responsive Resize
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth || window.innerWidth;
    const newHeight = container.clientHeight || 600;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  // Animation Loop with Scroll-Pause Optimization
  let isVisible = true;
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(container);

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    group.rotation.z += 0.003;
    outerRing.rotation.z -= 0.002;
    
    // Smooth mouse tilt lerp
    group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
    group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  animate();
}

window.addEventListener('DOMContentLoaded', initThreeHero);
