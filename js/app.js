/**
 * Application Bootstrap
 * Initializes the AnimationEngine, BouquetComponent, LetterExperience,
 * and centralized SceneController.
 */
(function () {
  'use strict';

  function init() {
    const animationEngine = new window.AnimationEngine();
    let sceneController = null;

    const bouquetComponent = new window.BouquetComponent({
      mountEl: document.getElementById('bouquet-canvas-mount'),
      theaterEl: document.getElementById('bouquet-theater'),
      onFlowerSelect: () => {
        if (sceneController && sceneController.currentScene === 2) {
          sceneController.goTo(3);
        }
      },
      onAnnounce: (msg) => {
        if (sceneController) {
          sceneController.announce(msg);
        }
      }
    });

    const letterExperience = new window.LetterExperience({
      onCompleteLetter: () => {
        if (sceneController) {
          sceneController.goTo(5);
        }
      },
      onAnnounce: (msg) => {
        if (sceneController) {
          sceneController.announce(msg);
        }
      }
    });

    sceneController = new window.SceneController({
      animationEngine,
      bouquetComponent,
      letterExperience
    });

    sceneController.start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
