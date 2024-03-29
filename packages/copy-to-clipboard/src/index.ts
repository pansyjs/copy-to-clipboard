import deselectCurrent from '@pansy/toggle-selection'

const clipboardToIE11Formatting = {
  "text/plain": "Text",
  "text/html": "Url",
  "default": "Text"
}

export interface Options {
  debug?: boolean;
  message?: string;
  format?: string; // MIME type
  onCopy?: (clipboardData: object) => void;
}

const defaultMessage = "Copy to clipboard: #{key}, Enter";

function format(message: string) {
  const copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return message.replace(/#{\s*key\s*}/g, copyKey);
}

function copy(text: string, options: Options) {
  let debug: boolean,
    message,
    reselectPrevious,
    range,
    selection,
    mark,
    success = false;

  if (!options) {
    options = {};
  }
  debug = options.debug || false;

  try {
    reselectPrevious = deselectCurrent();

    range = document.createRange();
    selection = document.getSelection();

    mark = document.createElement("span");
    mark.textContent = text;
    mark.ariaHidden = "true"
    mark.style.all = "unset";
    mark.style.position = "fixed";
    mark.style.top = "0px";
    mark.style.clip = "rect(0, 0, 0, 0)";

    mark.style.whiteSpace = "pre";

    mark.style.webkitUserSelect = "text";
    // @ts-expect-error moz
    mark.style.MozUserSelect = "text";
     // @ts-expect-error ms
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";

    mark.addEventListener("copy", function(e) {
      e.stopPropagation();

      if (options.format) {
        e.preventDefault();

        if (typeof e.clipboardData === "undefined") {
          debug && console.warn("unable to use e.clipboardData");
          debug && console.warn("trying IE specific stuff");
          (window as any).clipboardData.clearData();

          // @ts-expect-error IE
          const format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"]
          // @ts-expect-error IE
          (window as any).clipboardData.setData(format, text);
        } else {
          e?.clipboardData?.clearData();
          e?.clipboardData?.setData(options.format, text);
        }
      }

      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData!);
      }
    })

    document.body.appendChild(mark);

    range.selectNodeContents(mark);
    selection!.addRange(range);

    let successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }
    success = true;
  } catch (error) {
    debug && console.error("unable to copy using execCommand: ", error);
    debug && console.warn("trying IE specific stuff");

    try {
      (window as any).clipboardData.setData(options.format || "text", text);
      options.onCopy && options.onCopy((window as any).clipboardData);
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using clipboardData: ", err);
      debug && console.error("falling back to prompt");
      message = format(("message" in options ? options.message : defaultMessage)!);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == "function") {
        selection.removeRange(range!);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }
    reselectPrevious?.();
  }

  return success;
}

export default copy;
