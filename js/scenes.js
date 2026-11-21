/**
 * SceneController
 * Centralized state machine governing all five scenes, preventing overlapping
 * transitions, managing environment themes, and maintaining accessible focus.
 */
(function (global) {
  'use strict';

  const SCENE_META = {
    1: { id: 'scene-1', theme: 'midnight', showBouquet: false, interactiveBouquet: false, title: 'Scene 1: The Arrival' },
    2: { id: 'scene-2', theme: 'midnight', showBouquet: true, interactiveBouquet: false, title: 'Scene 2: The Bouquet Reveal' },
    3: { id: 'scene-3', theme: 'midnight', showBouquet: true, interactiveBouquet: true, title: 'Scene 3: Flower Discovery' },
    4: { id: 'scene-4', theme: 'ivory', showBouquet: false, interactiveBouquet: false, title: 'Scene 4: The Letter' },
    5: { id: 'scene-5', theme: 'midnight', showBouquet: true, interactiveBouquet: false, title: 'Scene 5: Final Moment' }
  };

  class SceneController {
    constructor({ animationEngine, bouquetComponent, letterExperience }) {
      this.animations = animationEngine;
      this.bouquet = bouquetComponent;
      this.letter = letterExperience;
      this.currentScene = 1;
      this.isTransitioning = false;
      this.hasRevealedBouquet = false;

      this.announcerEl = document.getElementById('scene-announcer');
      this.theaterEl = document.getElementById('bouquet-theater');
      this.chapterButtons = document.querySelectorAll('[data-goto-scene]');

      this.bindNavigationEvents();
    }

    announce(message) {
      if (!this.announcerEl || !message) return;
      this.announcerEl.textContent = '';
      window.requestAnimationFrame(() => {
        this.announcerEl.textContent = message;
      });
    }

    bindNavigationEvents() {
      const openBtn = document.getElementById('btn-open-gift');
      const envelopeEl = document.getElementById('arrival-envelope');

      const handleOpenGift = () => {
        if (this.currentScene !== 1 || this.isTransitioning) return;
        this.goTo(2, { playChoreography: true });
      };

      if (openBtn) {
        openBtn.addEventListener('click', handleOpenGift);
      }

      if (envelopeEl) {
        envelopeEl.addEventListener('click', handleOpenGift);
        envelopeEl.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpenGift();
          }
        });
      }

      const exploreBtn = document.getElementById('btn-explore-flowers');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => this.goTo(3));
      }

      const toLetterBtn = document.getElementById('btn-to-letter');
      if (toLetterBtn) {
        toLetterBtn.addEventListener('click', () => this.goTo(4));
      }

      const replayBtn = document.getElementById('btn-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => this.replayExperience());
      }

      this.chapterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = Number(btn.getAttribute('data-goto-scene'));
          if (!Number.isNaN(target)) {
            this.goTo(target, { playChoreography: target === 2 && !this.hasRevealedBouquet });
          }
        });
      });
    }

    start() {
      this.syncChrome(1);
      this.animations.playArrivalEntrance();
    }

    replayExperience() {
      if (this.isTransitioning) return;
      this.hasRevealedBouquet = false;
      this.animations.resetEnvelopeState();
      if (this.letter) {
        this.letter.reset();
      }
      this.goTo(1, { isReplay: true });
    }

    goTo(targetScene, options = {}) {
      const meta = SCENE_META[targetScene];
      if (!meta || this.isTransitioning) return;
      if (targetScene === this.currentScene && !options.isReplay) return;

      this.isTransitioning = true;
      const previousScene = this.currentScene;
      const outgoingEl = document.getElementById(SCENE_META[previousScene].id);
      const incomingEl = document.getElementById(meta.id);

      if (previousScene === 1 && targetScene === 2 && options.playChoreography) {
        this.currentScene = 2;
        this.syncChrome(2);
        this.bouquet.setInteractive(false);

        this.animations.playBouquetReveal({
          onSceneSwap: () => {
            this.hasRevealedBouquet = true;
          },
          onComplete: () => {
            this.isTransitioning = false;
            this.announce(meta.title);
            this.focusSceneHeading(incomingEl);
          }
        });
        return;
      }

      this.currentScene = targetScene;
      this.syncChrome(targetScene);

      this.animations.playSceneTransition(
        outgoingEl,
        incomingEl,
        () => {
          Object.keys(SCENE_META).forEach((key) => {
            const num = Number(key);
            const el = document.getElementById(SCENE_META[num].id);
            if (el && num !== targetScene) {
              el.hidden = true;
            }
          });

          if (meta.showBouquet) {
            if (!this.hasRevealedBouquet) {
              this.hasRevealedBouquet = true;
              this.animations.snapBouquetToOpenState();
            } else if (this.theaterEl) {
              this.theaterEl.classList.add('is-visible');
              this.theaterEl.style.opacity = '1';
            }
            this.bouquet.setInteractive(meta.interactiveBouquet);
          } else {
            this.bouquet.setInteractive(false);
            if (this.theaterEl) {
              this.theaterEl.classList.remove('is-visible');
              this.theaterEl.style.opacity = '0';
            }
          }

          if (targetScene === 1) {
            this.animations.resetEnvelopeState();
          }
        },
        () => {
          if (targetScene === 4) {
            const sheetEl = document.getElementById('letter-sheet');
            this.animations.playLetterUnfold(sheetEl, () => {
              this.isTransitioning = false;
              this.announce(meta.title);
              this.focusSceneHeading(incomingEl);
            });
            return;
          }

          if (targetScene === 1) {
            this.animations.playArrivalEntrance();
          }

          this.isTransitioning = false;
          this.announce(meta.title);
          this.focusSceneHeading(incomingEl);
        }
      );
    }

    syncChrome(sceneNumber) {
      const meta = SCENE_META[sceneNumber];
      if (!meta) return;

      document.body.dataset.scene = String(sceneNumber);
      document.body.dataset.theme = meta.theme;

      this.chapterButtons.forEach((btn) => {
        const stepScene = Number(btn.getAttribute('data-goto-scene'));
        const isCurrent = stepScene === sceneNumber;
        btn.classList.toggle('is-active', isCurrent);
        if (isCurrent) {
          btn.setAttribute('aria-current', 'step');
        } else {
          btn.removeAttribute('aria-current');
        }
      });
    }

    focusSceneHeading(sceneEl) {
      if (!sceneEl) return;
      const heading = sceneEl.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  }

  global.SceneController = SceneController;
})(window);
