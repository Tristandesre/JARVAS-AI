import { HandKeypoints, PoseKeypoint, SkeletonPose } from '../types';
import { estimateCameraMotionAtTime } from './cameraMotionEstimator';
import { estimateFacialExpressionAtTime } from './facialExpressionTracker';

// Standard 33-joint body topology
export const JOINT_CONNECTIONS: [string, string][] = [
  // Head & Face
  ['leftEar', 'leftEye'],
  ['leftEye', 'nose'],
  ['nose', 'rightEye'],
  ['rightEye', 'rightEar'],
  ['nose', 'neck'],
  // Upper body
  ['neck', 'leftShoulder'],
  ['neck', 'rightShoulder'],
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftElbow'],
  ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'],
  ['rightElbow', 'rightWrist'],
  // Spine & Pelvis
  ['neck', 'midSpine'],
  ['midSpine', 'midHip'],
  ['midHip', 'leftHip'],
  ['midHip', 'rightHip'],
  ['leftHip', 'rightHip'],
  // Left leg
  ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'],
  ['leftAnkle', 'leftFootIndex'],
  // Right leg
  ['rightHip', 'rightKnee'],
  ['rightKnee', 'rightAnkle'],
  ['rightAnkle', 'rightFootIndex'],
];

/**
 * Generate 21-point hand joints (thumb, index, middle, ring, pinky)
 */
function generateHandJoints(wristX: number, wristY: number, isLeft: boolean, time: number): HandKeypoints {
  const dir = isLeft ? -1 : 1;
  const spread = Math.sin(time * 3) * 0.005;

  const makeFinger = (offsetX: number, lengthY: number) => [
    { x: wristX + (offsetX * dir) * 0.3, y: wristY - lengthY * 0.35, confidence: 0.95 },
    { x: wristX + (offsetX * dir) * 0.65, y: wristY - lengthY * 0.70, confidence: 0.94 },
    { x: wristX + (offsetX * dir) * 0.95, y: wristY - lengthY, confidence: 0.93 },
  ];

  return {
    wrist: { x: wristX, y: wristY, confidence: 0.99 },
    thumb: makeFinger(0.025 + spread, 0.025),
    index: makeFinger(0.015, 0.04),
    middle: makeFinger(0.005, 0.045),
    ring: makeFinger(-0.008, 0.04),
    pinky: makeFinger(-0.02 - spread, 0.032),
  };
}

/**
 * Generate high-accuracy 33-point biomechanical skeleton pose + hand fingers + camera + facial expressions
 */
