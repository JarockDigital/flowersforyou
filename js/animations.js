/**
 * AnimationEngine
 * Coordinates GSAP 3.15.1 cinematic timelines with full prefers-reduced-motion
 * compliance and a clean native fallback if offline without CDN access.
 */
(function (global) {
  'use strict';

  class AnimationEngine {
    constructor() {
      this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = this.mediaQuery.matches;
      this.activeTimeline = null;

      if (typeof this.mediaQuery.addEventListener === 'function') {
        this.mediaQuery.addEventListener('change', (event) => {
          this.reducedMotion = event.matches;
        });
      }
    }

    get hasGsap() {
      return typeof global.gsap !== 'undefined';
    }

    killActive() {
      if (this.activeTimeline && typeof this.activeTimeline.kill === 'function') {
        this.activeTimeline.kill();
        this.activeTimeline = null;
      }
    }

    /**
     * Scene 1: Spotlight reveals the envelope, sprig, and opening typography.
     */
    playArrivalEntrance() {
      this.killActive();
      const spotlight = document.getElementById('environment-spotlight');
      const copy = document.getElementById('arrival-copy');
      const envelope = document.getElementById('envelope-stage');
      const action = document.getElementById('arrival-action');

      if (!this.hasGsap || this.reducedMotion) {
        [spotlight, copy, envelope, action].forEach((el) => {
          if (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
        return;
      }

      const tl = global.gsap.timeline({ defaults: { ease: 'power3.out' } });
      this.activeTimeline = tl;

      tl.fromTo(spotlight, { opacity: 0.35 }, { opacity: 1, duration: 1.1 })
        .fromTo(copy, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.85 }, 0.15)
        .fromTo(envelope, { opacity: 0, y: 18, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.95 }, 0.3)
        .fromTo(action, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.75 }, 0.55);
    }

    /**
     * Reset envelope elements when returning to or replaying Scene 1.
     */
    resetEnvelopeState() {
      const flap = document.getElementById('envelope-flap');
      const seal = document.getElementById('wax-seal');
      const emerging = document.getElementById('envelope-emerging-bloom');
      const envObj = document.getElementById('arrival-envelope');
      const stage = document.getElementById('envelope-stage');
      const sprig = document.getElementById('arrival-sprig');

      if (flap) {
        flap.style.zIndex = '5';
      }
      if (envObj) {
        envObj.classList.remove('is-opening');
      }

      if (this.hasGsap) {
        global.gsap.set([flap, seal, emerging, envObj, stage, sprig], { clearProps: 'all' });
        if (flap) flap.style.zIndex = '5';
      } else {
        [flap, seal, emerging, envObj, stage, sprig].forEach((el) => {
          if (el) {
            el.style.opacity = '';
            el.style.transform = '';
          }
        });
      }
    }

    /**
     * Immediately places the bouquet into its finished, fully bloomed state.
     */
    snapBouquetToOpenState() {
      this.killActive();
      const theater = document.getElementById('bouquet-theater');
      if (theater) {
        theater.classList.add('is-visible');
        theater.style.opacity = '1';
      }

      const selectors = [
        '#bouquet-canvas-mount',
        '#wrap-back',
        '#wrap-wing-left',
        '#wrap-wing-right',
        '#wrap-front-fold',
        '#bouquet-stems',
        '#bouquet-foliage',
        '#flower-node-delphinium',
        '#flower-node-hydrangea',
        '#flower-node-rose',
        '#rose-petals-outer',
        '#rose-petals-mid',
        '#rose-petals-inner',
        '#flower-node-forgetmenot',
        '#bouquet-ribbon',
        '#scene-2-copy'
      ];

      selectors.forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el) return;
        if (this.hasGsap) {
          global.gsap.set(el, { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, x: 0, y: 0, rotation: 0 });
        } else {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }

    /**
     * Scene 1 -> Scene 2: Physical 3D envelope opening, floral emergence from inside,
     * and 8-step choreographed bouquet reveal.
     */
    playBouquetReveal({ onSceneSwap, onComplete }) {
      this.killActive();

      const scene1 = document.getElementById('scene-1');
      const scene2 = document.getElementById('scene-2');
      const envObj = document.getElementById('arrival-envelope');
      const flap = document.getElementById('envelope-flap');
      const seal = document.getElementById('wax-seal');
      const emerging = document.getElementById('envelope-emerging-bloom');
      const envStage = document.getElementById('envelope-stage');
      const arrivalCopy = document.getElementById('arrival-copy');
      const arrivalAction = document.getElementById('arrival-action');
      const theater = document.getElementById('bouquet-theater');
      const scene2Copy = document.getElementById('scene-2-copy');

      if (!this.hasGsap || this.reducedMotion) {
        if (scene1) scene1.hidden = true;
        if (scene2) scene2.hidden = false;
        if (typeof onSceneSwap === 'function') onSceneSwap();
        this.snapBouquetToOpenState();
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      const gsap = global.gsap;
      if (flap) flap.style.zIndex = '5';
      if (envObj) envObj.classList.add('is-opening');

      // Ensure centering & perspective are set cleanly before GSAP animates
      gsap.set(flap, { rotationX: 0, transformPerspective: 1100 });
      gsap.set(seal, { xPercent: -50, yPercent: -50 });
      gsap.set(emerging, { xPercent: -50, yPercent: 20, scale: 0.86, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          if (theater) theater.classList.remove('is-revealing');
          this.activeTimeline = null;
          if (typeof onComplete === 'function') onComplete();
        }
      });
      this.activeTimeline = tl;

      // Step 1: Level envelope cleanly, fade surrounding UI, and lift wax seal
      tl.to([arrivalCopy, arrivalAction], {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
        .to(
          envObj,
          {
            rotation: 0,
            y: 0,
            duration: 0.32,
            ease: 'power2.out'
          },
          0
        )
        .to(
          seal,
          {
            scale: 1.08,
            opacity: 0,
            y: -8,
            duration: 0.26,
            ease: 'power2.out'
          },
          0.1
        )
        // Step 2: Smooth 3D flap unfold around top crease (drops behind pocket & bloom past 90deg)
        .to(
          flap,
          {
            rotationX: 176,
            duration: 0.68,
            ease: 'power2.inOut',
            onUpdate: function () {
              if (!flap) return;
              const currentAngle = Number(gsap.getProperty(flap, 'rotationX')) || 0;
              flap.style.zIndex = currentAngle >= 90 ? '2' : '5';
            }
          },
          0.16
        )
        // Step 3: Floral keepsake rises centered out of the envelope pocket
        .to(
          emerging,
          {
            opacity: 1,
            yPercent: -44,
            scale: 1,
            duration: 0.58,
            ease: 'power3.out'
          },
          0.52
        )
        // Prepare bouquet theater & cross-dissolve seamlessly without a dead pause
        .add(() => {
          if (scene2) scene2.hidden = false;
          if (theater) {
            theater.classList.add('is-visible', 'is-revealing');
          }
          if (typeof onSceneSwap === 'function') onSceneSwap();

          gsap.set(theater, { opacity: 1 });
          gsap.set('#bouquet-canvas-mount', { y: 24, scale: 0.96, opacity: 0, force3D: true });
          gsap.set(['#wrap-wing-left', '#wrap-wing-right'], { scaleX: 0.9, opacity: 0.5, transformOrigin: '50% 85%' });
          gsap.set('#wrap-front-fold', { y: 10, opacity: 0 });
          gsap.set(['#bouquet-stems', '#bouquet-foliage'], { scaleY: 0.92, opacity: 0, transformOrigin: '50% 92%' });
          gsap.set(
            ['#flower-node-delphinium', '#flower-node-hydrangea', '#flower-node-rose', '#flower-node-forgetmenot'],
            { scale: 0.86, opacity: 0, transformOrigin: '50% 72%' }
          );
          gsap.set('#rose-petals-inner', { scale: 0.88, transformOrigin: '50% 50%' });
          gsap.set('#bouquet-ribbon', { scale: 0.92, opacity: 0, transformOrigin: '50% 35%' });
          gsap.set(scene2Copy, { opacity: 0, y: 14 });
        }, 1.25)
        .to(
          envStage,
          {
            y: 34,
            opacity: 0,
            scale: 0.96,
            duration: 0.52,
            ease: 'power2.inOut',
            onComplete: () => {
              if (scene1) scene1.hidden = true;
            }
          },
          1.25
        )
        // Full bouquet glides into place as envelope dissolves
        .to(
          '#bouquet-canvas-mount',
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.78,
            ease: 'power3.out'
          },
          1.45
        )
        // Step 4: Ivory wrapping paper wings unfold
        .to(
          ['#wrap-wing-left', '#wrap-wing-right'],
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.62,
            stagger: 0.06,
            ease: 'power2.out'
          },
          1.55
        )
        .to(
          '#wrap-front-fold',
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out'
          },
          1.66
        )
        // Step 5: Stems and sage leaves emerge
        .to(
          ['#bouquet-stems', '#bouquet-foliage'],
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power2.out'
          },
          1.72
        )
        // Step 6: Individual flowers bloom in smooth sequence
        .to(
          '#flower-node-delphinium',
          {
            scale: 1,
            opacity: 1,
            duration: 0.58,
            ease: 'power3.out'
          },
          1.9
        )
        .to(
          '#flower-node-hydrangea',
          {
            scale: 1,
            opacity: 1,
            duration: 0.58,
            ease: 'power3.out'
          },
          2.02
        )
        .to(
          '#flower-node-rose',
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out'
          },
          2.14
        )
        .to(
          '#rose-petals-inner',
          {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          },
          2.24
        )
        .to(
          '#flower-node-forgetmenot',
          {
            scale: 1,
            opacity: 1,
            duration: 0.56,
            ease: 'power3.out'
          },
          2.28
        )
        // Step 7: Powder-blue silk ribbon settles
        .to(
          '#bouquet-ribbon',
          {
            scale: 1,
            opacity: 1,
            duration: 0.58,
            ease: 'power3.out'
          },
          2.42
        )
        // Step 8: Bouquet reveal completes & editorial message appears
        .to(
          scene2Copy,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out'
          },
          2.58
        );
    }

    /**
     * Scene 4: Subtle 3D stationery sheet unfold animation.
     */
    playLetterUnfold(sheetEl, onComplete) {
      this.killActive();
      if (!sheetEl) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      if (!this.hasGsap || this.reducedMotion) {
        sheetEl.style.opacity = '1';
        sheetEl.style.transform = 'none';
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      const tl = global.gsap.timeline({
        onComplete: () => {
          this.activeTimeline = null;
          if (typeof onComplete === 'function') onComplete();
        }
      });
      this.activeTimeline = tl;

      tl.fromTo(
        sheetEl,
        {
          opacity: 0,
          rotationX: -22,
          y: 26,
          scaleY: 0.9
        },
        {
          opacity: 1,
          rotationX: 0,
          y: 0,
          scaleY: 1,
          duration: 0.95,
          ease: 'power3.out',
          clearProps: 'transform'
        }
      );
    }

    /**
     * Smooth crossfade for Scene transitions.
     */
    playSceneTransition(outgoingEl, incomingEl, onBeforeReveal, onComplete) {
      this.killActive();

      if (!this.hasGsap || this.reducedMotion) {
        if (outgoingEl) outgoingEl.hidden = true;
        if (typeof onBeforeReveal === 'function') onBeforeReveal();
        if (incomingEl) {
          incomingEl.hidden = false;
          incomingEl.style.opacity = '1';
          incomingEl.style.transform = 'none';
        }
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      const gsap = global.gsap;
      const tl = gsap.timeline({
        onComplete: () => {
          this.activeTimeline = null;
          if (typeof onComplete === 'function') onComplete();
        }
      });
      this.activeTimeline = tl;

      if (outgoingEl && !outgoingEl.hidden) {
        tl.to(outgoingEl, {
          opacity: 0,
          y: -10,
          duration: 0.36,
          ease: 'power2.in',
          onComplete: () => {
            outgoingEl.hidden = true;
            gsap.set(outgoingEl, { clearProps: 'opacity,transform' });
          }
        });
      }

      tl.add(() => {
        if (typeof onBeforeReveal === 'function') onBeforeReveal();
        if (incomingEl) {
          incomingEl.hidden = false;
          gsap.set(incomingEl, { opacity: 0, y: 14 });
        }
      });

      if (incomingEl) {
        tl.to(incomingEl, {
          opacity: 1,
          y: 0,
          duration: 0.62,
          ease: 'power3.out',
          clearProps: 'transform'
        });
      }
    }
  }

  global.AnimationEngine = AnimationEngine;
})(window);
