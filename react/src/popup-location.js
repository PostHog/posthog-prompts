import { findRelativeElement } from "./Popup";

export function generateLocationCSS(location, cssSelector) {
  if (location.startsWith("relative-")) {
    const relativeLocation = location.split("-")[1];
    const relativeElement = findRelativeElement(cssSelector);
    const relativeElementRect = relativeElement.getBoundingClientRect();
    if (relativeLocation === "top") {
      return {
        position: "absolute",
        top: relativeElementRect.top - 10,
        left: relativeElementRect.left + relativeElementRect.width / 2,
        transform: "translate(-50%, -100%)",
      };
    } else if (relativeLocation === "bottom") {
      return {
        position: "absolute",
        top: relativeElementRect.bottom + 10,
        left: relativeElementRect.left + relativeElementRect.width / 2,
        transform: "translateX(-50%)",
      };
    } else if (relativeLocation === "left") {
      return {
        position: "absolute",
        top: relativeElementRect.top + relativeElementRect.height / 2,
        left: relativeElementRect.left - 10,
        transform: "translate(-100%, -50%)",
      };
    } else if (relativeLocation === "right") {
      return {
        position: "absolute",
        top: relativeElementRect.top + relativeElementRect.height / 2,
        left: relativeElementRect.right + 10,
        transform: "translateY(-50%)",
      };
    } else {
      throw new Error(`Unknown relative location: ${relativeLocation}`);
    }
  } else if (location === "absolute-center") {
    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  } else if (location === "absolute-bottom-right") {
    return {
      position: "absolute",
      bottom: "10px",
      right: "10px",
    };
  } else if (location === "absolute-bottom-left") {
    return {
      position: "absolute",
      bottom: "10px",
      left: "10px",
    };
  } else if (location === "absolute-top-right") {
    return {
      position: "absolute",
      top: "10px",
      right: "10px",
    };
  } else if (location === "absolute-top-left") {
    return {
      position: "absolute",
      top: "10px",
      left: "10px",
    };
  } else {
    throw new Error(`Unknown location: ${location}`);
  }
}
export function generateTooltipPointerStyle(location) {
  if (location.startsWith("relative-")) {
    const relativeLocation = location.split("-")[1];
    if (relativeLocation === "top") {
      return {
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderTop: "10px solid white",
      };
    } else if (relativeLocation === "bottom") {
      return {
        position: "absolute",
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderBottom: "10px solid white",
      };
    } else if (relativeLocation === "left") {
      return {
        position: "absolute",
        top: "50%",
        left: "100%",
        transform: "translateY(-50%)",
        borderTop: "10px solid transparent",
        borderBottom: "10px solid transparent",
        borderLeft: "10px solid white",
      };
    } else if (relativeLocation === "right") {
      return {
        position: "absolute",
        top: "50%",
        right: "100%",
        transform: "translateY(-50%)",
        borderTop: "10px solid transparent",
        borderBottom: "10px solid transparent",
        borderRight: "10px solid white",
      };
    } else {
      throw new Error(`Unknown relative location: ${relativeLocation}`);
    }
  }
}