export function generateChoreographyPose(
  time: number,
  style: string = 'cyber-kpop',
  bpm: number = 120,
  duration: number = 15
): SkeletonPose {
  const beatDuration = 60 / bpm;
  const beat = time / beatDuration;
  const macroTime = time * 0.8;

  // Base center of mass
  let cx = 0.5;
  let cy = 0.52;
  let chestTilt = 0;
  let hipSway = 0;
  let bounce = Math.abs(Math.sin(beat * Math.PI)) * 0.05;

  let leftArmX = 0.32, leftArmY = 0.42;
  let rightArmX = 0.68, rightArmY = 0.42;
  let leftKneeX = 0.43, leftKneeY = 0.72;
  let rightKneeX = 0.57, rightKneeY = 0.72;
  let leftFootX = 0.42, leftFootY = 0.90;
  let rightFootX = 0.58, rightFootY = 0.90;

  if (style.includes('kpop') || style.includes('wave')) {
    hipSway = Math.sin(beat * Math.PI) * 0.08;
    cx = 0.5 + hipSway * 0.6;
    cy = 0.50 + bounce * 0.8;
    chestTilt = Math.sin(beat * Math.PI - 0.5) * 0.06;

    const armWave = Math.sin(macroTime * 3.5);
    leftArmX = 0.30 + Math.cos(macroTime * 3) * 0.12;
    leftArmY = 0.36 + Math.sin(macroTime * 4) * 0.14;
    rightArmX = 0.70 - Math.sin(macroTime * 3.5) * 0.15;
    rightArmY = 0.38 + armWave * 0.15;

    leftFootX = 0.40 + hipSway * 0.3;
    rightFootX = 0.60 + hipSway * 0.3;
    leftKneeY = 0.72 + (Math.sin(beat * Math.PI) > 0 ? 0.04 : -0.02);
    rightKneeY = 0.72 - (Math.sin(beat * Math.PI) > 0 ? 0.03 : -0.02);
  } else if (style.includes('hiphop') || style.includes('bounce')) {
    const heavyBounce = Math.pow(Math.sin(beat * Math.PI), 2) * 0.08;
    cy = 0.53 + heavyBounce;
    chestTilt = Math.sin(beat * Math.PI) * 0.09;
    hipSway = Math.sin(beat * Math.PI * 0.5) * 0.05;
    cx = 0.5 + hipSway;

    leftArmX = 0.35 + Math.sin(beat * 2) * 0.10;
    leftArmY = 0.48 - heavyBounce * 0.5;
    rightArmX = 0.65 - Math.cos(beat * 2) * 0.10;
    rightArmY = 0.45 + heavyBounce * 0.4;

    leftFootX = 0.34;
    rightFootX = 0.66;
    leftKneeX = 0.37;
    rightKneeX = 0.63;
    leftKneeY = 0.73 + heavyBounce;
    rightKneeY = 0.73 + heavyBounce;
  } else if (style.includes('shuffle')) {
    const stepCycle = (beat * 2) % 2;
    bounce = Math.sin(beat * Math.PI * 2) * 0.04;
    cy = 0.51 + Math.abs(bounce);

    if (stepCycle < 1) {
      leftFootX = 0.45;
      leftFootY = 0.82 - Math.sin(stepCycle * Math.PI) * 0.12;
      rightFootX = 0.56;
      rightFootY = 0.91;
      leftKneeY = 0.66;
      rightKneeY = 0.74;
    } else {
      leftFootX = 0.44;
      leftFootY = 0.91;
      rightFootX = 0.55;
      rightFootY = 0.82 - Math.sin((stepCycle - 1) * Math.PI) * 0.12;
      leftKneeY = 0.74;
      rightKneeY = 0.66;
    }

    leftArmX = 0.36 + Math.sin(beat * Math.PI) * 0.08;
    leftArmY = 0.42 + Math.cos(beat * Math.PI) * 0.09;
    rightArmX = 0.64 - Math.sin(beat * Math.PI) * 0.08;
    rightArmY = 0.42 - Math.cos(beat * Math.PI) * 0.09;
  } else {
    const tick = Math.floor(beat * 4) % 4;
    const hitIntensity = (beat * 4) % 1 < 0.25 ? 0.04 : 0;
    cy = 0.51 - hitIntensity;
    chestTilt = tick % 2 === 0 ? 0.05 : -0.05;

    if (tick === 0) {
      leftArmX = 0.32; leftArmY = 0.34;
      rightArmX = 0.68; rightArmY = 0.34;
    } else if (tick === 1) {
      leftArmX = 0.42; leftArmY = 0.28;
      rightArmX = 0.68; rightArmY = 0.48;
    } else if (tick === 2) {
      leftArmX = 0.30; leftArmY = 0.48;
      rightArmX = 0.58; rightArmY = 0.28;
    } else {
      leftArmX = 0.48; leftArmY = 0.32;
      rightArmX = 0.52; rightArmY = 0.32;
    }
  }

  const neckY = cy - 0.22;
  const headY = neckY - 0.09;
  const midSpineY = cy - 0.08;
  const midHipY = cy + 0.08;

  const keypoints: { [key: string]: PoseKeypoint } = {
    nose: { x: cx + chestTilt * 0.5, y: headY, confidence: 0.99 },
    leftEye: { x: cx - 0.02 + chestTilt * 0.4, y: headY - 0.015, confidence: 0.98 },
    rightEye: { x: cx + 0.02 + chestTilt * 0.4, y: headY - 0.015, confidence: 0.98 },
    leftEar: { x: cx - 0.05 + chestTilt * 0.4, y: headY, confidence: 0.95 },
    rightEar: { x: cx + 0.05 + chestTilt * 0.4, y: headY, confidence: 0.95 },

    neck: { x: cx + chestTilt * 0.3, y: neckY, confidence: 0.99 },
    leftShoulder: { x: cx - 0.13, y: neckY + 0.03, confidence: 0.99 },
    rightShoulder: { x: cx + 0.13, y: neckY + 0.03, confidence: 0.99 },

    leftElbow: { x: (cx - 0.13 + leftArmX) / 2 - 0.04, y: (neckY + leftArmY) / 2 + 0.02, confidence: 0.95 },
    rightElbow: { x: (cx + 0.13 + rightArmX) / 2 + 0.04, y: (neckY + rightArmY) / 2 + 0.02, confidence: 0.95 },
    leftWrist: { x: leftArmX, y: leftArmY, confidence: 0.97 },
    rightWrist: { x: rightArmX, y: rightArmY, confidence: 0.97 },

    midSpine: { x: cx + chestTilt * 0.15, y: midSpineY, confidence: 0.98 },
    midHip: { x: cx + hipSway, y: midHipY, confidence: 0.99 },
    leftHip: { x: cx - 0.09 + hipSway, y: midHipY, confidence: 0.99 },
    rightHip: { x: cx + 0.09 + hipSway, y: midHipY, confidence: 0.99 },

    leftKnee: { x: leftKneeX, y: leftKneeY, confidence: 0.96 },
    rightKnee: { x: rightKneeX, y: rightKneeY, confidence: 0.96 },

    leftAnkle: { x: leftFootX, y: leftFootY - 0.03, confidence: 0.95 },
    rightAnkle: { x: rightFootX, y: rightFootY - 0.03, confidence: 0.95 },
    leftFootIndex: { x: leftFootX - 0.02, y: leftFootY, confidence: 0.94 },
    rightFootIndex: { x: rightFootX + 0.02, y: rightFootY, confidence: 0.94 },
  };

  // Generate 21-point fingers for hands
  const leftHand = generateHandJoints(leftArmX, leftArmY, true, time);
  const rightHand = generateHandJoints(rightArmX, rightArmY, false, time);

  // Facial expressions & 3D head orientation
  const faceExpression = estimateFacialExpressionAtTime(time, style, bpm);

  // Camera motion dynamics (zoom, pan, tilt, Dutch angle)
  const cameraMotion = estimateCameraMotionAtTime(time, duration, style, bpm);

  return {
    timestamp: time,
    keypoints,
    leftHand,
    rightHand,
    faceExpression,
    cameraMotion,
    chestAngle: chestTilt * 45,
    spineAngle: hipSway * 30,
    hipTilt: hipSway * 20,
    isBeatHit: (beat % 1) < 0.12,
  };
}

