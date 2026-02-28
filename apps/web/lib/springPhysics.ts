/**
 * Spring Physics Utility
 * ----------------------
 * Implements a damped second-order spring integrator based on the ODE:
 *   m·x'' + c·x' + k·x = 0
 *
 * Parameters
 * ----------
 * m  – mass         (default 1)
 * c  – damping      (default 10)   → higher = faster settle
 * k  – stiffness    (default 50)   → higher = stiffer spring
 *
 * Tweaking guide:
 *   – Soft, floaty:  m=1, c=6,  k=30
 *   – Default feel:  m=1, c=10, k=50
 *   – Snappy:        m=1, c=14, k=80
 *
 * To disable animation (prefers-reduced-motion):
 *   Pass `reducedMotion=true` to `integrateSpring` – it will teleport
 *   immediately to the target and zero the velocity.
 */

export interface SpringState1D {
  position: number;
  velocity: number;
}

export interface SpringState3D {
  px: number; vx: number;
  py: number; vy: number;
  pz: number; vz: number;
}

export interface SpringParams {
  m?: number;
  c?: number;
  k?: number;
}

/** Integrate one scalar spring dimension one step forward. */
export function integrateSpring1D(
  state: SpringState1D,
  target: number,
  dt: number,
  { m = 1, c = 10, k = 50 }: SpringParams = {},
  reducedMotion = false,
): SpringState1D {
  if (reducedMotion) {
    return { position: target, velocity: 0 };
  }
  const clampedDt = Math.min(0.05, dt);
  const displacement = state.position - target;
  const acceleration = (-k * displacement - c * state.velocity) / m;
  const velocity = state.velocity + acceleration * clampedDt;
  const position = state.position + velocity * clampedDt;
  return { position, velocity };
}

/** Integrate a 3-D spring state (x, y, z) one step forward. */
export function integrateSpring3D(
  state: SpringState3D,
  target: { x: number; y: number; z: number },
  dt: number,
  params: SpringParams = {},
  reducedMotion = false,
): SpringState3D {
  const x = integrateSpring1D({ position: state.px, velocity: state.vx }, target.x, dt, params, reducedMotion);
  const y = integrateSpring1D({ position: state.py, velocity: state.vy }, target.y, dt, params, reducedMotion);
  const z = integrateSpring1D({ position: state.pz, velocity: state.vz }, target.z, dt, params, reducedMotion);
  return { px: x.position, vx: x.velocity, py: y.position, vy: y.velocity, pz: z.position, vz: z.velocity };
}

/** Convenience: create a zeroed 3-D spring state at a given origin. */
export function makeSpring3D(x = 0, y = 0, z = 0): SpringState3D {
  return { px: x, vx: 0, py: y, vy: 0, pz: z, vz: 0 };
}
