import { FC, PropsWithChildren } from 'react'

const Body: FC<PropsWithChildren> = ({ children }) => {
  return <main className="flex w-full flex-grow flex-col pb-10">{children}</main>
}
export default Body
