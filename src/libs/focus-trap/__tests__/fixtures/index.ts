export const basicFixture = `
  <input data-testid="input" type="text" />
  <input data-testid="input-readonly" readonly />
  <input data-testid="input-disabled" type="text" disabled />
  <input data-testid="input-hidden" type="hidden" />

  <textarea data-testid="textarea"></textarea>
  <textarea data-testid="textarea-readonly" readyonly></textarea>
  <textarea data-testid="textarea-display-none" style="display:none;"></textarea>

  <select data-testid="select"><option value="foo">foo</option></select>
  <select data-testid="select-readonly" readyonly><option value="foo">foo</option></select>
  <select data-testid="select-negative-tabindex" tabindex="-1"><option value="foo">foo</option></select>

  <a data-testid="link">foo</a>
  <a data-testid="link-tabindex" tabindex="1">foo</a>
  <a data-testid="link-anchor" href="#">foo</a>

  <button data-testid="button">foo</button>
  <button data-testid="button-visibility-hidden" style="visibility:hidden;">foo</button>

  <audio data-testid="audio-control" controls></audio>
  <audio data-testid="audio-no-control"></audio>

  <video data-testid="video-control" controls></video>
  <video data-testid="video-no-control"></video>

  <div data-testid="div">foo</div>
  <div data-testid="div-tabindex" tabindex="0">foo</div>
  <div data-testid="div-contenteditable-true" contenteditable="true">editable text</div>
  <div data-testid="div-contenteditable-false" contenteditable="false">not editable text</div>
  <div data-testid="div-contenteditable-nesting" contenteditable>
    <div>
      <div>
        editable text
      </div>
    </div>
  </div>

  <div style="visibility:hidden;">
    <button data-testid="button-visible-parent-hidden" style="visibility:visible;">bar</button>
  </div>
`
