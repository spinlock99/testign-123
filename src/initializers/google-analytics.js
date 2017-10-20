export function googleAnalytics() {
  window.ga = window.ga || ((...args) => (ga.q = ga.q || []).push(args))
  ga("create", "UA-98851522-2", "auto")
  ga("set", "transport", "beacon")
  ga("send", "pageview")
}
