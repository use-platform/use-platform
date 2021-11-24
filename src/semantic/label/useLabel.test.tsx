import { FC } from 'react'

import { createClientRender, screen } from '../../libs/testing'
import { useUniqId } from '../../libs/uniq-id'
import { DOMProps } from '../../shared/types/dom'
import { useLabel } from './useLabel'

jest.mock('../../libs/uniq-id')
;(useUniqId as jest.MockedFunction<typeof useUniqId>).mockImplementation(
  (customId?: string) => customId || 'fakeRandomId',
)

interface FixtureProps extends DOMProps {
  useLabelElem?: boolean
}

const Fixture: FC<FixtureProps> = (props) => {
  const { labelProps, fieldProps: inputProps } = useLabel({
    ...props,
    behavior: props.useLabelElem ? 'label' : undefined,
  })

  return (
    <div>
      <label {...labelProps} data-testid="label">
        Label
      </label>
      <input type="text" name="input" data-testid="input" {...inputProps} />
    </div>
  )
}

describe('useLabel', () => {
  const render = createClientRender()

  test('should generate random id for label', () => {
    render(<Fixture />)

    expect(screen.getByTestId('label')).toHaveAttribute('id', 'fakeRandomId')
  })

  test('should generate random id for input', () => {
    render(<Fixture />)

    expect(screen.getByTestId('input')).toHaveAttribute('id', 'fakeRandomId')
  })

  test('should set id for input from props', () => {
    render(<Fixture id="foo" />)

    expect(screen.getByTestId('input')).toHaveAttribute('id', 'foo')
  })

  test('should set aria-labelledby attribute', () => {
    render(<Fixture />)

    expect(screen.getByTestId('input')).toHaveAttribute('aria-labelledby', 'fakeRandomId')
  })

  test('should not set for attribute', () => {
    render(<Fixture />)

    expect(screen.getByTestId('label')).not.toHaveAttribute('for')
  })

  test('should set for attribute', () => {
    render(<Fixture useLabelElem />)

    expect(screen.getByTestId('label')).toHaveAttribute('for', 'fakeRandomId')
  })
})
