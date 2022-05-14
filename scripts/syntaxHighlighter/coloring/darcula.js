const darculaColorSet = {

    preprocessor: "#bbb52a",
    keyword: "#cb7833",
    identifier: "#a8b7c5",
    operator: "#a8b7c5",
    character: "#cb7833",
    backgroundColor: "#2c2c2c",
    macro: "#8f8b26",
    numberConstant: "#6897bb",
    enumerant: "#9876aa",
    functionIdentifier: "#fec56d",

    applyForElement: ( element ) => {

        if ( element.tagName.toLowerCase() === "pre" ) {
            element.style = "" +
                "color: " + darculaColorSet.identifier + ";" +
                "background-color: " + darculaColorSet.backgroundColor
        }

        if ( element.tagName.toLowerCase() === "strong" ) {
            element.style = "" +
                "color: " + darculaColorSet.keyword + ";"
        }
    },

    apply: ( token, rules ) => {

        let ruleEntry = Object.entries ( rules.types ).find ( ( entry ) => {
            return entry[1] === token.type
        })

        let colorEntry = Object.keys ( darculaColorSet ).find ( (entry) => { return ruleEntry[0] === entry } )

        if (
            ruleEntry != null &&
            colorEntry != null
        ) {
            return "<span style='color:" + darculaColorSet[colorEntry] + "'>" + token.value + "</span>"
        }

        return token.value
    }
}