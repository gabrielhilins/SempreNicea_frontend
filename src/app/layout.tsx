
import { Metadata } from "next";
import "./globals.css"
import NavbarFooterLayout from "./GerenciadorLayout"; // Importar o Client Component
import { register } from 'swiper/element/bundle';

register();

export const metadata: Metadata = {
  title: "Sempre Nicea",
  description: "Descrição do sempre nicea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/FavIcon.ico" sizes="image/x-icon"/>
      </head>
      <body>
        
          {/* Client Component controla Navbar e Footer */}
          <NavbarFooterLayout>
            {children}
          </NavbarFooterLayout>
       
      </body>
    </html>
  );
}
