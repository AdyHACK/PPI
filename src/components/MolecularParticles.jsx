import React, { useRef, useEffect } from 'react';

/**
 * MolecularParticles: Restrained floating biological cofactors, ions, and fine connecting filaments
 * with subtle cursor proximity response and auto-pause when hidden.
 */
export default function MolecularParticles({ 
  className = '', 
  particleCount = 20, 
  connectDistance = 85,
  speed = 0.32 
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.clientWidth || 300;
    let height = canvas.clientHeight || 200;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Initialize particles
    const particles = [];
    const colors = ['#91A88F', '#6B9B8B', '#A8B393', '#234737'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: 1.4 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.22 + Math.random() * 0.35
      });
    }

    let animationId;
    let isVisible = true;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // Draw connecting filaments
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            const lineAlpha = (1 - dist / connectDistance) * 0.14;
            ctx.strokeStyle = `rgba(145, 168, 143, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach(p => {
        // Subtle mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const mDist = Math.sqrt(dx * dx + dy * dy);
        if (mDist < 70) {
          const force = (1 - mDist / 70) * 0.6;
          p.x += (dx / mDist) * force;
          p.y += (dy / mDist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    const resizeObserver = new ResizeObserver(() => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    });
    resizeObserver.observe(canvas);

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) render();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [particleCount, connectDistance, speed]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none ${className}`} 
    />
  );
}
