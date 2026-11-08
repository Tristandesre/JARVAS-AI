import { FacialExpressionFrame } from '../types';

/**
 * Computes facial expressions, head Euler angles, and gaze at any timestamp
 */
export function estimateFacialExpressionAtTime(
  time: number,
  style: string = 'cyber-kpop',
  bpm: number = 120
): FacialExpressionFrame {
  const beatDuration = 60 / bpm;
  const beat = time / beatDuration;

  // Natural biological blink cycle: every ~3.2 seconds
  const blinkCycle = time % 3.2;
  const isBlinking = blinkCycle > 0.05 && blinkCycle < 0.22;
  const blinkVal = isBlinking ? Math.sin(((blinkCycle - 0.05) / 0.17) * Math.PI) : 0;

  // Style-specific expression & energy
  let smileScore = 0.45;
  let mouthOpen = 0.1;
  let eyebrowRaise = 0.2;
  let headPitch = 0;
  let headYaw = 0;
  let headRoll = 0;

  if (style.includes('kpop') || style.includes('wave')) {
    // K-Pop: confident stage smile, playful eyebrow lifts, head tilts on phrase ends
    smileScore = 0.6 + Math.sin(time * 1.5) * 0.25;
    mouthOpen = 0.15 + (beat % 1 < 0.3 ? 0.25 : 0);
    eyebrowRaise = 0.3 + Math.sin(time * 2.0) * 0.2;
    headYaw = Math.sin(time * 1.2) * 18; // head turns left/right
    headPitch = Math.sin(time * 0.9) * 8; // slight nod
    headRoll = Math.sin(time * 1.8) * 9; // rhythmic head tilt
  } else if (style.includes('hiphop') || style.includes('bounce')) {
    // Urban Hip-hop: intense swagger, chin-up tilt, focused furrow
    smileScore = 0.25 + Math.sin(time * 0.8) * 0.15;
    mouthOpen = 0.12 + (beat % 2 < 0.2 ? 0.3 : 0);
    eyebrowRaise = 0.15 + Math.sin(time * 1.2) * 0.15;
    headPitch = -6 + Math.sin(beat * Math.PI) * 10; // chin up on downbeats
    headYaw = Math.sin(beat * 0.5) * 14;
    headRoll = Math.sin(beat * 0.5) * 6;
  } else if (style.includes('shuffle')) {
    // High energy EDM: bright smile, energetic nodding
    smileScore = 0.75 + Math.sin(time * 2) * 0.15;
    mouthOpen = 0.2 + (beat % 1 < 0.25 ? 0.35 : 0);
    eyebrowRaise = 0.4;
    headPitch = Math.sin(beat * Math.PI) * 12; // nodding with high tempo
    headYaw = Math.sin(time * 0.8) * 10;
    headRoll = Math.sin(beat * 0.5) * 8;
  } else {
    // Popping: sharp head snaps, intense robot gaze
    const snap = (beat * 4) % 1 < 0.15;
    smileScore = 0.15;
    mouthOpen = snap ? 0.2 : 0.05;
    eyebrowRaise = snap ? 0.5 : 0.1;
    headPitch = 0;
    headYaw = Math.floor(time) % 2 === 0 ? 15 : -15;
    headRoll = 0;
  }

  return {
    timestamp: time,
    blinkLeft: Number(blinkVal.toFixed(2)),
    blinkRight: Number(blinkVal.toFixed(2)),
    smileScore: Number(Math.max(0, Math.min(1, smileScore)).toFixed(2)),
    mouthOpen: Number(Math.max(0, Math.min(1, mouthOpen)).toFixed(2)),
    eyebrowRaise: Number(Math.max(0, Math.min(1, eyebrowRaise)).toFixed(2)),
    headPitch: Number(headPitch.toFixed(1)),
    headYaw: Number(headYaw.toFixed(1)),
    headRoll: Number(headRoll.toFixed(1)),
    gazeX: Number((headYaw / 40).toFixed(2)),
    gazeY: Number((headPitch / 30).toFixed(2)),
  };
}
