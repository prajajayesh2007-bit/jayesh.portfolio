/**
 * Jayesh - Electronics & Computer Science Portfolio JavaScript
 * Theme: Full 3D Interactive Cybernetic System
 * Features:
 * - Three.js 3D Quantum Silicon Microchip with Interactive Drag & Mouse Tilt
 * - 3D Perspective Cybernetic Background Scene (Depth particles & floating wireframe polyhedra)
 * - Gyroscopic 3D Parallax Tilt with Specular Glare on all Cards
 * - Dynamic Typewriter Headline Effect
 * - Interactive Digital Logic Lab (Logic Gates, Truth Tables, LED simulation)
 * - Project Architecture Modal with Hardware Pinouts & Code Snippets
 * - Interactive Contact Form with Validation & Toast Alerts
 * - Mobile Navigation & Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  init3DSpaceBackground();
  init3DQuantumChip();
  init3DCardTilt();
  initLogicLab();
  initProjectModals();
  initContactForm();
  initMobileNav();
  initHoloSwitcher();
  initYear();
});

/* ==========================================================================
   1. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    "Jayesh Prajapati | B.Tech ECS",
    "IoT & Embedded Systems Prototyper",
    "2nd Year Engineering Student @ SLRTCE",
    "C++ & Python Software Developer",
    "Hardware-Software Systems Integrator"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 350; // Brief pause before next phrase
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   2. 3D Perspective WebGL Background Scene
   ========================================================================== */
function init3DSpaceBackground() {
  const canvas = document.getElementById('space-3d-canvas');
  if (!canvas) return;

  // If Three.js is loaded, use Three.js 3D scene
  if (typeof THREE !== 'undefined') {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      camera.position.z = 80;

      // 3D Particles Matrix with z-depth
      const particleCount = 180;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const color1 = new THREE.Color(0x00f2fe);
      const color2 = new THREE.Color(0x818cf8);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 160;
        positions[i + 1] = (Math.random() - 0.5) * 160;
        positions[i + 2] = (Math.random() - 0.5) * 120;

        const mixedColor = Math.random() > 0.5 ? color1 : color2;
        colors[i] = mixedColor.r;
        colors[i + 1] = mixedColor.g;
        colors[i + 2] = mixedColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.55
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // Floating 3D Wireframe Cyber Polyhedra (Logic Cubes)
      const shapesGroup = new THREE.Group();
      scene.add(shapesGroup);

      const cubeGeo = new THREE.BoxGeometry(4.5, 4.5, 4.5);
      const octaGeo = new THREE.OctahedronGeometry(4);

      const wireMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.22 });
      const wireMaterial2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.22 });

      for (let i = 0; i < 7; i++) {
        const mesh = new THREE.Mesh(i % 2 === 0 ? cubeGeo : octaGeo, i % 2 === 0 ? wireMaterial1 : wireMaterial2);
        mesh.position.set(
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 60 - 20
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        shapesGroup.add(mesh);
      }

      let mouseX = 0, mouseY = 0;
      let targetMouseX = 0, targetMouseY = 0;

      window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      function animateThree() {
        requestAnimationFrame(animateThree);

        // Smooth camera parallax
        mouseX += (targetMouseX - mouseX) * 0.04;
        mouseY += (targetMouseY - mouseY) * 0.04;

        camera.position.x = mouseX * 12;
        camera.position.y = -mouseY * 12;
        camera.lookAt(scene.position);

        particleSystem.rotation.y += 0.0008;
        particleSystem.rotation.x += 0.0004;

        shapesGroup.children.forEach((mesh, index) => {
          mesh.rotation.x += 0.004 * (index % 2 === 0 ? 1 : -1);
          mesh.rotation.y += 0.005;
        });

        renderer.render(scene, camera);
      }

      animateThree();
      return;
    } catch (e) {
      console.warn("Three.js WebGL fallback activated:", e);
    }
  }

  // Pure Canvas Fallback (3D Projected Starfield & Logic Nodes)
  initCanvas3DFallback(canvas);
}

