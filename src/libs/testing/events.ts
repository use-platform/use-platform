export function installPointerEvent() {
  beforeAll(() => {
    // @ts-expect-error
    global.PointerEvent = class FakePointerEvent extends MouseEvent {}
  })

  afterAll(() => {
    // @ts-expect-error
    delete global.PointerEvent
  })
}
