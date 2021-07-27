import { useEffect, useLayoutEffect } from 'react'

import { canUseDom } from '../dom-utils'

export const useIsomorphicLayoutEffect = canUseDom ? useLayoutEffect : useEffect