function initCanvas3DFallback(canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  const starCount = 120;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        size: Math.random() * 2 + 1
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function animateStars() {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.z -= 0.6;
      if (star.z <= 0) {
        star.z = width;
        star.x = (Math.random() - 0.5) * width * 2;
        star.y = (Math.random() - 0.5) * height * 2;
      }

      const k = 280 / star.z;
      const px = star.x * k + cx;
      const py = star.y * k + cy;

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        const alpha = Math.min(1, (1 - star.z / width) * 1.5);
        ctx.fillStyle = `rgba(0, 242, 254, ${alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.8, star.size * k), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(animateStars);
  }

  animateStars();
}

/* ==========================================================================
   3. Interactive 3D Quantum Silicon Microchip (Hero Card)
   ========================================================================== */
function init3DQuantumChip() {
  const canvas = document.getElementById('chip-3d-canvas');
  const wrapper = document.getElementById('chip-3d-wrapper');
  if (!canvas || !wrapper) return;

  if (typeof THREE !== 'undefined') {
    try {
      const rect = wrapper.getBoundingClientRect();
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 100);
      camera.position.set(0, 0, 16);

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x00f2fe, 3.5, 30);
      pointLight1.position.set(8, 8, 10);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xa855f7, 3, 30);
      pointLight2.position.set(-8, -6, 8);
      scene.add(pointLight2);

      // 3D Chip Group
      const chipGroup = new THREE.Group();
      scene.add(chipGroup);

      // Central Silicon Substrate
      const chipGeo = new THREE.BoxGeometry(6.2, 6.2, 0.8);
      const chipMat = new THREE.MeshStandardMaterial({
        color: 0x0a101f,
        metalness: 0.85,
        roughness: 0.25,
        wireframe: false
      });
      const chipMesh = new THREE.Mesh(chipGeo, chipMat);
      chipGroup.add(chipMesh);

      // Gold / Copper Metallic Die Core
      const coreGeo = new THREE.BoxGeometry(3.6, 3.6, 0.95);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.95,
        roughness: 0.15,
        emissive: 0x003b5c,
        emissiveIntensity: 0.4
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      chipGroup.add(coreMesh);

      // Circuit lines overlay wireframe
      const circuitGeo = new THREE.BoxGeometry(3.8, 3.8, 1.0);
      const circuitMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const circuitMesh = new THREE.Mesh(circuitGeo, circuitMat);
      chipGroup.add(circuitMesh);

      // Metallic Pins on all 4 sides of the chip
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.95,
        roughness: 0.1
      });

      const pinGeo = new THREE.BoxGeometry(0.35, 0.8, 0.25);
      const numPinsPerSide = 6;
      const spacing = 5.2 / (numPinsPerSide - 1);

      for (let i = 0; i < numPinsPerSide; i++) {
        const offset = -2.6 + i * spacing;

        // Top Pins
        const pinTop = new THREE.Mesh(pinGeo, pinMat);
        pinTop.position.set(offset, 3.4, 0);
        chipGroup.add(pinTop);

        // Bottom Pins
        const pinBottom = new THREE.Mesh(pinGeo, pinMat);
        pinBottom.position.set(offset, -3.4, 0);
        chipGroup.add(pinBottom);

        // Left Pins
        const pinLeft = new THREE.Mesh(pinGeo, pinMat);
        pinLeft.rotation.z = Math.PI / 2;
        pinLeft.position.set(-3.4, offset, 0);
        chipGroup.add(pinLeft);

        // Right Pins
        const pinRight = new THREE.Mesh(pinGeo, pinMat);
        pinRight.rotation.z = Math.PI / 2;
        pinRight.position.set(3.4, offset, 0);
        chipGroup.add(pinRight);
      }

      // Orbital Holographic Rings in 3D
      const ringGeo1 = new THREE.TorusGeometry(5.2, 0.05, 16, 64);
      const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.75 });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      chipGroup.add(ring1);

      const ringGeo2 = new THREE.TorusGeometry(6.4, 0.04, 16, 64);
      const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.6 });
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      chipGroup.add(ring2);

      // Mouse & Drag Interaction
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let targetRotationX = 0.35;
      let targetRotationY = -0.45;

      wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      wrapper.addEventListener('mousemove', (e) => {
        if (isDragging) {
          const deltaX = e.clientX - previousMousePosition.x;
          const deltaY = e.clientY - previousMousePosition.y;

          targetRotationY += deltaX * 0.015;
          targetRotationX += deltaY * 0.015;

          previousMousePosition = { x: e.clientX, y: e.clientY };
        } else {
          // Hover tilt
          const r = wrapper.getBoundingClientRect();
          const normX = (e.clientX - r.left) / r.width - 0.5;
          const normY = (e.clientY - r.top) / r.height - 0.5;

          targetRotationY = normX * 1.2;
          targetRotationX = -normY * 1.2;
        }
      });

      wrapper.addEventListener('mouseleave', () => {
        if (!isDragging) {
          targetRotationX = 0.3;
          targetRotationY = -0.4;
        }
      });

      // Handle window resize for chip canvas
      window.addEventListener('resize', () => {
        const r = wrapper.getBoundingClientRect();
        if (r.width && r.height) {
          camera.aspect = r.width / r.height;
          camera.updateProjectionMatrix();
          renderer.setSize(r.width, r.height);
        }
      });

      function renderChip() {
        requestAnimationFrame(renderChip);

        // Smooth interpolation
        chipGroup.rotation.x += (targetRotationX - chipGroup.rotation.x) * 0.08;
        chipGroup.rotation.y += (targetRotationY - chipGroup.rotation.y) * 0.08;

        // Auto orbital spin
        ring1.rotation.z += 0.02;
        ring1.rotation.x = Math.sin(Date.now() * 0.001) * 0.5;
        ring2.rotation.z -= 0.015;
        ring2.rotation.y = Math.cos(Date.now() * 0.001) * 0.5;

        renderer.render(scene, camera);
      }

      renderChip();
      return;
    } catch (e) {
      console.warn("Three.js chip rendering fallback activated:", e);
    }
  }

  // 2D Canvas Isometric 3D Projection Fallback
  init2DIsoChipFallback(canvas, wrapper);
}

function init2DIsoChipFallback(canvas, wrapper) {
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = wrapper.clientWidth;
    height = canvas.height = wrapper.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let angle = 0;
  function drawIso() {
    ctx.clearRect(0, 0, width, height);
    angle += 0.02;

    const cx = width / 2;
    const cy = height / 2;

    // Outer glow ring
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 65, 35, angle, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#a855f7';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 78, 42, -angle * 0.8, 0, Math.PI * 2);
    ctx.stroke();

    // Central Chip Body
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(cx - 35, cy - 35, 70, 70);
    ctx.fill();
    ctx.stroke();

    // Golden Core
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(cx - 20, cy - 20, 40, 40);

    requestAnimationFrame(drawIso);
  }
  drawIso();
}

/* ==========================================================================
   4. Gyroscopic 3D Parallax Tilt with Specular Glare on Cards
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll(`
    .interactive-hologram-card,
    .about-card,
    .skill-category-card,
    .project-card,
    .education-card,
    .contact-card,
    .contact-form
  `);

  cards.forEach(card => {
    card.classList.add('tilt-card');

    // Create & append dynamic specular glare layer if not already present
    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    const maxTilt = 12; // Maximum tilt angle in degrees

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;

      const rotateX = -normY * maxTilt;
      const rotateY = normX * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02) translateZ(12px)`;

      card.style.setProperty('--glare-x', `${x}px`);
      card.style.setProperty('--glare-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)`;
    });
  });
}

