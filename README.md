<div align="center">
  <a href="[https://hono.dev](https://pierre-cm.github.io/prompteur-website)">
    <img src="https://pierre-cm.github.io/prompteur-website/prompteur.svg" width="256" height="auto" alt="Prompteur"/>
  </a>
</div>

# Prompteur

[![Version](https://img.shields.io/npm/v/prompteur.svg)](https://www.npmjs.com/package/prompteur)

A sleek library for easily animating text on your HTML pages, bringing dynamic and engaging content to life with minimal effort.

If you want more info you can:

- See some [Examples](https://pierre-cm.github.io/prompteur/examples).
- Or even [Try it](https://pierre-cm.github.io/prompteur/try)!

## Installation

### <img src="https://raw.githubusercontent.com/npm/logos/master/npm%20square/n.svg" width="20px"> npm

```bash
npm i prompteur
# or
npm i github:pierre-cm/prompteur
```

### <img src="https://bun.sh/logo.svg" width="24px"> bun

```bash
bun add prompteur
# or
bun add github:pierre-cm/prompteur
```

## Usage

### Import

#### ESM

```javascript
import { Prompteur } from "prompteur"
```

#### CommonJS

```javascript
const { Prompteur } = require("prompteur")
```

### Instanciate

```javascript
const prompteur = new Prompteur({
  elt: document.getElementById("elementId"),
  text: "Hello Mom!",
  speed: 3,
  loop: true,
  render: "default",
})

prompteur.start()
```

## Documentation

### elt

The [DOM Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) that will contain the animated text.

### text

The text to animate.

> [!WARNING]  
> The text injected via innerHTML is not sanitized. If your text is somehow user defined, it is strongly recommended to use a HTML sanitizer (like [dompurify](https://www.npmjs.com/package/dompurify)) before defining the text attribute.

### speed

The speed at wich the animation should run. This speed is defined in characters per second. The default speed is defined at `10` characters per second.

### loop

Whether the animation should loop. It is defined as `false` by default.

### render

The function used to generated the animated text. You can use a predefined Generators name string `default`,`reverse`,`line` or `html`.

```javascript
const prompteur = new Prompteur({
  elt: document.getElementById("elementId"),
  text: 'Ipsum Lorem <span style="color:red">dolor</span> sit amet',
  speed: 4,
  render: "html",
})
```

You can also define a custom render function. The fucntion takes two argument:

- **f** A factor representing the current animation progress. Its value goes from 0 to 1.
- **opt.text** The text value defined in your Prompteur instanciation.
- **opt.steps** How many steps will compose your animation in total. It means, how many time will the render function be called.

The render function should return the animated text.

Here is the example of the implementations of the `line` render, as matter of example.

```javascript
const prompteur = new Prompteur({
  elt: document.getElementById("elementId"),
  text: "Line1\nLine2\nLine3\nLine4",
  speed: 12,
  render: (f, opt) => {
    const { text } = opt
    const lines = text.split("\n")
    const n = f / (1 / lines.length)
    return lines.slice(0, n).join("\n")
  },
})
```

You can always retrieve predefined renderers functions by importing 'renderers' from prompteur package.

```javascript
import { Prompteur, renderers } from "prompteur"

const prompteur = new Prompteur({
  elt: document.getElementById("elementId"),
  text: 'Ipsum Lorem <span style="color:red">dolor</span> sit amet',
  speed: 4,
  render: (f, opt) => {
    return `<pre>${renderers.html(f, opt)}</pre>`
  },
})
```

### Methods

Once instanciated, you can `start`, `pause` or `stop` the animation at any time by using prompteur's method of the same name. You can check a prompteur state at any time by checking its state attribute. The state attribute could be `running`, `paused` or `stopped`.

```javascript
import { Prompteur } from "prompteur"

const prompteur = new Prompteur({
  elt: document.getElementById("elementId"),
  text: "Hello Mom!",
  speed: 2,
})

prompteur.start()

setTimeout(() => {
  prompteur.pause()
  console.log(prompteur.state) // paused
}, 2500)
```
