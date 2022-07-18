import React, { CSSProperties, HTMLAttributes, PropsWithChildren, forwardRef } from 'react'

const VisuallyHiddenStyles: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  margin: '0 -1px -1px 0',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: 1,
  whiteSpace: 'nowrap',
}

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>

export const VisuallyHidden = forwardRef<HTMLSpanElement, PropsWithChildren<VisuallyHiddenProps>>(
  (props, ref) => {
    const { children, ...otherProps } = props

    return (
      <span ref={ref} style={VisuallyHiddenStyles} {...otherProps}>
        {children}
      </span>
    )
  },
)
