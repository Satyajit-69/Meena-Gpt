import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

export default function Home() {
  const canvasRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Base geometry: icosahedron, subdivided so displacement reads smoothly
    const geometry = new THREE.IcosahedronGeometry(2, 6);
    const basePositions = geometry.attributes.position.array.slice();

    const material = new THREE.MeshBasicMaterial({
      color: 0x6c5ce7,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });

    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    // A second, larger, dimmer shell for depth
    const shellGeo = new THREE.IcosahedronGeometry(2.35, 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    // Ambient particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 3.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePos, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xffb020,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let pointerX = 0;
    let pointerY = 0;
    let targetIntensity = 0.4;
    let intensity = 0.4;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetIntensity = 0.9;
    };
    const handlePointerLeave = () => {
      targetIntensity = 0.4;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      const t = clock.getElapsedTime();
      intensity += (targetIntensity - intensity) * 0.05;

      // Displace vertices with layered sine waves for an organic pulse
      const posAttr = geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const ix = i * 3;
        const bx = basePositions[ix];
        const by = basePositions[ix + 1];
        const bz = basePositions[ix + 2];
        const len = Math.sqrt(bx * bx + by * by + bz * bz);
        const nx = bx / len;
        const ny = by / len;
        const nz = bz / len;

        const wave =
          Math.sin(nx * 4 + t * 1.3) * 0.12 +
          Math.sin(ny * 5 - t * 1.7) * 0.1 +
          Math.sin(nz * 3 + t * 0.9) * 0.14;

        const displacement = 1 + wave * intensity;
        posAttr.setXYZ(
          i,
          bx * displacement,
          by * displacement,
          bz * displacement,
        );
      }
      posAttr.needsUpdate = true;

      orb.rotation.y = t * 0.12 + pointerX * 0.3;
      orb.rotation.x = t * 0.06 + pointerY * 0.2;
      shell.rotation.y = -t * 0.05;
      shell.rotation.x = t * 0.04;
      particles.rotation.y = t * 0.03;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      geometry.dispose();
      shellGeo.dispose();
      particleGeo.dispose();
      material.dispose();
      shellMat.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#0A0812] px-6 md:px-16"
    >

        
           {/* Grid background, fading from top-left */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to left, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at top right, black 0%, transparent 60%)",
          WebkitMaskImage:
            "radial-gradient(circle at top right, black 0%, transparent 60%)",
        }}
      />


      {/* ambient background glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-[#6C5CE7] opacity-20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#00D4FF] opacity-10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Copy */}
        <div className="order-2 md:order-1">
          <span className="mb-5 inline-block rounded-full border border-white/10 px-4 py-1 font-mono text-xs tracking-wide text-[#00D4FF]">
           Welcome to MEENAGPT 
          </span>
          <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-white md:text-6xl">
            An AI that
            <br />
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] bg-clip-text text-transparent">
              thinks before
            </span>
            <br />
            it answers.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
            Meena reasons through your questions in the open — watch it listen,
            think, and respond in real time.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/main-chat")}
              className="rounded-full bg-white px-7 py-3 font-medium text-[#0A0812] transition hover:bg-white/90"
            >
              Start chatting
            </button>
            <button
              onClick={() => {
                navigate("#about");
              }}
              className="rounded-full border border-white/20 px-7 py-3 font-medium text-white transition hover:border-white/40"
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Orb */}
        <div className="order-1 flex h-[22rem] items-center justify-center md:order-2 md:h-[32rem]">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
