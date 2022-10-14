![](https://user-images.githubusercontent.com/2104054/195824317-386bfa03-986b-4290-a091-dc003d9a30e2.png)

[![storybook](https://img.shields.io/badge/storybook-000?style=flat-square)][storybook] [![npm](https://img.shields.io/npm/v/web-platform-alpha.svg?style=flat-square&labelColor=111)][npm]

⚠️⚠️ At the moment, the project is under active development and has been subjected to major changes. ⚠️⚠️

## Motivation

Quickly develop accessible interfaces with the same behaviour across all environments.

## Installation

Currently package has development name `web-platform-alpha` and it will change in the future.

```sh
npm i -PE web-platform-alpha
```

## Usage

All hooks are available from the root public API. You can find more examples in the [storybook][storybook].

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

## Terminology

### Semantic

Semantic hooks implement behavior of component and set aria-attributes to ensure accessibility.

### State

State hooks contain local state of components and allow you to use components in different contexts (e.g. SingleCalendar, RangeCalendar).

### Interactions

Interactive hooks are used to ensure correct interaction with interface in any environment (e.g. web, touch, tv).

## Roadmap

Approximate work plan (may be adjusted) Q3-Q4:

- [x] interactions
  - [x] [useHover](./src/interactions/hover/useHover.ts)
  - [x] [usePress](./src/interactions/press/usePress.ts)
  - [x] [useFocusable](./src/interactions/focusable/useFocusable.ts)
- [ ] utils
  - [x] [i18n locale](./src/libs/i18n/useLocale.ts)
  - [x] [useUniqId](./src/libs/uniq-id/useUniqId.ts)
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
- [x] datefield
  - [x] [useSpinButton](./src/semantic/spinbutton/useSpinButton.ts)
  - [x] [useDateTimeField](./src/semantic/datetimefield/useDateTimeField.ts)
- [x] textfield
  - [x] [useTextField](./src/semantic/textfield/useTextField.ts)
  - [x] [usePasswordField](./src/semantic/textfield/usePasswordField.ts)
  - [x] [useAutoResize](./src/semantic/textfield/useAutoResize.ts)
  - [x] [useClearButton](./src/semantic/textfield/useClearButton.ts)
- [x] [useFocusTrap](./src/libs/focus-trap/useFocusTrap.ts)
- [x] [useLabel](./src/semantic/label/useLabel.ts)
- [x] [useRadio](./src/semantic/radio/useRadio.ts)
- [ ] useSlider
- [ ] useSelect
- [ ] useComboBox
- [ ] useListBox
- [ ] useOverlay
- [ ] usePopup
- [ ] useModal
- [ ] usePortal

[npm]: https://www.npmjs.com/package/web-platform-alpha
[storybook]: https://web-platform.netlify.app

## License

This project is developed under [MPL-2.0](./LICENSE) license.
