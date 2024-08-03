import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=ranade@100,300,400,500&f[]=satoshi@300,400,500,700&f[]=supreme@300,400,500,700&display=swap"
          rel="stylesheet"
        ></link>
      </head>

      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
