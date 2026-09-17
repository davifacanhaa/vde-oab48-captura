import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Método VDE | Aula gratuita: aprovado na OAB 48 em 90 dias',
  description:
    'Descubra em 1 aula gratuita o passo a passo do Método VDE para sair do zero e ser aprovado na 1ª fase da OAB 48, em janeiro de 2027. Inscrição gratuita.',
  openGraph: {
    title: 'Método VDE | Aula gratuita: aprovado na OAB 48 em 90 dias',
    description:
      'O passo a passo para ser aprovado na 1ª fase da OAB 48 em 90 dias de foco. Aula gratuita e ao vivo.',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>{children}</body>
    </html>
  )
}
