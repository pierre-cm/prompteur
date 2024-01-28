export type BaseRenderer = keyof typeof renderers
export type PrompteurConfig = {
  elt: Element
  text: string
  speed?: number
  loop?: boolean
  render?: BaseRenderer | RendererFunction
}
export type RendererFunction = (factor: number, p: Prompteur) => string

export const renderers = {
  default: (f: number, p: Prompteur) => {
    const { text } = p
    return text.slice(0, f * (text.length + 1))
  },
  reverse: (f: number, p: Prompteur) => {
    const { text } = p
    return text.slice(0, (1 - f) * (text.length + 1))
  },
  html: (f: number, p: Prompteur) => {
    const { text } = p
    let tag = false
    let entity = false
    let L = 0
    let n: number[] = []
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "<") tag = true
      else if (text[i] === "&") {
        let b = i
        while (b < text.length) {
          if ([" ", "\n", "\t", "\r"].includes(text[b])) break
          else if (text[b] === ";") {
            entity = true
            break
          } else b++
        }
      }
      if (!tag && !entity) {
        L++
        n.push(i)
      }
      if (text[i] === ">") tag = false
      if (entity && text[i] === ";") entity = false
    }
    const F = Math.ceil(f * L)
    return text.slice(0, n[F])
  },
  line: (f: number, p: Prompteur) => {
    const { text } = p
    const lines = text.split("\n")
    const n = f / (1 / lines.length)
    return lines.slice(0, n + 1).join("\n")
  },
} as const

export class Prompteur {
  elt: Element
  text: string
  #speed: number
  currentPrompt: string
  loop: boolean
  render: BaseRenderer | RendererFunction
  #factor: number
  #state: "stopped" | "running" | "paused"
  #interval?: number | NodeJS.Timer
  #refreshRate: number
  constructor(config: PrompteurConfig) {
    this.elt = config?.elt || null
    this.text = config?.text || ""
    this.#speed = config?.speed || 10
    this.loop = config?.loop ?? false
    this.render = config?.render || "default"
    this.currentPrompt = ""
    this.#state = "stopped"
    this.#factor = 0
    this.#refreshRate = Math.max(25, 1000 / this.speed)
  }

  start() {
    if (this.#state === "stopped") this.#factor = 0
    clearInterval(this.#interval)
    this.#state = "running"
    this.#interval = setInterval(() => {
      if (this.state !== "running") return
      this.#nextFactor()
      this.#computePrompt()
      if (this.elt) this.elt.innerHTML = this.currentPrompt
    }, this.#refreshRate)
  }
  stop() {
    clearInterval(this.#interval)
    this.#state = "stopped"
    this.currentPrompt = ""
  }
  pause() {
    clearInterval(this.#interval)
    this.#state = "paused"
  }
  #nextFactor() {
    let step = (this.speed * this.#refreshRate) / (this.text.length * 1000)
    if (this.#factor + step > 1) {
      if (this.loop) {
        this.#factor = 0
      } else {
        this.#factor = 1
        this.stop()
      }
    } else this.#factor += step
  }
  #computePrompt() {
    const f = this.#factor
    if (typeof this.render === "string") {
      if (this.render in renderers) {
        this.currentPrompt = renderers[this.render](f, this)
      } else {
        this.currentPrompt = renderers.default(f, this)
      }
    } else {
      this.currentPrompt = this.render(f, this)
    }
  }

  get speed() {
    return this.#speed
  }
  get state() {
    return this.#state
  }
  get factor() {
    return this.#factor
  }

  set speed(s: number) {
    this.#speed = s
    this.#refreshRate = Math.max(25, 1000 / this.#speed)
  }
}
