<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - ASAGUS</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          
          header {
            background: linear-gradient(135deg, #1D4DF1 0%, #3b82f6 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          
          header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
          }
          
          header p {
            font-size: 1.1rem;
            opacity: 0.95;
          }
          
          .info {
            background: #f8fafc;
            padding: 30px 40px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .info h2 {
            color: #1D4DF1;
            margin-bottom: 15px;
            font-size: 1.5rem;
          }
          
          .info p {
            color: #64748b;
            line-height: 1.8;
          }
          
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px 40px;
            background: #f1f5f9;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #1D4DF1;
            display: block;
          }
          
          .stat-label {
            color: #64748b;
            font-size: 0.9rem;
            margin-top: 5px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          thead {
            background: #1e293b;
            color: white;
          }
          
          th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          tbody tr {
            border-bottom: 1px solid #e2e8f0;
            transition: background 0.2s ease;
          }
          
          tbody tr:hover {
            background: #f8fafc;
          }
          
          tbody tr:nth-child(even) {
            background: #fafbfc;
          }
          
          tbody tr:nth-child(even):hover {
            background: #f1f5f9;
          }
          
          td {
            padding: 16px;
            color: #475569;
          }
          
          .url-cell {
            max-width: 500px;
            word-break: break-all;
          }
          
          .url-cell a {
            color: #1D4DF1;
            text-decoration: none;
            font-weight: 500;
          }
          
          .url-cell a:hover {
            text-decoration: underline;
          }
          
          .priority {
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 20px;
            display: inline-block;
            font-size: 0.85rem;
          }
          
          .priority-high {
            background: #dcfce7;
            color: #166534;
          }
          
          .priority-medium {
            background: #fef3c7;
            color: #854d0e;
          }
          
          .priority-low {
            background: #fee2e2;
            color: #991b1b;
          }
          
          .date {
            font-size: 0.9rem;
            color: #64748b;
          }
          
          footer {
            background: #1e293b;
            color: white;
            padding: 30px 40px;
            text-align: center;
          }
          
          footer p {
            margin: 5px 0;
            opacity: 0.9;
          }
          
          footer a {
            color: #60a5fa;
            text-decoration: none;
          }
          
          footer a:hover {
            text-decoration: underline;
          }
          
          @media (max-width: 768px) {
            body {
              padding: 10px;
            }
            
            header h1 {
              font-size: 1.8rem;
            }
            
            .info, .stats {
              padding: 20px;
            }
            
            table {
              font-size: 0.85rem;
            }
            
            th, td {
              padding: 12px 8px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>🗺️ XML Sitemap</h1>
            <p>ASAGUS - Engineering the Future of Digital Innovation</p>
          </header>
          
          <div class="info">
            <h2>What is a Sitemap?</h2>
            <p>
              This XML Sitemap helps search engines like Google, Bing, and others discover and index 
              all pages on the ASAGUS website. It contains metadata about each URL including when it 
              was last updated, how frequently it changes, and its relative importance.
            </p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <span class="stat-number">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
              </span>
              <span class="stat-label">Total URLs</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority &gt;= 0.8])"/>
              </span>
              <span class="stat-label">High Priority</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:changefreq = 'daily'])"/>
              </span>
              <span class="stat-label">Updated Daily</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>URL Location</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td class="url-cell">
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td class="date">
                    <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority &gt;= 0.8">
                        <span class="priority priority-high">
                          <xsl:value-of select="sitemap:priority"/>
                        </span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority &gt;= 0.5">
                        <span class="priority priority-medium">
                          <xsl:value-of select="sitemap:priority"/>
                        </span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority priority-low">
                          <xsl:value-of select="sitemap:priority"/>
                        </span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          
          <footer>
            <p><strong>ASAGUS</strong> - Digital Innovation Agency</p>
            <p>
              <a href="https://asagus.com">Visit Website</a> | 
              <a href="https://asagus.com/projects">View Projects</a> | 
              <a href="https://asagus.com/privacy">Privacy Policy</a>
            </p>
            <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.7;">
              This sitemap is automatically generated and updated regularly.
            </p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
