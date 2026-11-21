/**
 * LetterExperience
 * Renders the complete original message verbatim across six natural reading
 * sections inside the 3D folded stationery sheet, with Previous/Next
 * navigation, section indicators, and natural scrolling.
 */
(function (global) {
  'use strict';

  const LETTER_SECTIONS = [
    'First off, I want to extend my sincerest condolences to you and your family on the passing of your aunt. 🥺💙🙏🏽 I pray God continues to give you strength, comfort, and peace as you navigate through this difficult time.',
    'I also want to take a moment to remind you of just how beautiful and strong you are, inside and out. 🥰💙 I’ve watched you carry so much this week, from dealing with the stress and challenges of your clients to trying to process the loss of your aunt. And through it all, you’ve continued to show up, handle your responsibilities, and be there for the people who depend on you. I admire your strength, your heart, and the woman you are more than you probably realize. But baby, I also want you to know that just because you’re strong doesn’t mean you always have to be. You deserve to be comforted, loved on, and poured into too. 💙',
    'This load I’m carrying right now is heavier than I can even begin to explain. 🥺💙 But having you by my side through this storm has meant more to me than you’ll ever truly know. Especially knowing that you’re dealing with your own battles and carrying a weight of your own. Even with everything you have going on, you still manage to make time for me, check on me, show up for me, and find little ways to make my days a bit easier. 🥹💙 And baby, please know that none of your love, effort, or thoughtfulness goes unnoticed. I see you, I appreciate you, and I never want you to feel like anything you do for me is taken for granted. You’ve been a blessing to me during one of the hardest moments of my life, and that means more to me than words could ever express. 🫶🏽🥰😘',
    'I know we’re both going through a lot right now, but I want you to understand that you don’t have to carry everything alone either. Just as you’ve been a source of comfort and peace for me, I want to be that same safe place for you. We both deserve someone we can lean on without feeling like we’re adding to each other’s burdens.',
    'I don’t just admire the beautiful woman I see on the outside. I admire your heart, your resilience, your compassion, and even the parts of you that get tired but keep pushing anyway. Just know that you are appreciated, you are valued, and you deserve the same love, patience, and understanding that you so freely give to others.',
    'Thank you for being beside me in the middle of your own storm. I hope you always feel just as supported by me as you’ve made me feel by you. 🫶🏽🥹💙😘\n\nI love you dearly 🥰💯‼️'
  ];

  class LetterExperience {
    constructor({ onCompleteLetter, onAnnounce }) {
      this.sections = LETTER_SECTIONS;
      this.currentIndex = 0;
      this.isFullView = false;
      this.visited = new Set([0]);
      this.onCompleteLetter = onCompleteLetter;
      this.onAnnounce = onAnnounce;

      this.sheetEl = document.getElementById('letter-sheet');
      this.viewportEl = document.getElementById('letter-scroll-viewport');
      this.containerEl = document.getElementById('letter-sections-container');
      this.indicatorsEl = document.getElementById('letter-section-indicators');
      this.statusEl = document.getElementById('letter-status-text');
      this.prevBtn = document.getElementById('btn-letter-prev');
      this.nextBtn = document.getElementById('btn-letter-next');
      this.toggleModeBtn = document.getElementById('btn-toggle-letter-mode');

      this.render();
      this.bindEvents();
      this.updateView({ announce: false });
    }

    render() {
      if (this.indicatorsEl) {
        this.indicatorsEl.innerHTML = this.sections
          .map(
            (_, idx) => `
              <button
                type="button"
                role="tab"
                class="letter-pip ${idx === 0 ? 'is-active' : ''}"
                data-letter-index="${idx}"
                aria-selected="${idx === 0 ? 'true' : 'false'}"
                aria-label="Reading section ${idx + 1} of ${this.sections.length}"
              >
                <span class="letter-pip-bar" aria-hidden="true"></span>
              </button>
            `
          )
          .join('');
      }

      if (this.containerEl) {
        this.containerEl.innerHTML = this.sections
          .map((sectionText, idx) => {
            const paragraphs = sectionText
              .split(/\n\s*\n/)
              .map((p) => `<p class="letter-paragraph">${this.escapeHtml(p)}</p>`)
              .join('');

            return `
              <section
                class="letter-section-block ${idx === 0 ? 'is-current-section' : ''}"
                data-section-block="${idx}"
                aria-label="Section ${idx + 1} of ${this.sections.length}"
              >
                ${paragraphs}
              </section>
            `;
          })
          .join('');
      }
    }

    escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    bindEvents() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.goPrevious());
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.goNext());
      }

      if (this.indicatorsEl) {
        this.indicatorsEl.addEventListener('click', (event) => {
          const btn = event.target.closest('[data-letter-index]');
          if (!btn) return;
          const idx = Number(btn.getAttribute('data-letter-index'));
          if (!Number.isNaN(idx)) {
            this.goToSection(idx);
          }
        });

        this.indicatorsEl.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            if (this.currentIndex < this.sections.length - 1) {
              this.goToSection(this.currentIndex + 1);
            }
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            if (this.currentIndex > 0) {
              this.goToSection(this.currentIndex - 1);
            }
          }
        });
      }

      if (this.toggleModeBtn) {
        this.toggleModeBtn.addEventListener('click', () => {
          this.isFullView = !this.isFullView;
          this.updateView({ announce: true });
        });
      }
    }

    reset() {
      this.currentIndex = 0;
      this.visited = new Set([0]);
      this.isFullView = false;
      this.updateView({ announce: false });
      if (this.viewportEl) {
        this.viewportEl.scrollTop = 0;
      }
    }

    goPrevious() {
      if (this.currentIndex > 0) {
        this.goToSection(this.currentIndex - 1);
      }
    }

    goNext() {
      if (this.currentIndex < this.sections.length - 1) {
        this.goToSection(this.currentIndex + 1);
      } else if (typeof this.onCompleteLetter === 'function') {
        this.onCompleteLetter();
      }
    }

    goToSection(index) {
      if (index < 0 || index >= this.sections.length) return;
      this.currentIndex = index;
      this.visited.add(index);
      this.updateView({ announce: true });

      if (this.isFullView && this.containerEl) {
        const block = this.containerEl.querySelector(`[data-section-block="${index}"]`);
        if (block && typeof block.scrollIntoView === 'function') {
          block.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (this.viewportEl) {
        this.viewportEl.scrollTop = 0;
      }
    }

    updateView({ announce = false } = {}) {
      const total = this.sections.length;
      const isLast = this.currentIndex === total - 1;

      if (this.sheetEl) {
        this.sheetEl.classList.toggle('is-full-view', this.isFullView);
      }

      if (this.toggleModeBtn) {
        this.toggleModeBtn.setAttribute('aria-pressed', String(this.isFullView));
        this.toggleModeBtn.textContent = this.isFullView
          ? 'Read section by section'
          : 'Read all sections together';
      }

      if (this.containerEl) {
        const blocks = this.containerEl.querySelectorAll('[data-section-block]');
        blocks.forEach((block) => {
          const idx = Number(block.getAttribute('data-section-block'));
          block.classList.toggle('is-current-section', idx === this.currentIndex);
        });
      }

      if (this.indicatorsEl) {
        const pips = this.indicatorsEl.querySelectorAll('[data-letter-index]');
        pips.forEach((pip) => {
          const idx = Number(pip.getAttribute('data-letter-index'));
          pip.classList.toggle('is-active', idx === this.currentIndex);
          pip.classList.toggle('is-visited', this.visited.has(idx) && idx !== this.currentIndex);
          pip.setAttribute('aria-selected', String(idx === this.currentIndex));
        });
      }

      if (this.statusEl) {
        this.statusEl.textContent = this.isFullView
          ? `Full letter (${total} sections)`
          : `Section ${this.currentIndex + 1} of ${total}`;
      }

      if (this.prevBtn) {
        this.prevBtn.disabled = this.isFullView || this.currentIndex === 0;
      }

      if (this.nextBtn) {
        this.nextBtn.textContent = isLast || this.isFullView ? 'Continue' : 'Next';
      }

      if (announce && typeof this.onAnnounce === 'function') {
        if (this.isFullView) {
          this.onAnnounce('Showing all six sections of the letter for continuous scrolling.');
        } else {
          this.onAnnounce(`Reading section ${this.currentIndex + 1} of ${total}.`);
        }
      }
    }
  }

  global.LetterExperience = LetterExperience;
})(window);
