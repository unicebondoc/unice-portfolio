/**
 * Shared mutable object — written from inside the R3F Canvas
 * (PanelPositioner) and read by FocusPanel (outside Canvas).
 *
 * Using a plain object instead of React.createRef so that it can be
 * imported by both sides without creating a React dependency cycle.
 */
export const panelDomRef = { current: null }
