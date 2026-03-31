import { Theme } from '@radix-ui/themes'
import { FC, PropsWithChildren } from 'react'

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Theme
      accentColor="orange"
      grayColor="gray"
      radius="none"
      className="w-full bg-sds-light text-sds-dark dark:bg-sds-dark dark:text-sds-light"
    >
      {children}
    </Theme>
  )
}

export default ThemeProvider
