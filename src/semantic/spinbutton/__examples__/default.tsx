import { UseButtonProps, mergeProps, useButton, useSpinButton } from '@yandex/web-platform'
import { focusElement } from '@yandex/web-platform/libs/dom-utils'
import { clamp } from '@yandex/web-platform/libs/utils'
import { FC, useCallback, useRef, useState } from 'react'

export const Default = (args: any) => {
  return <SpinButton {...args} />
}

Default.args = {
  textValue: '',
  min: -100,
  max: 100,
  step: 1,
  extraStep: 5,
  disabled: false,
  readOnly: false,
  required: false,
}

interface ExampleStateProps {
  min?: number
  max?: number
  step?: number
  extraStep?: number
}

function useExampleState(props: ExampleStateProps) {
  const { min = NaN, max = NaN, step = 1, extraStep = 5 } = props
  const [value, setValue] = useState<number>(0)

  const update = useCallback(
    (val: number, amount: number) => clamp(val + amount, min, max),
    [max, min],
  )

  return {
    value,
    setValue,
    onIncrement: useCallback(() => {
      setValue((v) => update(v, step))
    }, [step, update]),
    onDecrement: useCallback(() => {
      setValue((v) => update(v, -step))
    }, [step, update]),
    onExtraIncrement: useCallback(() => {
      setValue((v) => update(v, extraStep))
    }, [extraStep, update]),
    onExtraDecrement: useCallback(() => {
      setValue((v) => update(v, -extraStep))
    }, [extraStep, update]),
    onIncrementToMax: useCallback(() => {
      if (Number.isFinite(max)) {
        setValue(max)
      }
    }, [max]),
    onDecrementToMin: useCallback(() => {
      if (Number.isFinite(min)) {
        setValue(min)
      }
    }, [min]),
  }
}

const SpinButton: FC<any> = (props) => {
  const state = useExampleState(props)
  const inputRef = useRef<HTMLInputElement>(null)

  const { spinButtonProps, decrementButtonProps, incrementButtonProps } = useSpinButton({
    ...props,
    ...state,
  })

  const onPressStart = useCallback(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      focusElement(inputRef.current)
    }
  }, [])

  const stepButtonProps = {
    preventFocusOnPress: true,
    onPressStart,
  }

  return (
    <>
      <span role="group">
        <StepButton {...mergeProps(stepButtonProps, decrementButtonProps)}>-</StepButton>
        <input
          ref={inputRef}
          {...spinButtonProps}
          tabIndex={0}
          aria-label="Number"
          value={state.value}
          readOnly
        />
        <StepButton {...mergeProps(stepButtonProps, incrementButtonProps)}>+</StepButton>
      </span>
    </>
  )
}

const StepButton = (props: UseButtonProps<HTMLButtonElement>) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  return (
    <button {...buttonProps} tabIndex={-1}>
      {props.children}
    </button>
  )
}
