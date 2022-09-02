import React, { HTMLAttributes } from 'react'

import { createSlot, useSlots } from '.'
import { renderHook } from '../../internal/testing'

const FooSlot = createSlot<HTMLAttributes<HTMLDivElement>>('foo')
const BarSlot = createSlot<HTMLAttributes<HTMLDivElement>>('bar')

describe('useSlots', () => {
  test('should throw an error for duplicate slots', () => {
    const { props } = (
      <>
        <FooSlot>one</FooSlot>
        <FooSlot>two</FooSlot>
      </>
    )
    const { result } = renderHook(() => useSlots(props))

    expect(() => result.current).toThrow(/Duplicate slot elements with name "foo" found/)
  })

  test('should throw an error for non-slotted content and defined default slot', () => {
    const { props } = (
      <>
        <FooSlot>one</FooSlot>
        two
      </>
    )
    const { result } = renderHook(() => useSlots(props, { defaultSlot: FooSlot }))

    expect(() => result.current).toThrow(/Extraneous children found when component already/)
  })

  test('should throw an error when passing an invalid default slot', () => {
    const SomeComponent = () => null
    const { result } = renderHook(() =>
      useSlots({ children: 'content' }, { defaultSlot: SomeComponent }),
    )

    expect(() => result.current).toThrow(/Invalid default slot component/)
  })

  test('should throw an error when passing an invalid slot to get method', () => {
    const SomeComponent = () => null
    const { result } = renderHook(() => useSlots({ children: 'content' }))
    const slots = result.current

    expect(() => slots.get(SomeComponent)).toThrow(/Invalid slot component/)
  })

  test('should combine non-slotted elements into an array', () => {
    const fragment = <>fragment</>
    const { props } = (
      <>
        text
        <FooSlot>foo</FooSlot>
        {10}
        <BarSlot>bar</BarSlot>
        {fragment}
      </>
    )
    const { result } = renderHook(() => useSlots(props))
    const slots = result.current

    expect(slots.children).toEqual(['text', 10, fragment])
  })

  test('should return content of default slot', () => {
    const { props } = (
      <>
        <FooSlot>foo</FooSlot>
        <BarSlot>bar</BarSlot>
      </>
    )
    const { result } = renderHook(() => useSlots(props, { defaultSlot: BarSlot }))
    const slots = result.current
    const content = slots.get(BarSlot)

    expect(slots.children).toBe(content?.rendered)
  })

  test('should return correct slot info', () => {
    const { props } = (
      <>
        <FooSlot data-test="a">foo</FooSlot>
        <BarSlot data-test="b">bar</BarSlot>
      </>
    )
    const { result } = renderHook(() => useSlots(props))
    const slots = result.current
    const foo = slots.get(FooSlot)
    const bar = slots.get(BarSlot)

    expect(foo?.name).toBe('foo')
    expect(foo?.props).toHaveProperty('data-test', 'a')
    expect(foo?.props).toHaveProperty('children', 'foo')
    expect(foo?.props.children).toBe(foo?.rendered)

    expect(bar?.name).toBe('bar')
    expect(bar?.props).toHaveProperty('data-test', 'b')
    expect(bar?.props).toHaveProperty('children', 'bar')
    expect(bar?.props.children).toBe(bar?.rendered)
  })
})
