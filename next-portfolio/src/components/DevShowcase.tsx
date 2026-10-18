"use client";

import { useRef, useState } from "react";

const INITIAL_CODE = `<style>
body { margin: 0; padding: 40px; background: #101321; font: 20px Arial; }
h1 { color: #69d391; }
p { color: #8ab4ff; }
button { padding: 10px 16px; color: white; background: #ef6472; border: 0; border-radius: 8px; }
</style>
<h1>Hello, Rajeev!</h1>
<p>I'm a web developer.</p>
<button>Explore my work</button>`;

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function token(className: string, text: string) {
  return `<span class="dev-token-${className}">${escapeHtml(text)}</span>`;
}

function highlightTag(tag: string) {
  const match = tag.match(/^(<\/?)([\w:-]+)([\s\S]*?)(\/?>)$/);
  if (!match) return token("tag", tag);

  let output = token("tag", match[1] + match[2]);
  const rest = match[3];
  const attributes = /(\s+)([^\s=/>]+)(\s*=\s*("(?:\\.|[^"])*"|'(?:\\.|[^'])*'|[^\s/>]+))?/g;
  let lastIndex = 0;
  let attribute: RegExpExecArray | null;

  while ((attribute = attributes.exec(rest))) {
    output += escapeHtml(rest.slice(lastIndex, attribute.index));
    output += escapeHtml(attribute[1]) + token("attribute", attribute[2]);
    if (attribute[3]) {
      const valueStart = attribute[3].lastIndexOf(attribute[4]);
      output += escapeHtml(attribute[3].slice(0, valueStart)) + token("string", attribute[4]);
    }
    lastIndex = attributes.lastIndex;
  }
  output += escapeHtml(rest.slice(lastIndex)) + token("tag", match[4]);
  return output;
}

function highlight(source: string) {
  const pattern =
    /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|<\/?[A-Za-z][^>]*>|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[\da-fA-F]{3,8}\b|\b[\w-]+\b|\s+|./g;
  const keywords =
    /\b(?:const|let|var|function|return|if|else|for|while|new|class|true|false|null|undefined|async|await)\b/;
  let output = "";
  let styleMode = false;
  let scriptMode = false;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source))) {
    const part = match[0];
    const next = source.slice(pattern.lastIndex).match(/^\s*/)?.[0].length || 0;
    const following = source.charAt(pattern.lastIndex + next);

    if (part.indexOf("<!--") === 0 || part.indexOf("/*") === 0 || (scriptMode && part.indexOf("//") === 0)) {
      output += token("comment", part);
    } else if (part.charAt(0) === "<" && /^<\/?[A-Za-z]/.test(part)) {
      output += highlightTag(part);
      if (/^<style\b/i.test(part)) styleMode = true;
      if (/^<\/style\b/i.test(part)) styleMode = false;
      if (/^<script\b/i.test(part)) scriptMode = true;
      if (/^<\/script\b/i.test(part)) scriptMode = false;
    } else if (/^["']/.test(part)) {
      output += token("string", part);
    } else if (styleMode && /^#[\da-f]/i.test(part)) {
      output += token("value", part);
    } else if (/^[\w-]+$/.test(part) && styleMode) {
      output +=
        following === "{"
          ? token("selector", part)
          : following === ":"
          ? token("property", part)
          : token("value", part);
    } else if (/^[\w-]+$/.test(part) && scriptMode && keywords.test(part)) {
      output += token("keyword", part);
    } else if (/^\s+$/.test(part)) {
      output += part;
    } else if (/^\d/.test(part) && styleMode) {
      output += token("value", part);
    } else {
      output += escapeHtml(part);
    }
  }
  return output || " ";
}

export default function DevShowcase() {
  const [code, setCode] = useState(INITIAL_CODE);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLPreElement | null>(null);
  const highlightRef = useRef<HTMLPreElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) =>
    i + 1 < 10 ? `0${i + 1}` : `${i + 1}`
  ).join("\n");

  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = scrollTop;
    if (highlightRef.current) {
      highlightRef.current.style.transform = `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <section className="dev-showcase stage" aria-labelledby="dev-showcase-title">
      <div className="wrap">
        <div className="dev-showcase-head reveal in">
          <span className="dev-kicker">
            DESIGN <span aria-hidden="true">/</span> DEVELOP <span aria-hidden="true">/</span> DEPLOY
          </span>
          <h2 className="section-title" id="dev-showcase-title">
            Turning ideas into <span className="thin">digital experiences</span>
          </h2>
          <p className="section-sub">
            A little look at how I bring thoughtful design and frontend code together.
          </p>
        </div>

        <div className="dev-workspace reveal in">
          <div className="dev-window-bar">
            <div className="dev-window-brand">
              <span className="dev-window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="dev-window-title">
                Visual Studio Code <span aria-hidden="true">·</span>
              </span>
              <span>
                rajeev.dev <span aria-hidden="true">/</span> portfolio
              </span>
            </div>
            <span className="dev-window-status">HTML · Live preview</span>
          </div>

          <div className="dev-workspace-grid">
            <div className="dev-editor">
              <div className="dev-activity-bar" aria-hidden="true">
                <span>◫</span>
                <span>⌕</span>
                <span>⑂</span>
                <span>◉</span>
              </div>
              <aside className="dev-explorer" aria-label="Project files">
                <p className="dev-explorer-title">EXPLORER</p>
                <p className="dev-explorer-folder">⌄ &nbsp; PORTFOLIO</p>
                <div className="dev-explorer-file">
                  <span>⚛</span> App.tsx
                </div>
              </aside>
              <div className="dev-code-panel">
                <label className="dev-editor-tab" htmlFor="devCodeInput">
                  <span aria-hidden="true">⚛</span> App.tsx
                </label>
                <div className="dev-editor-input">
                  <pre ref={lineNumbersRef} className="dev-line-numbers" id="devLineNumbers" aria-hidden="true">
                    {lineNumbers}
                  </pre>
                  <div className="dev-code-viewport">
                    <pre
                      ref={highlightRef}
                      className="dev-code-highlight"
                      id="devCodeHighlight"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: highlight(code) }}
                    />
                    <textarea
                      ref={textareaRef}
                      className="dev-code-input"
                      id="devCodeInput"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onScroll={handleScroll}
                      onKeyDown={handleKeyDown}
                      aria-label="Editable HTML, CSS and JavaScript code"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      wrap="off"
                    />
                  </div>
                </div>
                <p className="dev-editor-hint">
                  Edit the starter code — your preview updates as you type.
                </p>
              </div>
            </div>

            <div className="dev-preview">
              <div className="dev-browser-bar" aria-hidden="true">
                <span className="dev-browser-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="dev-browser-url">Live preview</span>
              </div>
              <iframe
                ref={iframeRef}
                className="dev-live-frame"
                id="devLiveFrame"
                title="Live preview of the code editor"
                srcDoc={code}
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="dev-statusbar" aria-hidden="true">
            <span>◇&nbsp; HTML &nbsp;●&nbsp; Live</span>
            <span>Ln 1, Col 1 &nbsp; UTF-8 &nbsp; Spaces: 2</span>
          </div>
        </div>
      </div>
    </section>
  );
}
