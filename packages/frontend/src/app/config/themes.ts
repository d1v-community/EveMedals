// Created with https://sui-dapp-kit-theme-creator.app
// Installation guide https://sdk.mystenlabs.com/dapp-kit/themes

import type { ThemeVars } from '@mysten/dapp-kit'

export const lightTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  backgroundColors: {
    primaryButton: '#f0642f',
    primaryButtonHover: '#dd5623',
    outlineButtonHover: '#e7ddcf',
    modalOverlay: 'rgba(17, 19, 21, 0.34)',
    modalPrimary: '#f3ede2',
    modalSecondary: '#ebe1d2',
    iconButton: 'transparent',
    iconButtonHover: '#e7ddcf',
    dropdownMenu: '#f3ede2',
    dropdownMenuSeparator: '#ddcfba',
    walletItemSelected: '#ebe1d2',
    walletItemHover: '#e7ddcf',
  },
  borderColors: {
    outlineButton: '#b8ab99',
  },
  colors: {
    primaryButton: '#111315',
    outlineButton: '#111315',
    iconButton: '#111315',
    body: '#111315',
    bodyMuted: 'rgba(17, 19, 21, 0.7)',
    bodyDanger: '#d9482b',
  },
  radii: {
    small: '0px',
    medium: '0px',
    large: '0px',
    xlarge: '0px',
  },
  shadows: {
    primaryButton: '0px 10px 28px rgba(240, 100, 47, 0.24)',
    walletItemSelected: '0px 10px 24px rgba(17, 19, 21, 0.08)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '600',
  },
  fontSizes: {
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px',
  },
  typography: {
    fontFamily: 'inherit',
    fontStyle: 'normal',
    lineHeight: '1.3',
    letterSpacing: '1',
  },
}

export const darkTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  backgroundColors: {
    primaryButton: '#f0642f',
    primaryButtonHover: '#f37a4d',
    outlineButtonHover: '#24282d',
    modalOverlay: 'rgba(8, 8, 9, 0.62)',
    modalPrimary: '#111315',
    modalSecondary: '#171a1d',
    iconButton: 'transparent',
    iconButtonHover: '#24282d',
    dropdownMenu: '#111315',
    dropdownMenuSeparator: '#24282d',
    walletItemSelected: '#171a1d',
    walletItemHover: '#24282d',
  },
  borderColors: {
    outlineButton: '#393f45',
  },
  colors: {
    primaryButton: '#0c0c0d',
    outlineButton: '#f4efe2',
    iconButton: '#f4efe2',
    body: '#f4efe2',
    bodyMuted: 'rgba(244, 239, 226, 0.7)',
    bodyDanger: '#ff7b5b',
  },
  radii: {
    small: '0px',
    medium: '0px',
    large: '0px',
    xlarge: '0px',
  },
  shadows: {
    primaryButton: '0px 12px 30px rgba(240, 100, 47, 0.28)',
    walletItemSelected: '0px 10px 26px rgba(0, 0, 0, 0.3)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '600',
  },
  fontSizes: {
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px',
  },
  typography: {
    fontFamily: 'inherit',
    fontStyle: 'normal',
    lineHeight: '1.3',
    letterSpacing: '1',
  },
}
