type Events = "click" | "contextmenu" | "dblclick"
interface Item {
  label: string
  cb: () => void
  isLine: boolean
}
interface Config {
  RTL?: boolean
  dark?: boolean
  target?: string
  event?: Events
  items: Item[]
}

class CNTMenu {
  private config: Config = { items: [] }
  private cm: HTMLElement = document.createElement("UL")

  constructor(config: Config) {
    this.config = config
  }

  private loadHTML(): void {
    this.cm.classList.add("cntm-context")
    if (this.config.RTL) this.cm.classList.add("RTL")
    if (this.config.dark) this.cm.classList.add("dark")
    // Generate items of `config` and append it to the context menu
    this.config.items.forEach(item => {
      this.cm.append(this.generateItem(item))
    })
    document.body.append(this.cm)
  }
  private generateItem(item: Item): HTMLElement {
    let element: HTMLElement
    if (!item.isLine) {
      element = document.createElement("li")
      element.textContent = item.label
      element.classList.add("cntm-item")
      element.addEventListener("click", item.cb)
    } else element = document.createElement("hr")
    return element
  }
  private updateMenuPosition(x: number, y: number): void {
    const maxLeftValue = window.innerWidth - this.cm.offsetWidth
    const maxTopValue = window.innerHeight - this.cm.offsetHeight
    this.cm.style.left = `${Math.min(maxLeftValue, x)}px`
    this.cm.style.top = `${Math.min(maxTopValue, y)}px`
  }
  private setEventListeners(): void {
    document.addEventListener("click", () => this.cm.classList.remove("active"))
    const targetQuery = this.config.target ?? "html"
    const target = document.querySelector(targetQuery)!
    const event: Events = this.config.event ?? "contextmenu"
    target.addEventListener(event, e => {
      e.preventDefault()
      // @ts-ignore
      this.updateMenuPosition(e.clientX, e.clientY)
      this.cm.classList.add("active")
    })
  }
  public run(): this {
    this.loadHTML()
    this.setEventListeners()
    return this
  }
}