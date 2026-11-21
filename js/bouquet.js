/**
 * BouquetComponent
 * Builds the hybrid multi-layered SVG floral arrangement (ivory wrap, organic stems,
 * muted-sage eucalyptus & ruscus foliage, 4 interactive multi-layered flowers, and
 * powder-blue silk ribbon) and manages flower discovery interactions.
 */
(function (global) {
  'use strict';

  const FLOWERS = {
    hydrangea: {
      id: 'hydrangea',
      name: 'Blue Hydrangea',
      meaning: 'Appreciation',
      message:
        'You notice when people are struggling and step in before anyone has to ask. Most of that effort goes unseen. This bloom is here because I see how much you give, and I’m grateful for every bit of it.'
    },
    rose: {
      id: 'rose',
      name: 'White Garden Rose',
      meaning: 'Genuine affection',
      message:
        'There’s nothing fake about the way you care for people. When you show up, you bring your whole heart with you, and everyone in your corner feels that difference.'
    },
    forgetmenot: {
      id: 'forgetmenot',
      name: 'Forget-Me-Not',
      meaning: 'Remembrance',
      message:
        'When you’re busy holding everything together for everybody else, it’s easy to feel overlooked. You’re not. You’re on my mind today simply because of who you are.'
    },
    delphinium: {
      id: 'delphinium',
      name: 'Blue Delphinium',
      meaning: 'Encouragement',
      message:
        'Some days are heavier than you let on. I hope you feel the same patience and grace coming back to you that you’re always handing out to everyone else.'
    }
  };

  class BouquetComponent {
    constructor({ mountEl, theaterEl, onFlowerSelect, onAnnounce }) {
      this.mountEl = mountEl;
      this.theaterEl = theaterEl;
      this.onFlowerSelect = onFlowerSelect;
      this.onAnnounce = onAnnounce;
      this.selectedId = 'hydrangea';
      this.exploredIds = new Set(['hydrangea']);
      this.isInteractive = false;

      this.render();
      this.bindEvents();
      this.updateDetailCard('hydrangea', { announce: false });
    }

    render() {
      if (!this.mountEl) return;

      this.mountEl.innerHTML = `
        <svg
          class="bouquet-svg"
          viewBox="0 0 460 560"
          role="img"
          aria-label="A bespoke wrapped bouquet of blue delphinium, blue hydrangea, white garden rose, and forget-me-nots tied with a powder-blue silk ribbon"
        >
          <defs>
            <pattern id="ivoryPaperTex" patternUnits="userSpaceOnUse" width="220" height="220">
              <image href="assets/textures/paper-grain.png" x="0" y="0" width="220" height="220" />
            </pattern>
            <pattern id="silkRibbonTex" patternUnits="userSpaceOnUse" width="160" height="160">
              <image href="assets/textures/silk-weave.png" x="0" y="0" width="160" height="160" />
            </pattern>

            <linearGradient id="wrapBackGrad" x1="120" y1="140" x2="340" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#F5F0E7" />
              <stop offset="55%" stop-color="#EAE1D0" />
              <stop offset="100%" stop-color="#D7CCB8" />
            </linearGradient>
            <linearGradient id="wrapInnerShadow" x1="230" y1="160" x2="230" y2="395" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#172D43" stop-opacity="0.16" />
              <stop offset="100%" stop-color="#101C2C" stop-opacity="0.34" />
            </linearGradient>
            <linearGradient id="wrapFrontLeftGrad" x1="115" y1="305" x2="245" y2="535" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#F7F3EB" />
              <stop offset="65%" stop-color="#ECE3D3" />
              <stop offset="100%" stop-color="#DDD2BE" />
            </linearGradient>
            <linearGradient id="wrapFrontRightGrad" x1="345" y1="295" x2="215" y2="535" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#F3EDE2" />
              <stop offset="65%" stop-color="#E6DCCB" />
              <stop offset="100%" stop-color="#D4C7B1" />
            </linearGradient>

            <radialGradient id="eucLeafGrad" cx="38%" cy="35%" r="68%">
              <stop offset="0%" stop-color="#B0C2B3" />
              <stop offset="60%" stop-color="#899B8C" />
              <stop offset="100%" stop-color="#607364" />
            </radialGradient>
            <linearGradient id="ruscusGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#96A899" />
              <stop offset="58%" stop-color="#738677" />
              <stop offset="100%" stop-color="#506254" />
            </linearGradient>

            <radialGradient id="delphPetalGrad" cx="40%" cy="35%" r="68%">
              <stop offset="0%" stop-color="#D6E6F4" />
              <stop offset="54%" stop-color="#96B7D4" />
              <stop offset="100%" stop-color="#5B80A4" />
            </radialGradient>

            <radialGradient id="hydLightGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#E1EEF8" />
              <stop offset="58%" stop-color="#B8D0E2" />
              <stop offset="100%" stop-color="#86A7C3" />
            </radialGradient>
            <radialGradient id="hydMidGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#C9DDEC" />
              <stop offset="64%" stop-color="#9BB8D1" />
              <stop offset="100%" stop-color="#6B8FAE" />
            </radialGradient>
            <radialGradient id="hydDeepGrad" cx="45%" cy="40%" r="65%">
              <stop offset="0%" stop-color="#A9B9C8" />
              <stop offset="70%" stop-color="#7796B4" />
              <stop offset="100%" stop-color="#4F6E8D" />
            </radialGradient>

            <radialGradient id="roseOuterPetal" cx="42%" cy="35%" r="68%">
              <stop offset="0%" stop-color="#FEFCF9" />
              <stop offset="68%" stop-color="#F5F0E7" />
              <stop offset="100%" stop-color="#DCD0BC" />
            </radialGradient>
            <radialGradient id="roseMidPetal" cx="45%" cy="40%" r="65%">
              <stop offset="0%" stop-color="#FAF6EE" />
              <stop offset="62%" stop-color="#EFE5D4" />
              <stop offset="100%" stop-color="#CFC0A4" />
            </radialGradient>
            <radialGradient id="roseHeartPetal" cx="50%" cy="50%" r="62%">
              <stop offset="0%" stop-color="#DEC69B" />
              <stop offset="62%" stop-color="#E9D9BC" />
              <stop offset="100%" stop-color="#F5F0E7" />
            </radialGradient>

            <radialGradient id="fmnPetalGrad" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#EAF3FA" />
              <stop offset="55%" stop-color="#B8D0E2" />
              <stop offset="100%" stop-color="#81A4C2" />
            </radialGradient>

            <linearGradient id="ribbonLoopGrad" x1="140" y1="340" x2="320" y2="415" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#D7E6F2" />
              <stop offset="50%" stop-color="#B8D0E2" />
              <stop offset="100%" stop-color="#85A5C0" />
            </linearGradient>
            <linearGradient id="ribbonTailGrad" x1="230" y1="385" x2="230" y2="532" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#96B5CE" />
              <stop offset="35%" stop-color="#B8D0E2" />
              <stop offset="100%" stop-color="#87A5BF" />
            </linearGradient>

            <g id="delph-floret-unit">
              <ellipse cx="0" cy="-14" rx="8" ry="12.5" fill="url(#delphPetalGrad)" stroke="#527495" stroke-width="0.55" />
              <ellipse cx="13.3" cy="-4.3" rx="8" ry="12.5" transform="rotate(72)" fill="url(#delphPetalGrad)" stroke="#527495" stroke-width="0.55" />
              <ellipse cx="8.2" cy="11.3" rx="8" ry="12.5" transform="rotate(144)" fill="url(#delphPetalGrad)" stroke="#527495" stroke-width="0.55" />
              <ellipse cx="-8.2" cy="11.3" rx="8" ry="12.5" transform="rotate(216)" fill="url(#delphPetalGrad)" stroke="#527495" stroke-width="0.55" />
              <ellipse cx="-13.3" cy="-4.3" rx="8" ry="12.5" transform="rotate(288)" fill="url(#delphPetalGrad)" stroke="#527495" stroke-width="0.55" />
              <circle cx="0" cy="0" r="4.6" fill="#BDA477" />
              <circle cx="0" cy="0" r="1.9" fill="#F5F0E7" />
            </g>

            <g id="hyd-floret-a">
              <path d="M0 -2.5 C-7.5 -16, -20 -12.5, -16.5 -1.5 C-13.5 5.5, -3.5 3.5, 0 0 Z" fill="url(#hydLightGrad)" stroke="#7B9BB6" stroke-width="0.55" />
              <path d="M0 -2.5 C7.5 -16, 20 -12.5, 16.5 -1.5 C13.5 5.5, 3.5 3.5, 0 0 Z" fill="url(#hydLightGrad)" stroke="#7B9BB6" stroke-width="0.55" />
              <path d="M0 2.5 C-7.5 16, -20 12.5, -16.5 1.5 C-13.5 -5.5, -3.5 -3.5, 0 0 Z" fill="url(#hydLightGrad)" stroke="#7B9BB6" stroke-width="0.55" />
              <path d="M0 2.5 C7.5 16, 20 12.5, 16.5 1.5 C13.5 -5.5, 3.5 -3.5, 0 0 Z" fill="url(#hydLightGrad)" stroke="#7B9BB6" stroke-width="0.55" />
              <circle cx="0" cy="0" r="2.2" fill="#BDA477" />
            </g>

            <g id="hyd-floret-b">
              <path d="M0 -2.5 C-7.5 -16, -20 -12.5, -16.5 -1.5 C-13.5 5.5, -3.5 3.5, 0 0 Z" fill="url(#hydMidGrad)" stroke="#6283A1" stroke-width="0.55" />
              <path d="M0 -2.5 C7.5 -16, 20 -12.5, 16.5 -1.5 C13.5 5.5, 3.5 3.5, 0 0 Z" fill="url(#hydMidGrad)" stroke="#6283A1" stroke-width="0.55" />
              <path d="M0 2.5 C-7.5 16, -20 12.5, -16.5 1.5 C-13.5 -5.5, -3.5 -3.5, 0 0 Z" fill="url(#hydMidGrad)" stroke="#6283A1" stroke-width="0.55" />
              <path d="M0 2.5 C7.5 16, 20 12.5, 16.5 1.5 C13.5 -5.5, 3.5 -3.5, 0 0 Z" fill="url(#hydMidGrad)" stroke="#6283A1" stroke-width="0.55" />
              <circle cx="0" cy="0" r="2.1" fill="#F5F0E7" />
            </g>

            <g id="hyd-floret-c">
              <path d="M0 -2.5 C-7.5 -16, -20 -12.5, -16.5 -1.5 C-13.5 5.5, -3.5 3.5, 0 0 Z" fill="url(#hydDeepGrad)" stroke="#4A6885" stroke-width="0.55" />
              <path d="M0 -2.5 C7.5 -16, 20 -12.5, 16.5 -1.5 C13.5 5.5, 3.5 3.5, 0 0 Z" fill="url(#hydDeepGrad)" stroke="#4A6885" stroke-width="0.55" />
              <path d="M0 2.5 C-7.5 16, -20 12.5, -16.5 1.5 C-13.5 -5.5, -3.5 -3.5, 0 0 Z" fill="url(#hydDeepGrad)" stroke="#4A6885" stroke-width="0.55" />
              <path d="M0 2.5 C7.5 16, 20 12.5, 16.5 1.5 C13.5 -5.5, 3.5 -3.5, 0 0 Z" fill="url(#hydDeepGrad)" stroke="#4A6885" stroke-width="0.55" />
              <circle cx="0" cy="0" r="2" fill="#BDA477" />
            </g>

            <g id="fmn-blossom-unit">
              <ellipse cx="0" cy="-10.5" rx="6.6" ry="9.6" fill="url(#fmnPetalGrad)" stroke="#789AB8" stroke-width="0.45" />
              <ellipse cx="10" cy="-3.2" rx="6.6" ry="9.6" transform="rotate(72)" fill="url(#fmnPetalGrad)" stroke="#789AB8" stroke-width="0.45" />
              <ellipse cx="6.2" cy="8.5" rx="6.6" ry="9.6" transform="rotate(144)" fill="url(#fmnPetalGrad)" stroke="#789AB8" stroke-width="0.45" />
              <ellipse cx="-6.2" cy="8.5" rx="6.6" ry="9.6" transform="rotate(216)" fill="url(#fmnPetalGrad)" stroke="#789AB8" stroke-width="0.45" />
              <ellipse cx="-10" cy="-3.2" rx="6.6" ry="9.6" transform="rotate(288)" fill="url(#fmnPetalGrad)" stroke="#789AB8" stroke-width="0.45" />
              <circle cx="0" cy="0" r="4.1" fill="#BDA477" />
              <circle cx="0" cy="0" r="1.7" fill="#F5F0E7" />
            </g>
          </defs>

          <!-- LAYER 1: BACK IVORY WRAPPING PAPER CONE & UNFOLDED WINGS -->
          <g id="wrap-back">
            <path
              id="wrap-wing-left"
              d="M230 410 L86 238 C118 192, 164 166, 208 158 L230 398 Z"
              fill="url(#wrapBackGrad)"
              stroke="#D2C5AF"
              stroke-width="1"
            />
            <path
              id="wrap-wing-right"
              d="M230 410 L374 226 C344 182, 298 158, 250 154 L230 398 Z"
              fill="url(#wrapBackGrad)"
              stroke="#D2C5AF"
              stroke-width="1"
            />
            <path
              d="M230 132 L346 254 L230 434 L114 254 Z"
              fill="url(#wrapBackGrad)"
              stroke="#CFC2AC"
              stroke-width="1"
            />
            <path
              d="M230 132 L346 254 L230 434 L114 254 Z"
              fill="url(#ivoryPaperTex)"
              opacity="0.42"
            />
            <path
              d="M134 258 L230 172 L326 258 L230 412 Z"
              fill="url(#wrapInnerShadow)"
            />
          </g>

          <!-- LAYER 2: STEMS & MUTED-SAGE BOTANICAL FOLIAGE -->
          <g id="bouquet-stems">
            <path d="M168 118 C184 224, 212 346, 224 516" stroke="#627566" stroke-width="3.2" stroke-linecap="round" fill="none" />
            <path d="M182 232 C198 310, 218 402, 232 522" stroke="#6F8273" stroke-width="3" stroke-linecap="round" fill="none" />
            <path d="M276 238 C258 320, 240 412, 228 524" stroke="#5E7162" stroke-width="3.2" stroke-linecap="round" fill="none" />
            <path d="M312 292 C282 356, 252 430, 238 518" stroke="#788B7C" stroke-width="2.6" stroke-linecap="round" fill="none" />
            <path d="M136 226 C168 298, 202 396, 220 512" stroke="#748778" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <path d="M332 234 C296 310, 260 404, 235 516" stroke="#697C6D" stroke-width="2.6" stroke-linecap="round" fill="none" />
          </g>

          <g id="bouquet-foliage">
            <g class="sway-foliage-left">
              <path d="M126 202 C152 258, 184 316, 212 374" stroke="#6E8172" stroke-width="2.2" fill="none" stroke-linecap="round" />
              <ellipse cx="122" cy="196" rx="13" ry="17" transform="rotate(-28 122 196)" fill="url(#eucLeafGrad)" />
              <ellipse cx="114" cy="226" rx="18" ry="13" transform="rotate(-16 114 226)" fill="url(#eucLeafGrad)" />
              <ellipse cx="152" cy="216" rx="17" ry="12" transform="rotate(24 152 216)" fill="url(#eucLeafGrad)" />
              <ellipse cx="128" cy="256" rx="20" ry="14" transform="rotate(-22 128 256)" fill="url(#eucLeafGrad)" />
              <ellipse cx="166" cy="250" rx="18" ry="13" transform="rotate(20 166 250)" fill="url(#eucLeafGrad)" />
              <ellipse cx="144" cy="288" rx="19" ry="14" transform="rotate(-18 144 288)" fill="url(#eucLeafGrad)" />
            </g>

            <g class="sway-foliage-right">
              <path d="M344 206 C312 260, 278 318, 246 376" stroke="#637667" stroke-width="2.2" fill="none" stroke-linecap="round" />
              <path d="M346 202 C354 184, 368 174, 380 172 C376 188, 364 200, 346 202 Z" fill="url(#ruscusGrad)" />
              <path d="M328 228 C348 222, 366 226, 376 236 C358 242, 340 238, 328 228 Z" fill="url(#ruscusGrad)" />
              <path d="M322 224 C312 204, 314 186, 324 176 C332 192, 330 210, 322 224 Z" fill="url(#ruscusGrad)" />
              <ellipse cx="342" cy="264" rx="19" ry="13" transform="rotate(24 342 264)" fill="url(#eucLeafGrad)" />
              <ellipse cx="304" cy="256" rx="18" ry="13" transform="rotate(-22 304 256)" fill="url(#eucLeafGrad)" />
              <ellipse cx="332" cy="296" rx="18" ry="13" transform="rotate(18 332 296)" fill="url(#eucLeafGrad)" />
            </g>
          </g>

          <!-- LAYER 3: FOUR INTERACTIVE MULTI-LAYERED FLOWER COMPONENTS -->
          <g
            id="flower-node-delphinium"
            class="bouquet-flower-node"
            data-flower-id="delphinium"
            role="button"
            tabindex="0"
            aria-label="Blue Delphinium — Encouragement"
            aria-pressed="false"
          >
            <g class="sway-delphinium">
              <ellipse class="flower-focus-ring" cx="176" cy="144" rx="46" ry="96" transform="rotate(-11 176 144)" />
              <ellipse cx="156" cy="54" rx="4.5" ry="9" transform="rotate(-14 156 54)" fill="#9CBBD6" />
              <ellipse cx="148" cy="72" rx="5.5" ry="10" transform="rotate(-24 148 72)" fill="#A9C5DD" />
              <ellipse cx="168" cy="74" rx="5.5" ry="10" transform="rotate(10 168 74)" fill="#A9C5DD" />
              <use href="#delph-floret-unit" transform="translate(161, 94) rotate(-12) scale(0.76)" />
              <use href="#delph-floret-unit" transform="translate(148, 118) rotate(-22) scale(0.88)" />
              <use href="#delph-floret-unit" transform="translate(178, 120) rotate(12) scale(0.9)" />
              <use href="#delph-floret-unit" transform="translate(167, 144) rotate(-6) scale(0.98)" />
              <use href="#delph-floret-unit" transform="translate(152, 168) rotate(-18) scale(1.04)" />
              <use href="#delph-floret-unit" transform="translate(186, 168) rotate(15) scale(1.02)" />
              <use href="#delph-floret-unit" transform="translate(174, 194) rotate(-8) scale(1.08)" />
              <use href="#delph-floret-unit" transform="translate(192, 214) rotate(10) scale(1.0)" />
            </g>
          </g>

          <g
            id="flower-node-hydrangea"
            class="bouquet-flower-node is-selected"
            data-flower-id="hydrangea"
            role="button"
            tabindex="0"
            aria-label="Blue Hydrangea — Appreciation"
            aria-pressed="true"
          >
            <g class="sway-hydrangea">
              <circle class="flower-focus-ring" cx="182" cy="272" r="76" />
              <circle cx="182" cy="274" r="64" fill="#3C5976" opacity="0.42" />
              <use href="#hyd-floret-c" transform="translate(138, 240) rotate(-18) scale(1.12)" />
              <use href="#hyd-floret-c" transform="translate(222, 236) rotate(22) scale(1.1)" />
              <use href="#hyd-floret-c" transform="translate(134, 294) rotate(14) scale(1.12)" />
              <use href="#hyd-floret-c" transform="translate(224, 296) rotate(-20) scale(1.1)" />
              <use href="#hyd-floret-c" transform="translate(180, 218) rotate(8) scale(1.08)" />
              <use href="#hyd-floret-c" transform="translate(180, 322) rotate(-12) scale(1.08)" />
              <use href="#hyd-floret-b" transform="translate(156, 256) rotate(16) scale(1.18)" />
              <use href="#hyd-floret-b" transform="translate(206, 254) rotate(-14) scale(1.16)" />
              <use href="#hyd-floret-b" transform="translate(156, 294) rotate(-24) scale(1.16)" />
              <use href="#hyd-floret-b" transform="translate(206, 294) rotate(18) scale(1.15)" />
              <use href="#hyd-floret-b" transform="translate(182, 238) rotate(28) scale(1.14)" />
              <use href="#hyd-floret-a" transform="translate(182, 272) rotate(10) scale(1.26)" />
              <use href="#hyd-floret-a" transform="translate(150, 274) rotate(-10) scale(1.14)" />
              <use href="#hyd-floret-a" transform="translate(212, 274) rotate(25) scale(1.14)" />
              <use href="#hyd-floret-a" transform="translate(182, 302) rotate(-7) scale(1.12)" />
            </g>
          </g>

          <g
            id="flower-node-rose"
            class="bouquet-flower-node"
            data-flower-id="rose"
            role="button"
            tabindex="0"
            aria-label="White Garden Rose — Genuine affection"
            aria-pressed="false"
          >
            <g class="sway-rose">
              <circle class="flower-focus-ring" cx="278" cy="244" r="76" />
              <g transform="translate(318, 186) rotate(24) scale(0.56)">
                <path d="M0 -34 C24 -34, 38 -14, 32 12 C26 28, -26 28, -32 12 C-38 -14, -24 -34, 0 -34 Z" fill="url(#roseOuterPetal)" stroke="#CFC2AC" stroke-width="1" />
                <path d="M0 -22 C16 -22, 24 -8, 18 10 C12 20, -12 20, -18 10 C-24 -8, -16 -22, 0 -22 Z" fill="url(#roseMidPetal)" stroke="#C6B69B" stroke-width="1" />
                <ellipse cx="0" cy="-4" rx="10" ry="12" fill="url(#roseHeartPetal)" />
              </g>

              <g transform="translate(274, 248)">
                <g id="rose-petals-outer">
                  <path d="M0 -64 C32 -66, 60 -42, 54 -12 C48 10, 20 16, 0 12 C-20 16, -48 10, -54 -12 C-60 -42, -32 -66, 0 -64 Z" fill="url(#roseOuterPetal)" stroke="#D0C3AE" stroke-width="0.85" />
                  <path d="M64 -8 C72 24, 52 56, 22 56 C-2 56, -12 30, -8 6 C-16 -16, -10 -46, 12 -52 C40 -60, 58 -38, 64 -8 Z" fill="url(#roseOuterPetal)" stroke="#D0C3AE" stroke-width="0.85" />
                  <path d="M-64 -6 C-72 26, -52 58, -22 58 C2 58, 12 32, 8 8 C16 -14, 10 -44, -12 -50 C-40 -58, -58 -36, -64 -6 Z" fill="url(#roseOuterPetal)" stroke="#D0C3AE" stroke-width="0.85" />
                  <path d="M-42 56 C-16 74, 22 74, 46 54 C62 38, 48 12, 24 4 C8 -2, -8 -2, -24 4 C-48 12, -62 38, -42 56 Z" fill="url(#roseOuterPetal)" stroke="#D0C3AE" stroke-width="0.85" />
                </g>
                <g id="rose-petals-mid">
                  <path d="M0 -46 C24 -48, 44 -28, 36 -4 C30 14, 12 18, 0 16 C-12 18, -30 14, -36 -4 C-44 -28, -24 -48, 0 -46 Z" fill="url(#roseMidPetal)" stroke="#C7B79D" stroke-width="0.85" />
                  <path d="M46 6 C48 30, 28 48, 6 44 C-12 40, -14 20, -6 6 C-4 -12, 6 -26, 24 -26 C40 -26, 44 -12, 46 6 Z" fill="url(#roseMidPetal)" stroke="#C7B79D" stroke-width="0.85" />
                  <path d="M-46 8 C-48 32, -28 50, -6 46 C12 42, 14 22, 6 8 C4 -10, -6 -24, -24 -24 C-40 -24, -44 -10, -46 8 Z" fill="url(#roseMidPetal)" stroke="#C7B79D" stroke-width="0.85" />
                </g>
                <g id="rose-petals-inner">
                  <path d="M0 -28 C18 -28, 30 -14, 24 4 C18 18, 6 22, 0 20 C-6 22, -18 18, -24 4 C-30 -14, -18 -28, 0 -28 Z" fill="url(#roseHeartPetal)" stroke="#BDA477" stroke-width="0.85" />
                  <path d="M-16 6 C-14 22, 4 30, 18 20 C28 12, 22 -6, 8 -10 C-4 -14, -18 -8, -16 6 Z" fill="url(#roseHeartPetal)" stroke="#BDA477" stroke-width="0.85" />
                  <path d="M-8 -2 C-4 -10, 10 -8, 12 2 C14 10, 2 16, -6 10 C-11 6, -10 1, -8 -2 Z" fill="#E2CCA4" stroke="#BDA477" stroke-width="0.7" />
                </g>
              </g>
            </g>
          </g>

          <g
            id="flower-node-forgetmenot"
            class="bouquet-flower-node"
            data-flower-id="forgetmenot"
            role="button"
            tabindex="0"
            aria-label="Forget-Me-Not — Remembrance"
            aria-pressed="false"
          >
            <g class="sway-forgetmenot">
              <circle class="flower-focus-ring" cx="304" cy="332" r="64" />
              <path d="M268 386 C284 358, 304 332, 336 296" stroke="#7A8E7E" stroke-width="1.9" fill="none" stroke-linecap="round" />
              <path d="M292 354 C278 334, 272 316, 274 298" stroke="#899B8C" stroke-width="1.5" fill="none" stroke-linecap="round" />
              <path d="M306 336 C326 332, 344 334, 358 342" stroke="#899B8C" stroke-width="1.5" fill="none" stroke-linecap="round" />
              <path d="M286 364 C272 362, 264 352, 272 344 C280 338, 288 350, 286 364 Z" fill="#899B8C" />
              <path d="M316 324 C328 312, 342 312, 344 322 C346 332, 330 334, 316 324 Z" fill="#899B8C" />
              <use href="#fmn-blossom-unit" transform="translate(336, 296) rotate(14) scale(1.06)" />
              <use href="#fmn-blossom-unit" transform="translate(274, 298) rotate(-18) scale(1.0)" />
              <use href="#fmn-blossom-unit" transform="translate(308, 316) rotate(8) scale(1.04)" />
              <use href="#fmn-blossom-unit" transform="translate(358, 342) rotate(24) scale(0.95)" />
              <use href="#fmn-blossom-unit" transform="translate(284, 336) rotate(-12) scale(0.96)" />
              <use href="#fmn-blossom-unit" transform="translate(324, 354) rotate(-6) scale(0.98)" />
              <use href="#fmn-blossom-unit" transform="translate(256, 334) rotate(22) scale(0.88)" />
            </g>
          </g>

          <!-- LAYER 4: FRONT OVERLAPPING IVORY WRAPPING PAPER FLAPS -->
          <g id="wrap-front-fold">
            <path
              d="M116 292 L236 392 L238 534 L182 522 L116 292 Z"
              fill="url(#wrapFrontLeftGrad)"
              stroke="#CFC2AC"
              stroke-width="1"
            />
            <path
              d="M116 292 L236 392 L238 534 L182 522 L116 292 Z"
              fill="url(#ivoryPaperTex)"
              opacity="0.38"
            />
            <path
              d="M344 294 L214 394 L218 534 L276 522 L344 294 Z"
              fill="url(#wrapFrontRightGrad)"
              stroke="#C9BFA9"
              stroke-width="1"
            />
            <path
              d="M344 294 L214 394 L218 534 L276 522 L344 294 Z"
              fill="url(#ivoryPaperTex)"
              opacity="0.38"
            />
            <path
              d="M344 294 L214 394"
              stroke="#BDA477"
              stroke-width="0.9"
              opacity="0.55"
            />
          </g>

          <!-- LAYER 5: POWDER-BLUE SILK RIBBON BOW & FLOWING TAILS -->
          <g id="bouquet-ribbon">
            <path
              d="M198 386 Q230 398 262 386 L259 402 Q230 413 201 402 Z"
              fill="#9AB8D1"
              stroke="#7A9AB6"
              stroke-width="0.8"
            />
            <g class="sway-ribbon-tail">
              <path
                d="M224 398 C210 436, 188 476, 166 516 L183 509 L191 522 C209 482, 223 442, 231 402 Z"
                fill="url(#ribbonTailGrad)"
              />
              <path
                d="M224 398 C210 436, 188 476, 166 516 L183 509 L191 522 C209 482, 223 442, 231 402 Z"
                fill="url(#silkRibbonTex)"
                opacity="0.45"
              />
              <path
                d="M236 398 C252 438, 274 478, 298 518 L281 511 L273 524 C253 484, 239 444, 230 402 Z"
                fill="url(#ribbonTailGrad)"
              />
              <path
                d="M236 398 C252 438, 274 478, 298 518 L281 511 L273 524 C253 484, 239 444, 230 402 Z"
                fill="url(#silkRibbonTex)"
                opacity="0.45"
              />
            </g>
            <path
              d="M225 393 C196 358, 144 350, 136 376 C129 398, 174 408, 224 398 Z"
              fill="url(#ribbonLoopGrad)"
              stroke="#7E9EB9"
              stroke-width="0.8"
            />
            <path
              d="M220 393 C196 375, 162 372, 152 382"
              stroke="#E8F2FA"
              stroke-width="1.3"
              opacity="0.65"
              stroke-linecap="round"
            />
            <path
              d="M235 393 C264 358, 316 350, 324 376 C331 398, 286 408, 236 398 Z"
              fill="url(#ribbonLoopGrad)"
              stroke="#7E9EB9"
              stroke-width="0.8"
            />
            <path
              d="M240 393 C264 375, 298 372, 308 382"
              stroke="#E8F2FA"
              stroke-width="1.3"
              opacity="0.65"
              stroke-linecap="round"
            />
            <rect
              x="219"
              y="384"
              width="22"
              height="19"
              rx="7"
              fill="#B8D0E2"
              stroke="#7596B2"
              stroke-width="0.9"
            />
          </g>
        </svg>
      `;
    }

    bindEvents() {
      if (!this.mountEl) return;

      const nodes = this.mountEl.querySelectorAll('.bouquet-flower-node');
      nodes.forEach((node) => {
        const flowerId = node.getAttribute('data-flower-id');
        node.addEventListener('click', () => {
          this.selectFlower(flowerId, { fromBouquetClick: true });
        });
        node.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.selectFlower(flowerId, { fromBouquetClick: true });
          }
        });
      });

      const tabButtons = document.querySelectorAll('[data-flower-select]');
      tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const flowerId = btn.getAttribute('data-flower-select');
          this.selectFlower(flowerId, { fromBouquetClick: false });
        });
      });
    }

    setInteractive(enabled) {
      this.isInteractive = Boolean(enabled);
      if (!this.theaterEl) return;

      if (this.isInteractive) {
        this.theaterEl.classList.add('is-interactive', 'has-selection');
        this.theaterEl.removeAttribute('aria-hidden');
      } else {
        this.theaterEl.classList.remove('is-interactive', 'has-selection');
        this.theaterEl.setAttribute('aria-hidden', 'true');
      }
    }

    selectFlower(flowerId, options = {}) {
      const flower = FLOWERS[flowerId];
      if (!flower) return;

      this.selectedId = flowerId;
      this.exploredIds.add(flowerId);

      const nodes = this.mountEl.querySelectorAll('.bouquet-flower-node');
      nodes.forEach((node) => {
        const nodeId = node.getAttribute('data-flower-id');
        const isMatch = nodeId === flowerId;
        node.classList.toggle('is-selected', isMatch);
        node.classList.toggle('is-explored', this.exploredIds.has(nodeId));
        node.setAttribute('aria-pressed', String(isMatch));
      });

      const tabs = document.querySelectorAll('[data-flower-select]');
      tabs.forEach((tab) => {
        const tabId = tab.getAttribute('data-flower-select');
        const isMatch = tabId === flowerId;
        tab.classList.toggle('is-selected', isMatch);
        tab.classList.toggle('is-explored', this.exploredIds.has(tabId));
        tab.setAttribute('aria-selected', String(isMatch));
      });

      this.updateDetailCard(flowerId, { announce: true });

      if (typeof this.onFlowerSelect === 'function') {
        this.onFlowerSelect(flower, options);
      }
    }

    updateDetailCard(flowerId, { announce = false } = {}) {
      const flower = FLOWERS[flowerId];
      if (!flower) return;

      const meaningEl = document.getElementById('flower-meaning-label');
      const titleEl = document.getElementById('flower-title');
      const messageEl = document.getElementById('flower-message');
      const countEl = document.getElementById('flower-discovery-count');
      const toLetterBtn = document.getElementById('btn-to-letter');

      if (meaningEl) meaningEl.textContent = flower.meaning;
      if (titleEl) titleEl.textContent = flower.name;
      if (messageEl) messageEl.textContent = flower.message;
      if (countEl) {
        countEl.textContent = `${this.exploredIds.size} of 4 blooms explored`;
      }

      if (toLetterBtn) {
        const remaining = Math.max(0, 4 - this.exploredIds.size);
        if (remaining > 0) {
          toLetterBtn.disabled = true;
          toLetterBtn.textContent = `Explore all 4 blooms first (${remaining} left)`;
        } else {
          toLetterBtn.disabled = false;
          toLetterBtn.textContent = 'Open the letter';
        }
      }

      if (announce && typeof this.onAnnounce === 'function') {
        this.onAnnounce(`${flower.name}: ${flower.meaning}. ${flower.message}`);
      }
    }
  }

  global.BouquetComponent = BouquetComponent;
})(window);
