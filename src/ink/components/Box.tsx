// Box component - basic container with flexbox layout
import React from 'react'

type BoxProps = {
  children?: React.ReactNode
  width?: number
  height?: number
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?: 'auto' | 'stretch' | 'flex-start' | 'center' | 'flex-end'
  padding?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  margin?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  borderStyle?: 'single' | 'double' | 'round' | 'bold'
  title?: string
  style?: {
    color?: string
    backgroundColor?: string
  }
}

export const Box: React.FC<BoxProps> = ({
  children,
  width,
  height,
  flexDirection = 'column',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  borderStyle,
  title,
  style,
}) => {
  return React.createElement(
    'box',
    {
      width,
      height,
      flexDirection,
      justifyContent,
      alignItems,
      padding,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      borderStyle,
      title,
      style,
    },
    children,
  )
}