/* ==========================================================================
   5. Interactive Digital Logic Gate Lab (ECS Special Feature)
   ========================================================================== */
function initLogicLab() {
  const gateButtons = document.querySelectorAll('.gate-btn');
  const toggleA = document.getElementById('input-a-toggle');
  const toggleB = document.getElementById('input-b-toggle');
  const groupB = document.getElementById('group-input-b');
  const valA = document.getElementById('val-a');
  const valB = document.getElementById('val-b');
  const wireA = document.querySelector('.wire-a');
  const wireB = document.querySelector('.wire-b');
  const wireStateA = document.getElementById('wire-state-a');
  const wireStateB = document.getElementById('wire-state-b');
  const wireOut = document.getElementById('wire-out');
  const outputLed = document.getElementById('output-led');
  const ledStateText = document.getElementById('led-state-text');
  const gateFormula = document.getElementById('gate-formula');
  const icGateTitle = document.getElementById('ic-gate-title');
  const truthTableBody = document.getElementById('truth-table-body');
  const gateSvg = document.getElementById('gate-svg');
  const btnToggleAll = document.getElementById('btn-toggle-all');
  const btnReset = document.getElementById('btn-reset-inputs');

  let currentGate = 'AND';
  let stateA = 0;
  let stateB = 0;

  // Gate specifications & SVG symbols
  const gateConfigs = {
    AND: {
      name: 'AND GATE',
      formula: 'Y = A • B',
      ic: '74LS08',
      compute: (a, b) => a & b,
      svg: `<path d="M 10 10 L 45 10 A 20 20 0 0 1 45 50 L 10 50 Z" fill="none" stroke="currentColor" stroke-width="3"/>
            <line x1="0" y1="20" x2="10" y2="20" stroke="currentColor" stroke-width="3"/>
            <line x1="0" y1="40" x2="10" y2="40" stroke="currentColor" stroke-width="3"/>
            <line x1="65" y1="30" x2="95" y2="30" stroke="currentColor" stroke-width="3"/>`,
      twoInputs: true
    },
    OR: {
      name: 'OR GATE',
      formula: 'Y = A + B',
      ic: '74LS32',
      compute: (a, b) => a | b,
      svg: `<path d="M 10 10 Q 35 12 65 30 Q 35 48 10 50 Q 25 30 10 10 Z" fill="none" stroke="currentColor" stroke-width="3"/>
            <line x1="0" y1="20" x2="18" y2="20" stroke="currentColor" stroke-width="3"/>
            <line x1="0" y1="40" x2="18" y2="40" stroke="currentColor" stroke-width="3"/>
            <line x1="65" y1="30" x2="95" y2="30" stroke="currentColor" stroke-width="3"/>`,
      twoInputs: true
    },
    XOR: {
      name: 'XOR GATE',
      formula: 'Y = A ⊕ B',
      ic: '74LS86',
      compute: (a, b) => a ^ b,
      svg: `<path d="M 16 10 Q 40 12 70 30 Q 40 48 16 50 Q 30 30 16 10 Z" fill="none" stroke="currentColor" stroke-width="3"/>
            <path d="M 8 10 Q 22 30 8 50" fill="none" stroke="currentColor" stroke-width="3"/>
            <line x1="0" y1="20" x2="12" y2="20" stroke="currentColor" stroke-width="3"/>
            <line x1="0" y1="40" x2="12" y2="40" stroke="currentColor" stroke-width="3"/>
            <line x1="70" y1="30" x2="95" y2="30" stroke="currentColor" stroke-width="3"/>`,
      twoInputs: true
    },
    NAND: {
      name: 'NAND GATE',
      formula: 'Y = (A • B)\'',
      ic: '74LS00',
      compute: (a, b) => (a & b) ? 0 : 1,
      svg: `<path d="M 10 10 L 45 10 A 20 20 0 0 1 45 50 L 10 50 Z" fill="none" stroke="currentColor" stroke-width="3"/>
            <circle cx="69" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <line x1="0" y1="20" x2="10" y2="20" stroke="currentColor" stroke-width="3"/>
            <line x1="0" y1="40" x2="10" y2="40" stroke="currentColor" stroke-width="3"/>
            <line x1="73" y1="30" x2="95" y2="30" stroke="currentColor" stroke-width="3"/>`,
      twoInputs: true
    },
    NOR: {
      name: 'NOR GATE',
      formula: 'Y = (A + B)\'',
      ic: '74LS02',
      compute: (a, b) => (a | b) ? 0 : 1,
      svg: `<path d="M 10 10 Q 35 12 65 30 Q 35 48 10 50 Q 25 30 10 10 Z" fill="none" stroke="currentColor" stroke-width="3"/>
            <circle cx="69" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <line x1="0" y1="20" x2="18" y2="20" stroke="currentColor" stroke-width="3"/>
            <line x1="0" y1="40" x2="18" y2="40" stroke="currentColor" stroke-width="3"/>
            <line x1="73" y1="30" x2="95" y2="30" stroke="currentColor" stroke-width="3"/>`,
      twoInputs: true
    },
    NOT: {
      name: 'NOT INVERTER',
      formula: 'Y = A\'',
      ic: '74LS04',
      compute: (a) => a ? 0 : 1,
      svg: `<polygon points="15,10 65,30 15,50" fill="none" stroke="currentColor" stroke-width="3"/>
            <circle cx="69" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <line x1="0" y1="30" x2="15" y2="30" stroke="currentColor" stroke-width="3"/>
            <line x1="73" y1="30" x2="95" y2="30" stroke="currentColor" stroke-width="3"/>`,
      twoInputs: false
    }
  };

  function updateSimulation() {
    const config = gateConfigs[currentGate];
    const output = config.compute(stateA, stateB);

    // Update Input A UI
    toggleA.classList.toggle('active', stateA === 1);
    valA.textContent = stateA;
    wireA.classList.toggle('active', stateA === 1);
    wireStateA.classList.toggle('active', stateA === 1);
    wireStateA.textContent = stateA === 1 ? 'HIGH (+5V)' : 'LOW (0V)';

    // Update Input B UI (handle single-input NOT gate)
    if (config.twoInputs) {
      groupB.style.display = 'flex';
      toggleB.classList.toggle('active', stateB === 1);
      valB.textContent = stateB;
      wireB.classList.toggle('active', stateB === 1);
      wireStateB.classList.toggle('active', stateB === 1);
      wireStateB.textContent = stateB === 1 ? 'HIGH (+5V)' : 'LOW (0V)';
    } else {
      groupB.style.display = 'none';
      wireB.classList.remove('active');
      wireStateB.classList.remove('active');
      wireStateB.textContent = 'UNUSED (N/C)';
    }

    // Update IC & Formula
    icGateTitle.textContent = config.name;
    gateFormula.textContent = config.formula;
    gateSvg.innerHTML = config.svg;
    const icLabel = document.querySelector('.ic-label');
    if (icLabel) icLabel.textContent = config.ic;

    // Update Output UI & Glowing LED
    wireOut.classList.toggle('active', output === 1);
    outputLed.classList.toggle('active', output === 1);
    ledStateText.classList.toggle('active', output === 1);
    ledStateText.textContent = output === 1 ? 'HIGH (+5V / Logic 1)' : 'LOW (0V / Logic 0)';

    // Render & Highlight Truth Table
    renderTruthTable(config, output);
  }

  function renderTruthTable(config, currentOutput) {
    let rowsHtml = '';
    const isTwoInput = config.twoInputs;

    const combos = isTwoInput
      ? [
          { a: 0, b: 0 },
          { a: 0, b: 1 },
          { a: 1, b: 0 },
          { a: 1, b: 1 }
        ]
      : [
          { a: 0, b: '-' },
          { a: 1, b: '-' }
        ];

    combos.forEach(c => {
      const out = isTwoInput ? config.compute(c.a, c.b) : config.compute(c.a);
      const isActive = isTwoInput 
        ? (c.a === stateA && c.b === stateB)
        : (c.a === stateA);

      rowsHtml += `
        <tr class="${isActive ? 'active-row' : ''}">
          <td><strong>${c.a}</strong></td>
          <td><strong>${c.b}</strong></td>
          <td><span class="${out === 1 ? 'text-cyan' : ''}">${out}</span></td>
        </tr>
      `;
    });

    truthTableBody.innerHTML = rowsHtml;
  }

  // Gate selection buttons
  gateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      gateButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGate = btn.getAttribute('data-gate');
      updateSimulation();
    });
  });

  // Toggle Switches
  toggleA.addEventListener('click', () => {
    stateA = stateA === 0 ? 1 : 0;
    updateSimulation();
  });

  toggleB.addEventListener('click', () => {
    stateB = stateB === 0 ? 1 : 0;
    updateSimulation();
  });

  // Quick Action Buttons
  btnToggleAll.addEventListener('click', () => {
    stateA = stateA === 0 ? 1 : 0;
    stateB = stateB === 0 ? 1 : 0;
    updateSimulation();
  });

  btnReset.addEventListener('click', () => {
    stateA = 0;
    stateB = 0;
    updateSimulation();
  });

  // Initial Run
  updateSimulation();
}

