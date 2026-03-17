<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">

  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="ru">
      <head>
        <title>RSS — ProfitableWeb</title>
        <meta name="robots" content="noindex,nofollow" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: #0a0a0a;
            color: #a1a1aa;
            min-height: 100vh;
          }

          .header {
            border-bottom: 1px solid #1e1e22;
            padding: 24px 32px;
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .logo svg { display: block; }

          .header h1 {
            font-size: 18px;
            font-weight: 600;
            color: #e4e4e7;
            letter-spacing: -0.02em;
          }

          .header .subtitle {
            font-size: 13px;
            color: #52525b;
            margin-left: auto;
          }

          .container {
            max-width: 720px;
            margin: 0 auto;
            padding: 32px;
          }

          .info {
            background: #111114;
            border: 1px solid #1e1e22;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
          }

          .info p {
            font-size: 13px;
            line-height: 1.6;
            color: #71717a;
          }

          .info code {
            background: #1e1e22;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            color: #5ADC5A;
          }

          .entries { display: flex; flex-direction: column; gap: 12px; }

          .entry {
            background: #111114;
            border: 1px solid #1e1e22;
            border-radius: 8px;
            padding: 20px;
            transition: border-color 0.15s;
          }

          .entry:hover { border-color: #27272a; }

          .entry-title {
            font-size: 15px;
            font-weight: 600;
            color: #e4e4e7;
            margin-bottom: 6px;
          }

          .entry-title a {
            color: inherit;
            text-decoration: none;
          }

          .entry-title a:hover {
            color: #e4e4e7;
          }

          .entry-summary {
            font-size: 13px;
            line-height: 1.5;
            color: #71717a;
            margin-bottom: 8px;
          }

          .entry-date {
            font-size: 12px;
            color: #3f3f46;
            font-variant-numeric: tabular-nums;
          }

          .footer {
            text-align: center;
            padding: 32px;
            font-size: 12px;
            color: #3f3f46;
          }

          .footer a { color: #52525b; text-decoration: none; }
          .footer a:hover { color: #71717a; }
        </style>
      </head>
      <body>
        <div class="header">
          <a class="logo" href="https://profitableweb.ru">
            <svg width="31" height="22" viewBox="0 0 31 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#c2)">
                <path opacity="0.85" d="M5.21471 14.5333V22H0V0H8.6213C10.2722 0 11.7396 0.311111 13.0062 0.933333C14.2815 1.55556 15.2598 2.43556 15.9586 3.57333C16.6574 4.72 17.0068 6.00889 17.0068 7.46667C17.0068 9.60889 16.2556 11.3244 14.7444 12.6133C13.2333 13.8933 11.1631 14.5422 8.53395 14.5422H5.20597L5.21471 14.5333ZM5.21471 10.4356H8.63004C9.64328 10.4356 10.4119 10.1778 10.936 9.66222C11.4689 9.14667 11.7309 8.42667 11.7309 7.48444C11.7309 6.45333 11.4601 5.63556 10.9186 5.02222C10.377 4.40889 9.63454 4.09778 8.69118 4.08889H5.21471V10.4356Z" fill="#f4f4f5"/>
                <path opacity="0.8" d="M23.357 13.7956L25.8377 0H31L26.4142 22H21.0073L18.1161 9.45778L15.2773 22H9.88786L5.28459 0H10.4644L12.9451 13.7956L15.9149 0H20.3347L23.3483 13.7956H23.357Z" fill="#5ADC5A"/>
              </g>
              <defs><clipPath id="c2"><rect width="31" height="22" fill="white"/></clipPath></defs>
            </svg>
          </a>
          <h1>RSS Feed</h1>
          <span class="subtitle">
            <xsl:value-of select="count(atom:feed/atom:entry)"/> записей
          </span>
        </div>

        <div class="container">
          <div class="info">
            <p>Это RSS-лента сайта ProfitableWeb. Скопируйте URL <code><xsl:value-of select="atom:feed/atom:link[@rel='alternate']/@href"/>/feed.xml</code> и добавьте в любой RSS-ридер.</p>
          </div>

          <div class="entries">
            <xsl:for-each select="atom:feed/atom:entry">
              <div class="entry">
                <div class="entry-title">
                  <a href="{atom:link/@href}"><xsl:value-of select="atom:title"/></a>
                </div>
                <xsl:if test="atom:summary">
                  <div class="entry-summary"><xsl:value-of select="atom:summary"/></div>
                </xsl:if>
                <div class="entry-date"><xsl:value-of select="substring(atom:updated, 1, 10)"/></div>
              </div>
            </xsl:for-each>
          </div>
        </div>

        <div class="footer">
          <a href="https://profitableweb.ru">ProfitableWeb</a> — подписка на обновления
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
