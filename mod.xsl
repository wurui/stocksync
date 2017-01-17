<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:oxm="https://www.openxsl.com">
    <xsl:template match="*" name="percent">
        <xsl:param name="delta"/>
        <xsl:choose>
            <xsl:when test="$delta &gt; 0">
                <em class="percent positive">+<xsl:value-of select="format-number($delta,'0.0%')"/></em>
            </xsl:when>
            <xsl:otherwise>
                <em class="percent negative"><xsl:value-of select="format-number($delta,'0.0%')"/></em>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="/root" name="wurui.stocksync">
        <xsl:param name="qs">symbol</xsl:param>
        <!-- className 'J_OXMod' required  -->
        <div class="J_OXMod oxmod-stocksync" ox-mod="stocksync" data-dsid="{data/stock-analysis/attribute::ADAPTERID}" data-qs="{$qs}">

            <table cellpadding="0" cellspacing="0" class="maintable">
                <tbody>
                    <xsl:for-each select="data/stock-analysis/i">
                        <tr data-href="{normalize-space(symbol)}" data-date="{lastDate}">
                            <td data-key="symbol">
                                <xsl:value-of select="symbol"/>
                            </td>
                            <td data-key="med">
                                <xsl:value-of select="med"/>
                            </td>
                            <td align="right">
                                <span data-key="close"><xsl:value-of select="close"/></span>
                                <span data-key="percent">
                                <xsl:call-template name="percent">
                                    <xsl:with-param name="delta" select="(close - med) div med"/>
                                </xsl:call-template>
                                </span>
                            </td>
                        </tr>
                    </xsl:for-each>
                </tbody>
            </table>
        </div>
    </xsl:template>

</xsl:stylesheet>