/* ==========================================================================
   6. Project Details Modal System
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const viewBtns = document.querySelectorAll('.view-project-btn');

  // Detailed Project Engineering Specifications
  const projectDetails = {
    'iot-station': {
      title: 'IoT Smart Environmental & Air Quality Monitor',
      tags: ['ESP32', 'MQ-135 Gas Sensor', 'DHT22', 'FreeRTOS', 'WebSockets', 'Chart.js'],
      description: `
        This project addresses indoor air quality safety by deploying an ESP32 microcontroller that samples 
        environmental parameters every 2 seconds. The firmware calculates PPM concentrations of hazardous gases 
        such as Carbon Monoxide (CO), Ammonia (NH3), and general VOCs while concurrently reading ambient temperature 
        and relative humidity.
      `,
      hardwareSpecs: [
        { item: 'Microcontroller', detail: 'ESP32 dual-core Xtensa 32-bit LX6 @ 240MHz' },
        { item: 'Sensors', detail: 'MQ-135 (Analog A0 -> GPIO 34), DHT22 (Digital -> GPIO 4)' },
        { item: 'Actuators', detail: 'Piezo Buzzer (GPIO 18) & RGB Status LED (GPIO 19, 21, 22)' },
        { item: 'Connectivity', detail: '802.11 b/g/n Wi-Fi with WebSocket telemetry streaming' }
      ],
      softwareFlow: `
        1. ESP32 connects to local Wi-Fi and initializes dual FreeRTOS tasks (Sensor Read Task & Network Client).
        2. Analog voltages from MQ-135 are converted to AQI index using polynomial calibration curves.
        3. Telemetry is serialized to JSON and broadcasted to connected web clients via WebSockets.
        4. Front-end dashboard dynamically graphs trends using Chart.js without page reload.
      `,
      codeSnippet: `// ESP32 Sensor Loop & WebSocket Broadcast
void handleTelemetry() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int rawGas = analogRead(MQ135_PIN);
  float ppm = calculatePPM(rawGas);

  DynamicJsonDocument doc(256);
  doc["temp"] = temp;
  doc["hum"] = hum;
  doc["ppm"] = ppm;
  doc["status"] = (ppm > 250) ? "ALERT" : "NORMAL";

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  webSocket.broadcastTXT(jsonPayload);
}`
    },

    'gesture-rover': {
      title: 'Edge Computer-Vision Gesture Controlled Rover',
      tags: ['Python', 'OpenCV', 'MediaPipe', 'Arduino Uno', 'L298N H-Bridge', 'Serial Protocol'],
      description: `
        A physical 4WD robotics project combining computer vision with embedded motor actuation. A computer webcam 
        captures live video, processes 21 distinct hand landmarks using Google MediaPipe, detects gesture intent 
        (Forward, Reverse, Turn Left, Turn Right, Stop), and streams low-latency serial packets to an onboard Arduino Uno.
      `,
      hardwareSpecs: [
        { item: 'Vehicle Platform', detail: '4WD Acrylic Chassis with 4x DC Geared Motors' },
        { item: 'Embedded Brain', detail: 'Arduino Uno (ATmega328P) running interrupt-driven motor control' },
        { item: 'Driver Circuit', detail: 'L298N Dual H-Bridge Motor Driver with PWM speed modulation' },
        { item: 'Power Supply', detail: '2x 18650 3.7V Li-ion batteries (7.4V regulated)' }
      ],
      softwareFlow: `
        1. Python script opens OpenCV video stream at 60 FPS.
        2. MediaPipe detects hand landmarks (thumb tip, index tip, wrist coordinate geometry).
        3. Euclidean distance between index tip and wrist calculates directional gestures.
        4. Serial command ('F', 'B', 'L', 'R', 'S') sent via PySerial at 115200 baud to Arduino.
        5. Arduino adjusts PWM pins on L298N to smoothly steer the chassis.
      `,
      codeSnippet: `# Python Hand Tracking & Serial Transmission
import cv2, serial
from cvzone.HandTrackingModule import HandDetector

ser = serial.Serial('COM3', 115200, timeout=1)
detector = HandDetector(maxHands=1, detectionCon=0.8)
cap = cv2.VideoCapture(0)

while True:
    success, img = cap.read()
    hands, img = detector.findHands(img)
    if hands:
        fingers = detector.fingersUp(hands[0])
        if fingers == [0, 1, 0, 0, 0]: # Index finger up -> Forward
            ser.write(b'F')
        elif fingers == [0, 1, 1, 0, 0]: # Two fingers -> Reverse
            ser.write(b'B')
        elif fingers == [0, 0, 0, 0, 0]: # Fist -> Stop
            ser.write(b'S')`
    },

    'rfid-attendance': {
      title: 'Smart Contactless RFID Campus Access System',
      tags: ['ESP8266', 'MFRC522 RFID', 'SPI Protocol', 'Node.js', 'Express', 'SQLite', 'I2C OLED'],
      description: `
        Engineered specifically for engineering laboratories at SLRTCE to replace manual paper registers. 
        Students tap their 13.56MHz RFID cards or keyfobs onto the reader; the device queries the backend 
        database, displays the student name and roll number on a crisp 0.96" OLED screen, and logs entry timestamps.
      `,
      hardwareSpecs: [
        { item: 'Microcontroller', detail: 'NodeMCU ESP8266 Wi-Fi Module' },
        { item: 'RFID Reader', detail: 'MFRC522 13.56 MHz Reader via SPI (SCK, MOSI, MISO, SDA)' },
        { item: 'Display', detail: '0.96 inch SSD1306 OLED (I2C address: 0x3C)' },
        { item: 'Feedback', detail: 'Buzzer beep on valid authentication / double beep on denial' }
      ],
      softwareFlow: `
        1. Student taps RFID card against RC522 reader.
        2. ESP8266 captures unique UID byte array and sends HTTP POST to Node.js backend.
        3. Backend runs parameter-prepared SQL query against SQLite database to match UID.
        4. If matched, response returns student details, logs record with ISO timestamp.
        5. OLED instantly updates with student verification message and greeting.
      `,
      codeSnippet: `// ESP8266 SPI RFID Read Loop
if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) return;

String cardUID = "";
for (byte i = 0; i < mfrc522.uid.size; i++) {
  cardUID += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
  cardUID += String(mfrc522.uid.uidByte[i], HEX);
}
cardUID.toUpperCase();

// Transmit to SLRTCE Attendance Server
HTTPClient http;
http.begin(wifiClient, "http://192.168.1.50:5000/api/attendance");
http.addHeader("Content-Type", "application/json");
int httpCode = http.POST("{\"uid\":\"" + cardUID + "\"}");`
    },

    'logic-simulator': {
      title: 'Web-Based Digital Logic & Micro-Op Simulator',
      tags: ['JavaScript (ES6)', 'HTML5 Canvas API', 'Boolean Algebra', 'Digital Architecture'],
      description: `
        An educational simulation suite demonstrating fundamental principles of digital circuits taught in 
        second-year Electronics & Computer Science engineering. Simulates gate propagation, truth table evaluation, 
        and combinational arithmetic units like Half-Adders and Multiplexers.
      `,
      hardwareSpecs: [
        { item: 'Logic Families', detail: 'Simulates TTL 7400 series logic propagation & gate delays' },
        { item: 'Circuit Models', detail: 'AND, OR, NOT, NAND, NOR, XOR, and 1-bit Half Adders' },
        { item: 'Interface', detail: 'Dynamic wire glow visualizer, live truth table highlighting' }
      ],
      softwareFlow: `
        1. Logic gate state graph constructed from interactive UI toggles.
        2. Evaluates Boolean algebra expressions synchronously with sub-millisecond recalculation.
        3. Emits glowing visual pulses along schematic paths to depict electrical conduction.
      `,
      codeSnippet: `// Digital Logic Evaluation Engine
class LogicGate {
  constructor(type) {
    this.type = type;
  }
  evaluate(a, b) {
    switch(this.type) {
      case 'AND': return a & b;
      case 'OR':  return a | b;
      case 'XOR': return a ^ b;
      case 'NAND': return !(a & b) ? 1 : 0;
      case 'NOR':  return !(a | b) ? 1 : 0;
      case 'NOT':  return a ? 0 : 1;
      default: return 0;
    }
  }
}`
    }
  };

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectDetails[projKey];
      if (!data) return;

      let specsHtml = '';
      if (data.hardwareSpecs) {
        specsHtml = `
          <h4 class="modal-section-title"><i class="fa-solid fa-microchip"></i> Hardware &amp; Pinout Specifications</h4>
          <table class="modal-spec-table">
            <thead>
              <tr><th>Component / Bus</th><th>Specification &amp; Wiring Details</th></tr>
            </thead>
            <tbody>
              ${data.hardwareSpecs.map(s => `<tr><td><strong>${s.item}</strong></td><td>${s.detail}</td></tr>`).join('')}
            </tbody>
          </table>
        `;
      }

      modalBody.innerHTML = `
        <div class="modal-project-header">
          <h2 class="modal-project-title">${data.title}</h2>
          <div class="modal-tags">
            ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-circle-info"></i> Project Overview</h4>
        <p class="modal-body-text">${data.description}</p>

        ${specsHtml}

        <h4 class="modal-section-title"><i class="fa-solid fa-code-fork"></i> Software &amp; Data Pipeline</h4>
        <p class="modal-body-text" style="white-space: pre-line;">${data.softwareFlow}</p>

        <h4 class="modal-section-title"><i class="fa-solid fa-code"></i> Firmware / Core Code Snippet</h4>
        <pre class="modal-code-snippet"><code>${escapeHtml(data.codeSnippet)}</code></pre>
      `;

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   7. Interactive Contact Form with Validation & Toast Alerts
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Reset error styles
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending with loading state
    submitBtn.classList.add('submitting');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('submitting');
      submitBtn.disabled = false;
      const userName = nameInput.value.trim();
      form.reset();

      showToast(`Thank you, ${userName || 'friend'}! Your message was received. Jayesh Prajapati will reply shortly.`);
    }, 1200);
  });

  // Remove error on typing
  [nameInput, emailInput, messageInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', () => {
        inp.closest('.form-group').classList.remove('has-error');
      });
    }
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-cyan"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

/* ==========================================================================
   8. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* ==========================================================================
   9. Dynamic Footer Year
   ========================================================================== */
function initYear() {
  const el = document.getElementById('year-copy');
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   10. Hologram Photo & 3D Core View Switcher
   ========================================================================== */
function initHoloSwitcher() {
  const btnPhoto = document.getElementById('tab-btn-photo');
  const btnChip = document.getElementById('tab-btn-chip');
  const viewPhoto = document.getElementById('holo-view-photo');
  const viewChip = document.getElementById('holo-view-chip');

  if (!btnPhoto || !btnChip || !viewPhoto || !viewChip) return;

  btnPhoto.addEventListener('click', () => {
    btnPhoto.classList.add('active');
    btnChip.classList.remove('active');
    viewPhoto.style.display = 'flex';
    viewChip.style.display = 'none';
  });

  btnChip.addEventListener('click', () => {
    btnChip.classList.add('active');
    btnPhoto.classList.remove('active');
    viewPhoto.style.display = 'none';
    viewChip.style.display = 'flex';
    // Trigger window resize so Three.js canvas sizes properly
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  });
}
