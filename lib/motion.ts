/**
 * Motion settings shared by the server layout and client components.
 *
 * GSAP is opt-in: set NEXT_PUBLIC_ENABLE_GSAP=true to load it (lazily, only
 * when results render). With it off, result cards use a CSS animation and the
 * gsap chunk is never downloaded.
 */
export const GSAP_ENABLED = process.env.NEXT_PUBLIC_ENABLE_GSAP === "true";

export type MotionMode = "gsap" | "css" | "reduced";

/** Fired on window when the intro curtain has lifted (or was skipped). */
export const INTRO_DONE_EVENT = "scholarscope:intro-done";

const INTRO_MS = 2500; // matches the CSS timeline in globals.css
const INTRO_SKIP_MS = 450;

/**
 * Runs in <head> before first paint:
 *  - data-motion: "gsap" | "css" | "reduced" picks the result-card reveal.
 *  - data-intro:  "play" shows the intro overlay. It plays once per browser
 *    session, only on the landing page (a shared /?q= link goes straight to
 *    results), and never for reduced motion. Click, tap or any key skips it.
 * Without JavaScript neither attribute is set and nothing is hidden.
 */
export const motionBootScript = `(function(){try{
var d=document.documentElement,w=window;
var reduced=w.matchMedia("(prefers-reduced-motion: reduce)").matches;
d.dataset.motion=reduced?"reduced":${JSON.stringify(GSAP_ENABLED ? "gsap" : "css")};
var seen=false;try{seen=sessionStorage.getItem("ss-intro")==="1";sessionStorage.setItem("ss-intro","1");}catch(e){}
var onLanding=location.pathname==="/"&&!new URLSearchParams(location.search).get("q");
if(reduced||seen||!onLanding){d.dataset.intro="done";return;}
d.dataset.intro="play";
var finished=false;
function done(){if(finished)return;finished=true;d.dataset.intro="done";w.dispatchEvent(new Event(${JSON.stringify(INTRO_DONE_EVENT)}));
w.removeEventListener("pointerdown",skip);w.removeEventListener("keydown",skip);}
function skip(){if(d.dataset.intro!=="play")return;d.dataset.intro="leaving";setTimeout(done,${INTRO_SKIP_MS});}
w.addEventListener("pointerdown",skip);w.addEventListener("keydown",skip);
setTimeout(done,${INTRO_MS});
}catch(e){document.documentElement.dataset.intro="done";}})();`;

export function getMotionMode(): MotionMode {
  if (typeof document === "undefined") return "css";
  const mode = document.documentElement.dataset.motion;
  return mode === "gsap" || mode === "reduced" ? mode : "css";
}