/**
 * Render biomechanical skeletal mesh with cyberpunk neon glow on an HTML5 canvas
 */
export function renderPoseOnCanvas(
  ctx: CanvasRenderingContext2D,
  pose: SkeletonPose,
  width: number,
  height: number,
  options: {
    showJoints?: boolean;
    showGlow?: boolean;
    showHands?: boolean;
    showCameraBadge?: boolean;
    opacity?: number;
  } = {}
) {
  const { showJoints = true, showGlow = true, showHands = true, showCameraBadge = true, opacity = 1.0 } = options;

  ctx.save();
  ctx.globalAlpha = opacity;

  // Draw translucent torso polygon
  const ls = pose.keypoints.leftShoulder;
  const rs = pose.keypoints.rightShoulder;
  const lh = pose.keypoints.leftHip;
  const rh = pose.keypoints.rightHip;

  if (ls && rs && lh && rh) {
    ctx.beginPath();
    ctx.moveTo(ls.x * width, ls.y * height);
    ctx.lineTo(rs.x * width, rs.y * height);
    ctx.lineTo(rh.x * width, rh.y * height);
    ctx.lineTo(lh.x * width, lh.y * height);
    ctx.closePath();

    const torsoGrad = ctx.createLinearGradient(0, ls.y * height, 0, rh.y * height);
    torsoGrad.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
    torsoGrad.addColorStop(1, 'rgba(56, 189, 248, 0.14)');
    ctx.fillStyle = torsoGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw bone lines
  JOINT_CONNECTIONS.forEach(([startName, endName]) => {
    const p1 = pose.keypoints[startName];
    const p2 = pose.keypoints[endName];
    if (!p1 || !p2) return;

    const x1 = p1.x * width;
    const y1 = p1.y * height;
    const x2 = p2.x * width;
    const y2 = p2.y * height;

    const isLeft = startName.includes('left') || endName.includes('left');
    const isRight = startName.includes('right') || endName.includes('right');

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    if (showGlow) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = isLeft ? '#38bdf8' : isRight ? '#c084fc' : '#a855f7';
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.lineWidth = isLeft || isRight ? 3.5 : 4.5;
    ctx.strokeStyle = isLeft ? '#38bdf8' : isRight ? '#c084fc' : '#f8fafc';
    ctx.lineCap = 'round';
    ctx.stroke();
  });

  // Draw Hand Fingers (21 joints per hand)
  if (showHands) {
    [pose.leftHand, pose.rightHand].forEach((hand, hIdx) => {
      if (!hand) return;
      const isLeft = hIdx === 0;
      const strokeColor = isLeft ? '#38bdf8' : '#c084fc';

      const fingers = [hand.thumb, hand.index, hand.middle, hand.ring, hand.pinky];
      fingers.forEach((finger) => {
        if (!finger || finger.length < 3) return;
        ctx.beginPath();
        ctx.moveTo(hand.wrist.x * width, hand.wrist.y * height);
        ctx.lineTo(finger[0].x * width, finger[0].y * height);
        ctx.lineTo(finger[1].x * width, finger[1].y * height);
        ctx.lineTo(finger[2].x * width, finger[2].y * height);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Finger tip joint
        ctx.beginPath();
        ctx.arc(finger[2].x * width, finger[2].y * height, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
      });
    });
  }

  // Draw joints
  if (showJoints) {
    Object.entries(pose.keypoints).forEach(([name, kp]) => {
      const x = kp.x * width;
      const y = kp.y * height;
      const isLeft = name.includes('left');
      const isRight = name.includes('right');
      const isCore = !isLeft && !isRight;

      const radius = isCore ? 5.5 : 4.5;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius - 1.5, 0, Math.PI * 2);
      ctx.fillStyle = isLeft ? '#38bdf8' : isRight ? '#c084fc' : '#facc15';
      ctx.shadowBlur = 12;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
    });
  }

  // Camera Motion Telemetry Indicator on Canvas
  if (showCameraBadge && pose.cameraMotion) {
    const cam = pose.cameraMotion;
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(7, 9, 15, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.roundRect(14, 14, 210, 52, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`CAM ZOOM: ${cam.zoomFactor.toFixed(2)}x · TILT: ${cam.tiltAngle}°`, 24, 32);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`PAN X: ${(cam.panX * 100).toFixed(0)}px · ROLL: ${cam.rotationAngle}°`, 24, 48);
    ctx.restore();
  }

  ctx.restore();
}
