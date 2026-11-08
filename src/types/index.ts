export interface PoseKeypoint {
  x: number; // Normalized 0 to 1
  y: number; // Normalized 0 to 1
  z?: number; // Estimated depth -1 to 1
  confidence?: number;
}

export interface HandKeypoints {
  wrist: PoseKeypoint;
  thumb: PoseKeypoint[];
  index: PoseKeypoint[];
  middle: PoseKeypoint[];
  ring: PoseKeypoint[];
  pinky: PoseKeypoint[];
}

export interface FacialExpressionFrame {
  timestamp: number;
  blinkLeft: number; // 0 (open) to 1 (closed)
  blinkRight: number;
  smileScore: number; // 0 (neutral) to 1 (broad smile)
  mouthOpen: number; // 0 to 1
  eyebrowRaise: number;
  headPitch: number; // degrees (look up/down)
  headYaw: number; // degrees (look left/right)
  headRoll: number; // degrees (tilt side to side)
  gazeX: number;
  gazeY: number;
}

export interface CameraMotionFrame {
  timestamp: number;
  zoomFactor: number; // 1.0 = normal, >1.0 = zoom in, <1.0 = zoom out
  panX: number; // pixels / normalized shift (-0.5 to +0.5)
  panY: number; // pixels / normalized shift (-0.5 to +0.5)
  tiltAngle: number; // camera tilt in degrees
  rotationAngle: number; // camera roll in degrees
  cameraDistance: number; // estimated distance from subject
  isMoving: boolean;
}

export interface SkeletonPose {
  timestamp: number;
  keypoints: { [jointName: string]: PoseKeypoint };
  leftHand?: HandKeypoints;
  rightHand?: HandKeypoints;
  faceExpression?: FacialExpressionFrame;
  cameraMotion?: CameraMotionFrame;
  chestAngle?: number;
  spineAngle?: number;
  hipTilt?: number;
  isBeatHit?: boolean;
}

export interface ChoreographySegment {
  time: string;
  action: string;
  energy: number;
  cameraAction?: string;
  expressionNote?: string;
}

export interface MotionAnalysisData {
  danceStyle: string;
  estimatedBpm: number;
  movementIntensity: string;
  choreographyTimeline: ChoreographySegment[];
  personIdentity: {
    detectedHair?: string;
    detectedWardrobe?: string;
    recommendedIKPreservation?: string;
    facePreservationScore?: number;
  };
  cameraDynamics: {
    dominantMovement: string; // e.g., "Dynamic Tracking & Push-in Zooms"
    zoomRange: string;
    panTracking: string;
  };
  expressionDynamics: {
    smileFrequency: string;
    headTiltIntensity: string;
    eyeContactScore: number;
  };
  kinematicNotes: string;
}

export type EngineMode = 'kling_official' | 'local_browser' | 'local_comfyui' | 'custom_api';

export type KlingGenerationType = 'motion-control' | 'text2video' | 'image2video';

export interface GenerationSettings {
  generationType: KlingGenerationType;
  klingModel: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  negativePrompt: string;
  cfgScale: number;
  quality: '720p' | '1080p';
  motionAccuracy: 'Standard' | 'High';
  duration: number; // 5s, 10s, or up to 30s
  backgroundMode: 'preserve_subject' | 'cyber_stage' | 'reference_bg';
  identityWeight: number; // 0.5 to 1.0
  temporalSmoothing: boolean;
  enableCameraMotionTransfer: boolean; // Transfer zoom, pan, tilt from video
  enableFacialExpressions: boolean; // Transfer blinks, smiles, mouth movements
  enableHandTracking: boolean; // Transfer finger and wrist articulations
  engineMode: EngineMode;
  localBackendUrl: string; // e.g. http://127.0.0.1:8000
  prompt: string; // Creative prompt for Kling AI
  characterOrientation: 'video' | 'image';
  keepAudio: boolean;
  mode: 'std' | 'pro';
  bodyMotion: boolean;
  faceMotion: boolean;
  headMotion: boolean;
  cameraMotion: boolean;
}

export interface PresetDance {
  id: string;
  title: string;
  genre: string;
  duration: number;
  bpm: number;
  difficulty: string;
  description: string;
  signatureMoves: string[];
  cameraStyle: string;
  expressionStyle: string;
  previewColor: string;
}

export interface CharacterPreset {
  id: string;
  name: string;
  tag: string;
  imagePath: string;
  clothing: string;
}

export type PipelineStage = 
  | 'idle'
  | 'extracting_motion'
  | 'tracking_camera'
  | 'analyzing_identity'
  | 'retargeting_kinematics'
  | 'synthesizing_frames'
  | 'encoding_video'
  | 'completed'
  | 'error';

export interface PipelineProgress {
  stage: PipelineStage;
  percent: number;
  currentAction: string;
  framesProcessed?: number;
  totalFrames?: number;
  currentCameraState?: string;
  currentExpressionState?: string;
}
