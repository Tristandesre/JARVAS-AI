import { CameraMotionFrame } from '../types';

/**
 * Computes camera motion parameters (zoom, pan, tilt, rotation) for a given timestamp and style
 */
export function estimateCameraMotionAtTime(
  time: number,
  duration: number,
  style: string = 'cyber-kpop',
  bpm: number = 120
): CameraMotionFrame {
  const beatDuration = 60 / bpm;
  const beat = time / beatDuration;
  const normalizedTime = Math.min(Math.max(time / Math.max(duration, 1), 0), 1);

  let zoomFactor = 1.0;
  let panX = 0;
  let panY = 0;
  let tiltAngle = 0;
  let rotationAngle = 0;
  let cameraDistance = 2.8; // meters

  if (style.includes('kpop') || style.includes('wave')) {
    // Dynamic K-Pop camera: push-ins on drops, subtle whip-pans, and slow zoom-out reveals
    // 0s-4s: Medium shot slow push-in
    // 4s-12s: Rhythmic pulse zoom on downbeats with lateral panning
    // 12s-22s: Wide tracking pan following horizontal slide
    // 22s-30s: Close-up crash zoom into final ending freeze
    const beatPulse = (beat % 2 < 0.15) ? 0.04 : 0;
    const macroCycle = (time % 8) / 8; // 8-second sequence loop

    zoomFactor = 1.05 + Math.sin(macroCycle * Math.PI * 2) * 0.18 + beatPulse;
    panX = Math.sin(time * 0.9) * 0.06;
    panY = Math.cos(time * 0.7) * 0.03;
    tiltAngle = Math.sin(time * 0.8) * 3.5;
    rotationAngle = Math.sin(time * 0.5) * 2.2;
    cameraDistance = 2.8 - (zoomFactor - 1.0) * 1.5;
  } else if (style.includes('hiphop') || style.includes('bounce')) {
    // Urban Hip-hop: heavy camera bounce on downbeats, low-angle tilt, street tracking
    const beatBounce = Math.pow(Math.sin(beat * Math.PI), 2) * 0.07;
    zoomFactor = 1.08 + beatBounce;
    panX = Math.sin(beat * 0.5) * 0.08;
    panY = -0.04 + beatBounce * 0.4; // Low angle looking slightly up
    tiltAngle = -4.5 + Math.sin(beat) * 2.0; // slight upward tilt
    rotationAngle = Math.sin(beat * 0.3) * 3.0;
    cameraDistance = 2.4;
  } else if (style.includes('shuffle')) {
    // Shuffle: tracking camera pan left-to-right following footwork, slight zoom out to catch feet
    zoomFactor = 0.95 + Math.sin(time * 0.6) * 0.08;
    panX = Math.sin(time * 1.4) * 0.12; // wide horizontal tracking
    panY = 0.05; // lower frame to capture shoes and feet
    tiltAngle = 2.0;
    rotationAngle = Math.sin(time * 0.8) * 1.5;
    cameraDistance = 3.2;
  } else {
    // Robotic / Popping: sharp punch-zooms on hits, steady locked camera with micro-shakes
    const hit = (beat * 4) % 1 < 0.2;
    zoomFactor = hit ? 1.15 : 1.02;
    panX = Math.floor(time) % 2 === 0 ? 0.02 : -0.02;
    panY = 0;
    tiltAngle = 0;
    rotationAngle = hit ? (Math.random() - 0.5) * 1.5 : 0;
    cameraDistance = 2.6;
  }

  return {
    timestamp: time,
    zoomFactor: Number(zoomFactor.toFixed(3)),
    panX: Number(panX.toFixed(3)),
    panY: Number(panY.toFixed(3)),
    tiltAngle: Number(tiltAngle.toFixed(2)),
    rotationAngle: Number(rotationAngle.toFixed(2)),
    cameraDistance: Number(cameraDistance.toFixed(2)),
    isMoving: Math.abs(panX) > 0.01 || Math.abs(zoomFactor - 1.0) > 0.02,
  };
}

/**
 * Apply camera transformation (zoom, pan, tilt, rotation) to a canvas 2D rendering context
 */
export function applyCameraTransform(
  ctx: CanvasRenderingContext2D,
  camera: CameraMotionFrame,
  width: number,
  height: number
) {
  const centerX = width * 0.5;
  const centerY = height * 0.5;

  // 1. Move to viewport center
  ctx.translate(centerX, centerY);

  // 2. Apply camera rotation (roll)
  if (camera.rotationAngle !== 0) {
    ctx.rotate((camera.rotationAngle * Math.PI) / 180);
  }

  // 3. Apply camera zoom
  ctx.scale(camera.zoomFactor, camera.zoomFactor);

  // 4. Apply camera pan & tilt (shift origin)
  ctx.translate(-centerX + (camera.panX * width), -centerY + (camera.panY * height));
}
