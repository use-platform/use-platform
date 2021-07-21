![](https://user-images.githubusercontent.com/7934638/126305621-6a520c6c-8779-42ad-a3c9-74a8be93574f.png)

[![storybook](https://img.shields.io/badge/storybook-000?style=flat-square)][storybook] [![npm](https://img.shields.io/npm/v/web-platform-alpha.svg?style=flat-square&labelColor=111)][npm]

⚠️⚠️ At the moment, the project is under active development and has been subjected to major changes. ⚠️⚠️

## 💡 Motivation

Develop interfaces quickly with accessibility and the same work in all environments.

## ✈️ Installation

Currently package has development name `web-platform-alpha` and will change in the future.

```sh
npm i -PE web-platform-alpha
```

## ☄️ Usage

All hooks available from root public API. More examples you can find in [storybook](storybook).

```tsx
import { useRef } from 'react'
import { useButton } from 'web-platform-alpha'

export const Button = (props) => {
  const { children } = props
  const buttonRef = useRef(null)
  const { buttonProps } = useButton(props, buttonRef)

  return (
    <button {...buttonProps} ref={buttonRef}>
      {children}
    </button>
  )
}
```

## 📚 Terminology

### Semantic

Semantic hooks implements behavior of component and sets aria-attributes to ensure accessibility.

### State

State hooks contains the local state of the component and allow you to use component in different contexts (e.g. SingleCalendar, RangeCalendar).

### Interactions

Interactive hooks uses to ensure correct interaction with interface in any environment (e.g. web, touch, tv).

## 🚧 Roadmap

Approximate work plan (may be adjusted) Q3-Q4:

- [x] interactions
  - [x] [useHover](./src/interactions/hover/useHover.ts)
  - [x] [usePress](./src/interactions/press/usePress.ts)
  - [x] [useFocusable](./src/interactions/focusable/useFocusable.ts)
- [ ] utils
  - [x] i18n locale
  - [ ] useUniqId
- [ ] button
  - [x] [useButton](./src/semantic/button/useButton.ts)
  - [ ] useToggleButton
- [x] toggle
  - [x] [useToggle](./src/semantic/toggle/useToggle.ts)
  - [x] [useCheckbox](./src/semantic/checkbox/useCheckbox.ts)
  - [x] [useSwitch](./src/semantic/switch/useSwitch.ts)
- [x] calendar
  - [x] [useCalendar](./src/semantic/calendar/useSingleCalendarState.ts)
  - [x] [useRangeCalendar](./src/semantic/calendar/useRangeCalendarState.ts)
  - [x] [useMultipleCalendar](./src/semantic/calendar/useMultipleCalendarState.ts)
- [x] textfield
  - [x] [useTextField](./src/semantic/textfield/useTextField.ts)
  - [x] [usePasswordField](./src/semantic/textfield/usePasswordField.ts)
  - [x] [useAutoResize](./src/semantic/textfield/useAutoResize.ts)
  - [x] [useClearButton](./src/semantic/textfield/useClearButton.ts)
- [ ] useRadio
- [ ] useSlider
- [ ] useSelect
- [ ] useComboBox
- [ ] useMenu
- [ ] useOverlay
- [ ] useFocusLock
- [ ] usePopup
- [ ] useModal
- [ ] usePortal

[npm]: https://www.npmjs.com/package/web-platform-alpha
[storybook]: https://web-platform.netlify.app

## License

This project develop under [MPL-2.0](./LICENSE) license.
