export default class Alert {
  constructor(path = "/json/alerts.json") {
    this.path = path;
  }

  async init() {
    const alerts = await this.loadAlerts();
    if (alerts && alerts.length > 0) this.renderAlerts(alerts);
  }

  async loadAlerts() {
    const response = await fetch(this.path);

    if (!response.ok) throw new Error("Failed to load alerts");

    return await response.json();
  }

  renderAlerts(alerts) {
    const section = document.createElement("section");
    section.classList.add("alerts");

    const alert = Math.floor(Math.random() * alerts.length);
    const p = document.createElement("p");
    p.textContent = alerts[alert].message;
    p.style.backgroundColor = alerts[alert].background;
    p.style.color = alerts[alert].color;
    section.appendChild(p);

    const main = document.querySelector("main");
    main.prepend(section);
  }
}
