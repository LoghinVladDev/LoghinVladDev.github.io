function splitByTokens ( codeString, tokenRules ) {

    let tokens = []
    let currentToken = ""

    for ( let i = 0; i < codeString.length; ++ i ) {
        let usedRule = null
        let anyRuleValid = true

        for ( let ruleSet of Object.entries ( tokenRules ) ) {

            if ( ruleSet[0] === "types" ) {
                continue;
            }

            if ( ruleSet[1].validation ( currentToken ) && usedRule == null ) {
                usedRule = ruleSet
            }
        }

        while ( anyRuleValid && i < codeString.length ) {
            let currentRule = null
            currentToken += codeString[i ++];

            for ( let ruleSet of Object.entries ( tokenRules ) ) {

                if ( ruleSet[0] === "types" ) {
                    continue;
                }

                if ( ruleSet[1].validation ( currentToken ) && currentRule == null ) {
                    currentRule = ruleSet
                }
            }

            if ( currentRule == null ) {

                let token = usedRule[1].accept(currentToken.slice(0, -1))

                if (token !== null) {
                    tokens.push(token)
                }

                i -= 1
                currentToken = currentToken.slice(-1)
                break;
            }

            usedRule = currentRule;
        }
    }

    return tokens
}

function applyClassToToken ( token, tokenRules ) {
    return "<span class='" +
        "code-" +
        tokenRules.types.explicitClassName(token) +
        "'>" + token.value + "</span>"
}

function parse ( codeString, tokenRules ) {
    let tokens = splitByTokens ( codeString, tokenRules )
    if ( Object.keys ( tokenRules.types ).includes ( "applySpecialTokenRules" ) ) {
        tokenRules.types.applySpecialTokenRules ( tokens )
    }

    let finalText = ""
    for ( let token of tokens ) {
        finalText += applyClassToToken ( token, tokenRules )
    }

    return finalText
}

function applySyntaxClassification () {
    for ( let element of document.getElementsByTagName("pre") ) {
        element.innerHTML   = applySyntaxForCode(element.innerHTML, element.lang)
    }
}

function applySyntaxForCode ( codeString, language ) {

    codeString = codeString.replaceAll ( '&lt;', '<' )
    codeString = codeString.replaceAll ( '&gt;', '>' )

    if ( language.toLowerCase() === "c" ) {
        return parse ( codeString, cTokenRules )
    }

    return codeString;
}

applySyntaxClassification();
