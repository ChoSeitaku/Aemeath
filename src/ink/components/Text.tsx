// Text component - renders styled text
import React from 'react'

type TextProps = {
  children?: React.ReactNode
  color?: string
  backgroundColor?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  dim?: boolean
  dimColor?: boolean
  strikethrough?: boolean
}

export const Text: React.FC<TextProps> = ({
  children,
  color,
  backgroundColor,
  bold,
  italic,
  underline,
  dim,
  dimColor,
  strikethrough,
}) => {
  return React.createElement(
    'text',
    {
      color,
      backgroundColor,
      bold,
      italic,
      underline,
      dimColor: dim || dimColor,
      strikethrough,
    },
    children,
  )
}
