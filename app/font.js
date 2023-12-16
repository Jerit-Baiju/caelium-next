import { Handlee } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
export const handleeFont = Handlee({
  weight : "400",
  subsets: ['latin'],
  display: 'swap',
})