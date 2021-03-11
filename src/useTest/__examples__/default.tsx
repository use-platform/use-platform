import { useTest } from '../index'

export const Default = () => {
  const value = useTest()

  return <div>{value}</div>
}
