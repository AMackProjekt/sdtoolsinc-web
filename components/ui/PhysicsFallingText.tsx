"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

type Props = {
  text: string;
  highlightWords?: string[];
  className?: string;
  fontSize?: string;
  gravity?: number;
  bounciness?: number;
  stagger?: number;
  scatter?: number;
  cursorPush?: number;
  mouseConstraintStiffness?: number;
  restoreDelay?: number;
  trigger?: "hover" | "click";
  split?: "letters" | "words";
};

/**
 * Matter.js FallingText: DOM glyphs are actual sleeping rigid bodies,
 * released into a bounded world. Supports collisions, pointer pushes and
 * pointer dragging. Clean up engine, listeners, observers and RAF on unmount.
 */
export function PhysicsFallingText({
  text,
  highlightWords = ["MACKPROJEKT"],
  className = "",
  fontSize = "clamp(1rem, 3.2vw, 1.5rem)",
  gravity = 1,
  bounciness = 0.2,
  stagger = 0.03,
  scatter = 0.5,
  cursorPush = 0.5,
  mouseConstraintStiffness = 0.2,
  restoreDelay = 2,
  trigger = "hover",
  split = "letters",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<() => void>(() => {});
  const highlight = new Set(highlightWords.map(v => v.toUpperCase()));
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    if (!root || !line) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pieces = [...line.querySelectorAll<HTMLElement>("[data-physics-piece]")];
    let engine: Matter.Engine | undefined;
    let runnerFrame = 0;
    let restoreTimer: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    let active = false;
    let startTime = 0;
    let lastTime = 0;
    let drag: Matter.Constraint | undefined;
    let dragPointer = -1;
    let visibility = true;
    const falling: { element: HTMLElement; body: Matter.Body; x: number; y: number; w: number; h: number; at: number; released: boolean }[] = [];
    const pointer = { x: 0, y: 0, at: 0 };
    const bounds = { width: 0, height: 0 };
    const wallThickness = 120;

    const local = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const cleanup = () => {
      if (restoreTimer) clearTimeout(restoreTimer);
      restoreTimer = undefined;
      cancelAnimationFrame(runnerFrame);
      runnerFrame = 0;
      if (engine) Matter.Engine.clear(engine);
      engine = undefined;
      falling.forEach(piece => {
        piece.element.style.position = "";
        piece.element.style.left = "";
        piece.element.style.top = "";
        piece.element.style.width = "";
        piece.element.style.height = "";
        piece.element.style.transform = "";
        piece.element.style.margin = "";
      });
      falling.length = 0;
      line.style.minHeight = "";
      active = false;
      running = false;
      drag = undefined;
      dragPointer = -1;
    };

    const restore = () => {
      const positions = falling.map(piece => ({
        element: piece.element,
        from: piece.element.style.transform,
      }));
      cleanup();
      // Reset the DOM at the end of the physical simulation; unlike the
      // old CSS-only effect, the movement before reset is physics-driven.
      positions.forEach(({ element }) => {
        element.animate([{ opacity: .8 }, { opacity: 1 }], {
          duration: 220,
          easing: "ease-out",
        });
      });
    };

    const update = (now: number) => {
      runnerFrame = 0;
      if (!active || !engine || !visibility) return;
      const delta = Math.min(32, lastTime ? now - lastTime : 1000 / 60);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;
      for (const piece of falling) {
        if (!piece.released && elapsed >= piece.at) {
          piece.released = true;
          Matter.Body.setStatic(piece.body, false);
          Matter.Body.setVelocity(piece.body, {
            x: (Math.random() - .5) * 5 * scatter,
            y: -Math.random() * 2.5 * scatter,
          });
          Matter.Body.setAngularVelocity(piece.body, (Math.random() - .5) * .12 * scatter);
        }
      }
      Matter.Engine.update(engine, delta);
      for (const piece of falling) {
        piece.element.style.transform = `translate3d(${(piece.body.position.x - piece.w / 2).toFixed(1)}px,${(piece.body.position.y - piece.h / 2).toFixed(1)}px,0) rotate(${piece.body.angle.toFixed(3)}rad)`;
      }
      runnerFrame = requestAnimationFrame(update);
    };
    const start = () => {
      if (active || reduceMotion || !visibility || !pieces.length) return;
      active = true;
      bounds.width = root.clientWidth;
      bounds.height = root.clientHeight;
      const rootRect = root.getBoundingClientRect();
      const rects = pieces.map(element => {
        const rect = element.getBoundingClientRect();
        return { element, x: rect.left - rootRect.left, y: rect.top - rootRect.top, w: rect.width, h: rect.height };
      });
      line.style.minHeight = `${line.offsetHeight}px`;
      engine = Matter.Engine.create({ enableSleeping: true });
      engine.gravity.y = gravity * 1.4;
      const width = bounds.width;
      const height = bounds.height;
      const walls = [
        Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width + 2 * wallThickness, wallThickness, { isStatic: true }),
        Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 3, { isStatic: true }),
        Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 3, { isStatic: true }),
        Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width + 2 * wallThickness, wallThickness, { isStatic: true }),
      ];
      const order = rects.map((_, i) => i).sort(() => Math.random() - .5);
      rects.forEach(({ element, x, y, w, h }, i) => {
        const body = Matter.Bodies.rectangle(x + w / 2, y + h / 2, Math.max(3, w - 1), Math.max(3, h - 1), {
          isStatic: true, restitution: bounciness, friction: .35, frictionStatic: .8, frictionAir: .015, sleepThreshold: 40,
        });
        element.style.position = "absolute";
        element.style.left = "0";
        element.style.top = "0";
        element.style.margin = "0";
        element.style.width = `${w}px`;
        element.style.height = `${h}px`;
        element.style.transform = `translate3d(${x}px,${y}px,0)`;
        falling.push({ element, body, x, y, w, h, at: order.indexOf(i) * stagger, released: false });
      });
      Matter.Composite.add(engine.world, [...walls, ...falling.map(p => p.body)]);
      root.dataset.falling = "true";
      startTime = performance.now();
      lastTime = 0;
      runnerFrame = requestAnimationFrame(update);
      restoreTimer = setTimeout(() => {
        restore();
        delete root.dataset.falling;
      }, Math.max(2400, 1600 + restoreDelay * 1000));
    };
    startRef.current = start;

    const down = (event: PointerEvent) => {
      if (!active || !engine || drag || (event.pointerType === "mouse" && event.button !== 0)) return;
      const point = local(event);
      const hit = Matter.Query.point(falling.filter(p => p.released).map(p => p.body), point)[0];
      if (!hit) return;
      event.preventDefault();
      Matter.Sleeping.set(hit, false);
      drag = Matter.Constraint.create({
        bodyB: hit,
        pointA: point,
        pointB: { x: point.x - hit.position.x, y: point.y - hit.position.y },
        stiffness: mouseConstraintStiffness,
        damping: .08,
        length: 0,
      });
      Matter.Composite.add(engine.world, drag);
      dragPointer = event.pointerId;
      root.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!active || !engine) return;
      const point = local(event);
      if (drag && dragPointer === event.pointerId) {
        drag.pointA = point;
      } else if (pointer.at) {
        const elapsed = Math.max(1, performance.now() - pointer.at);
        const vx = (point.x - pointer.x) / elapsed;
        const vy = (point.y - pointer.y) / elapsed;
        const speed = Math.hypot(vx, vy);
        if (speed > .25 && elapsed < 120) {
          for (const piece of falling) {
            if (!piece.released) continue;
            const distance = Math.hypot(piece.body.position.x - point.x, piece.body.position.y - point.y);
            if (distance > Math.max(piece.w, piece.h) / 2 + 20) continue;
            Matter.Sleeping.set(piece.body, false);
            Matter.Body.setVelocity(piece.body, {
              x: piece.body.velocity.x + vx * cursorPush * 6,
              y: piece.body.velocity.y + vy * cursorPush * 6,
            });
          }
        }
      }
      pointer.x = point.x;
      pointer.y = point.y;
      pointer.at = performance.now();
    };
    const up = (event: PointerEvent) => {
      if (!drag || !engine || event.pointerId !== dragPointer) return;
      Matter.Composite.remove(engine.world, drag);
      drag = undefined;
      dragPointer = -1;
      try { root.releasePointerCapture(event.pointerId); } catch {}
    };
    const enter = () => { if (trigger === "hover") start(); };
    const click = () => { if (trigger === "click") start(); };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        start();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visibility = entry.isIntersecting;
      if (visibility && active && !runnerFrame) {
        lastTime = 0;
        runnerFrame = requestAnimationFrame(update);
      }
      if (!visibility && runnerFrame) {
        cancelAnimationFrame(runnerFrame);
        runnerFrame = 0;
      }
    });
    observer.observe(root);
    const resize = new ResizeObserver(() => {
      if (active) { restore(); delete root.dataset.falling; }
    });
    resize.observe(root);
    root.addEventListener("pointerenter", enter);
    root.addEventListener("click", click);
    root.addEventListener("keydown", keyboard);
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointercancel", up);
    return () => {
      observer.disconnect();
      resize.disconnect();
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("click", click);
      root.removeEventListener("keydown", keyboard);
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", up);
      cleanup();
    };
  }, [text, gravity, stagger, bounciness, scatter, cursorPush, mouseConstraintStiffness, restoreDelay, trigger, split]);

  return <div
    ref={rootRef}
    role="button"
    tabIndex={0}
    aria-label={`${text}. Hover or activate to make the letters fall and drag them.`}
    className={`relative mx-auto h-24 w-full max-w-[740px] cursor-pointer overflow-hidden rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300 ${className}`}
    style={{ fontSize }}
  >
    <div ref={lineRef} className="flex min-h-20 flex-wrap content-start items-center justify-center gap-y-1 px-2 pt-3 text-center font-black tracking-[.055em] leading-snug">
      {words.map((word, wi) =>
        <span key={wi} className="inline-flex shrink-0 whitespace-nowrap px-[.16em]">
          {split === "words"
            ? <span data-physics-piece className={`inline-block ${highlight.has(word.toUpperCase()) ? "text-amber-300" : "text-sky-200"}`}>{word}</span>
            : Array.from(word).map((letter, li) =>
              <span key={li} data-physics-piece className={`inline-block ${highlight.has(word.toUpperCase()) ? "text-amber-300" : "text-sky-200"}`}>{letter}</span>
            )}
        </span>
      )}
    </div>
  </div>;
}
