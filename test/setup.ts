// Mock dla brakującego pełnego API canvas w środowisku testowym (jsdom/happy-dom)
// To pozwala uniknąć błędów przy inicjalizacji elementu <canvas> przez Fabric.js podczas mountingu komponentów.

import 'vitest-canvas-mock';
