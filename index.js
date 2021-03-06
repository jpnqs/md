/**
 * THrows an error message
 * @param {String} sMessage Error message
 */
function RenderingFailedException (sMessage) {
    var oError = Error(sMessage);
    
    oError.code = "MarkdownRenderingFailed";
    return oError;
}

RenderingFailedException.prototype = Object.create(Error.prototype);

/**
 * renders a markdown document to html container/div
 * @param {String} sContainerId html container id 
 * @param {Array.<string>} aMarkdownCode markdown code as string array
 * @throws {RenderingFailedException}
 */
function renderMarkdownToContainer (sContainerId, aMarkdownCode) {
    
    var oContainer = document.getElementById(sContainerId);
    
    var sInnerHTML = aMarkdownCode.join('%&');

    sInnerHTML = createCodeParagraph(sInnerHTML);

    sInnerHTML = createBold(sInnerHTML);

    sInnerHTML = createItalic(sInnerHTML);

    sInnerHTML = createItalicBold(sInnerHTML);

    sInnerHTML = createImages(sInnerHTML);

    sInnerHTML = createHyperLink(sInnerHTML);

    sInnerHTML = sInnerHTML.replace(/\%\&/g, "<BR>");
    
    aMarkdownCode = sInnerHTML.split(/\<BR\>/g);
    
    var aMdCode = aMarkdownCode.map(function (sValue) {
        sValue = interpreteMarkdownStatement(sValue); 
        return sValue;
    });
    
    sInnerHTML = aMdCode.join("");     
    
    oContainer.innerHTML = sInnerHTML;

}

/**
 * Interpretes an markdown statement
 * @param {String} sStatement Markdown statement
 */
function interpreteMarkdownStatement (sStatement) {
    
    var oElement = null;

    if (sStatement.match(/^######/gm)) {
        oElement = createHeader(sStatement.replace(/^######/gm, ""), 6);
    } else if (sStatement.match(/^#####/gm)) {
        oElement = createHeader(sStatement.replace(/^#####/gm, ""), 5);   
    } else if (sStatement.match(/^####/gm)) {
        oElement = createHeader(sStatement.replace(/^####/gm, ""), 4);   
    } else if (sStatement.match(/^###/gm)) {
        oElement = createHeader(sStatement.replace(/^###/gm, ""), 3);   
    } else if (sStatement.match(/^##/gm)) {
        oElement = createHeader(sStatement.replace(/^##/gm, ""), 2);   
    } else if (sStatement.match(/^#/gm)) {
        oElement = createHeader(sStatement.replace(/^#/gm, ""), 1);   
    } else {
        oElement = createParagraph(sStatement);
    }
    
    return oElement;

}

/**
 * header element
 * @param {String} sText 
 * @param {Number} iLayer 
 */
function createHeader (sText, iLayer) {
    var sReturnText = '<H' + iLayer + ' class="MD_Header">' + sText + '</H' + iLayer + '>';
    return sReturnText;
}

/**
 * Bold text element
 * @param {String} sText 
 */
function createBold (sText) {
    var sReturnText = sText;
    var aMatches = sText.match(/\*\*.*?\*\*/g);
    if (Array.isArray(aMatches)) {
        aMatches.forEach(function (sString) {
            var sNewString = sString;
            sNewString = sNewString.replace(/^\*\*/, "<B>");
            sNewString = sNewString.replace(/\*\*$/, "</B>");
            sReturnText = sReturnText.replace(sString, sNewString);
        });
    }
    return sReturnText;
}

/**
 * Italic text element
 * @param {String} sText 
 */
function createItalic (sText) {
    var sReturnText = sText;
    var aMatches = sText.match(/\*.*?\*/g);
    if (Array.isArray(aMatches)) {
        aMatches.forEach(function (sString) {
            var sNewString = sString;
            sNewString = sNewString.replace(/^\*/, "<I>");
            sNewString = sNewString.replace(/\*$/, "</I>");
            sReturnText = sReturnText.replace(sString, sNewString);
        });
    }
    return sReturnText;
}

/**
 * italic / bold element
 * @param {String} sText 
 */
function createItalicBold (sText) {
    var sReturnText = sText;
    var aMatches = sText.match(/\*\*\*.*?\*\*\*/g);
    if (Array.isArray(aMatches)) {
        aMatches.forEach(function (sString) {
            var sNewString = sString;
            sNewString = sNewString.replace(/^\*\*\*/, "<B><I>");
            sNewString = sNewString.replace(/\*\*\*$/, "</I></B>");
            sReturnText = sReturnText.replace(sString, sNewString);
        });
    }
    return sReturnText;
}

/**
 * hyperlink elements
 * @param {String} sText 
 */
function createHyperLink (sText) {
    var sReturnText = sText;
    var aMatches = sText.match(/\[.*?\]\(.*?\)/g);
    if (Array.isArray(aMatches)) {
        aMatches.forEach(function (sString) {
            var sNewString = sString;
            var sLinkText = "";
            var sLinkTarget = "";
            sLinkText = sNewString.split(/\[/)[1].split(/\]/)[0];
            sLinkTarget = sNewString.split(/\(/)[1].split(/\)/)[0];
            sNewString = '<a class="MD_Hyperlink" href="' + sLinkTarget + '">' + sLinkText + "</a>";
            sReturnText = sReturnText.replace(sString, sNewString);
        });
    }
    return sReturnText;
}

/**
 * Paragraph texte element
 * @param {String} sText 
 */
function createParagraph (sText) {
    // var oParagraph = document.createElement("P");
    // oParagraph.className = "MD_P";
    // oParagraph.innerHTML = sText;
    // return oParagraph;
    var sTest = sText.replace(/\s/g, "");
    if (sTest != "") {
        return '<P class="MD_P">' + sText + '</P>';
    }
}

/**
 * Code paragraph element
 * @param {String} sText 
 */
function createCodeParagraph (sText) {
    var sReturnText = sText;
    var aMatches = sText.match(/\`\`\`.*?\`\`\`/gm);
    if (Array.isArray(aMatches)) {
        aMatches.forEach(function (sString) {
            var sNewString = sString;
            sNewString = sNewString.replace(/^\`\`\`/gm, '<P class="MD_Code">');
            sNewString = sNewString.replace(/\`\`\`$/gm, "</P>");
            sReturnText = sReturnText.replace(sString, sNewString);
        });
    }
    return sReturnText;
}

/**
 * Create image tag
 * @param {String} sText 
 */
function createImages (sText) {
    var sReturnText = sText;
    var aMatches = sText.match(/\!\[.*?\]\(.*?\)/g);
    if (Array.isArray(aMatches)) {
        aMatches.forEach(function (sString) {
            var sNewString = sString;
            var sAltText = "";
            var sImageLink = "";
            sAltText = sNewString.split(/\[/)[1].split(/\]/)[0];
            sImageLink = sNewString.split(/\(/)[1].split(/\)/)[0];
            sNewString = '<img src="' + sImageLink + '" alt="' + sAltText + '"></img>';
            sReturnText = sReturnText.replace(sString, sNewString);
        });
    }
    return sReturnText;
}
