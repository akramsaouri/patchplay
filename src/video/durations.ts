export const INTRO_DURATION = 90; // 3s at 30fps
export const HEADLINE_DURATION = 105; // 3.5s
export const BULLET_DURATION = 75; // 2.5s each
export const OUTRO_DURATION = 90; // 3s

export const calculateDuration = (bulletCount: number): number => {
  return INTRO_DURATION + HEADLINE_DURATION + bulletCount * BULLET_DURATION + OUTRO_DURATION;
};
