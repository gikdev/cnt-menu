var CNTMenu = class {
  config = { items: [] }
  cm = document.createElement("UL")

  constructor(config) {
    this.config = config
  }

  loadHTML() {
    this.cm.classList.add("cntm-context")
    if (this.config.RTL) this.cm.classList.add("RTL")
    if (this.config.dark) this.cm.classList.add("dark")
    // Generate items of `config` and append it to the context menu
    this.config.items.forEach(item => {
      this.cm.append(this.generateItem(item))
    })
    document.body.append(this.cm)
  }
  generateItem(item) {
    let element
    if (!item.isLine) {
      element = document.createElement("li")
      element.textContent = item.label
      element.classList.add("cntm-item")
      element.addEventListener("click", item.cb)
    } else element = document.createElement("hr")
    return element
  }
  updateMenuPosition(x, y) {
    const maxLeftValue = window.innerWidth - this.cm.offsetWidth
    const maxTopValue = window.innerHeight - this.cm.offsetHeight
    this.cm.style.left = `${Math.min(maxLeftValue, x)}px`
    this.cm.style.top = `${Math.min(maxTopValue, y)}px`
  }
  setEventListeners() {
    document.addEventListener("click", () => this.cm.classList.remove("active"))
    const targetQuery = this.config.target ?? "html"
    const target = document.querySelector(targetQuery)
    const event = this.config.event ?? "contextmenu"
    target.addEventListener(event, e => {
      e.preventDefault()
      this.updateMenuPosition(e.clientX, e.clientY)
      this.cm.classList.add("active")
    })
  }
  run() {
    this.loadHTML()
    this.setEventListeners()
    return this
  }
}
