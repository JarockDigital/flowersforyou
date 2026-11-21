# A Little Something for You — Interactive Digital Floral Gift

A cinematic, editorial digital floral experience crafted with semantic HTML5, modular CSS3, vanilla JavaScript, multi-layered botanical SVGs, tactile paper/silk textures, and GSAP choreography.

## Project Structure

```text
floral-gift/
├── index.html
├── netlify.toml
├── README.md
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── main.css
│   ├── bouquet.css
│   ├── letter.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── scenes.js
│   ├── bouquet.js
│   ├── letter.js
│   └── animations.js
└── assets/
    ├── flowers/
    │   ├── blue-hydrangea.svg
    │   ├── white-garden-rose.svg
    │   ├── forget-me-not.svg
    │   ├── blue-delphinium.svg
    │   └── single-sprig.svg
    ├── botanical/
    │   ├── eucalyptus-branch.svg
    │   ├── ruscus-foliage.svg
    │   ├── wax-seal.svg
    │   └── silk-ribbon.svg
    ├── textures/
    │   ├── paper-grain.png
    │   ├── silk-weave.png
    │   └── midnight-grain.png
    └── fonts/
        ├── EditorialSerif-Regular.otf
        ├── EditorialSerif-Italic.otf
        ├── EditorialSerif-Bold.otf
        ├── EditorialSans-Regular.ttf
        └── EditorialScript-Italic.otf
```

## Running Locally

Serve the `floral-gift/` folder using any static HTTP server:

```bash
cd floral-gift
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Deploying to Netlify

1. **Drag-and-Drop:** Open [Netlify Drop](https://app.netlify.com/drop) and drag the `floral-gift/` folder onto the deployment area.
2. **Git Repository:** Connect your repository in Netlify with **Build command** left empty and **Publish directory** set to `.` (`netlify.toml` is preconfigured).
