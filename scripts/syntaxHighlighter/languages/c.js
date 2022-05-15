const cTokenRules = {

    types: {
        preprocessor        : 1,
        keyword             : 2,
        identifier          : 3,
        character           : 4,
        whitespace          : 5,
        macro               : 6,
        numberConstant      : 7,
        operator            : 8,
        enumerant           : 9,
        functionIdentifier  : 10,
        stringConstant      : 11,

        applySpecialTokenRules: (tokens) => {
            for ( let i = 0; i < tokens.length - 1 ; ++i ) {

                if (
                    tokens[i].type === cTokenRules.types.preprocessor &&  (
                        tokens[i].value === "#define" ||
                        tokens[i].value === "#undef"
                    )
                ) {
                    for ( let nextNotNull = i + 1; nextNotNull < tokens.length; ++ nextNotNull ) {

                        if ( tokens [ nextNotNull ].type !== cTokenRules.types.whitespace ) {
                            tokens [ nextNotNull ] = {
                                type        : cTokenRules.types.macro,
                                value       : tokens[ nextNotNull ].value
                            }

                            break
                        }
                    }
                }

                if (
                    tokens[i].type === cTokenRules.types.preprocessor &&  (
                        tokens[i].value === "#include"
                    )
                ) {
                    let coloringSequence = false

                    for ( let nextNotNull = i + 1; nextNotNull < tokens.length; ++ nextNotNull ) {

                        if ( tokens [ nextNotNull ].type === cTokenRules.types.whitespace ) {
                            continue
                        }

                        if (
                            tokens [ nextNotNull ].type === cTokenRules.types.operator &&
                            tokens [ nextNotNull ].value === "<"
                        ) {
                            coloringSequence = true
                        }

                        if (
                            tokens [ nextNotNull ].type === cTokenRules.types.operator &&
                            tokens [ nextNotNull ].value === ">"
                        ) {
                            tokens [ nextNotNull ] = {
                                type        : cTokenRules.types.stringConstant,
                                value       : tokens[ nextNotNull ].value
                            }

                            break
                        }

                        if (
                            tokens [ nextNotNull ].type !== cTokenRules.types.whitespace &&
                            coloringSequence
                        ) {
                            tokens [ nextNotNull ] = {
                                type        : cTokenRules.types.stringConstant,
                                value       : tokens[ nextNotNull ].value
                            }
                        }
                    }
                }

                if (
                    tokens[i].type === cTokenRules.types.keyword &&
                    tokens[i].value === "enum"
                ) {
                    for ( let nextPosition = i + 1; nextPosition < tokens.length; ++ nextPosition ) {
                        if (
                            tokens [ nextPosition ].type === cTokenRules.types.operator &&
                            tokens [ nextPosition ].value === "}"
                        ) {
                            break;
                        }

                        if ( tokens [ nextPosition ].type === cTokenRules.types.identifier ) {
                            tokens [ nextPosition ] = {
                                type        : cTokenRules.types.enumerant,
                                value       : tokens [ nextPosition ].value
                            }
                        }
                    }
                }

                if (
                    tokens[i].type === cTokenRules.types.operator &&
                    tokens[i].value === "("
                ) {
                    let isFuncPtr = false

                    for ( let nextPosition = i + 1; nextPosition < tokens.length; ++ nextPosition ) {
                        if ( tokens [ nextPosition ].type === cTokenRules.types.whitespace ) {
                            continue
                        }

                        if (
                            tokens [ nextPosition ].type === cTokenRules.types.operator &&
                            tokens [ nextPosition ].value === "*"
                        ) {
                            isFuncPtr = true
                        }

                        break
                    }

                    for ( let previousPosition = i - 1; previousPosition >= 0 && ! isFuncPtr; -- previousPosition ) {

                        if (
                            tokens [ previousPosition ].type === cTokenRules.types.whitespace
                        ) {
                            continue
                        }

                        if (
                            tokens [ previousPosition ].type === cTokenRules.types.operator &&
                            tokens [ previousPosition ].value === ")"
                        ) {
                            break
                        }

                        if ( tokens [ previousPosition ].type === cTokenRules.types.identifier ) {
                            tokens [ previousPosition ] = {
                                type        : cTokenRules.types.functionIdentifier,
                                value       : tokens [ previousPosition ].value
                            }

                            break
                        }
                    }
                }
            }
        }
    },

    preprocessor: {
        types: {
            include     : 1,
            define      : 2,
            undef       : 3,
            _if         : 4,
            _else       : 5,
            elif        : 6,
            endif       : 7,
            ifdef       : 8,
            ifndef      : 9,
            elifdef     : 10,
            elifndef    : 11
        },

        associations: () => {
            return {
                "#include"  : cTokenRules.preprocessor.types.include,
                "#define"   : cTokenRules.preprocessor.types.define,
                "#undef"    : cTokenRules.preprocessor.types.undef,
                "#if"       : cTokenRules.preprocessor.types._if,
                "#else"     : cTokenRules.preprocessor.types._else,
                "#elif"     : cTokenRules.preprocessor.types.elif,
                "#endif"    : cTokenRules.preprocessor.types.endif,
                "#ifdef"    : cTokenRules.preprocessor.types.ifdef,
                "#ifndef"   : cTokenRules.preprocessor.types.ifndef,
                "#elifdef"  : cTokenRules.preprocessor.types.elifdef,
                "#elifndef" : cTokenRules.preprocessor.types.elifndef
            }
        },

        validation: ( token ) => {
            return (
                token.startsWith("#") ||
                Object.keys ( cTokenRules.preprocessor.associations() ).includes ( token.toLowerCase() )
            ) &&
            token.trimEnd() === token
        },

        accept: ( token ) => {
            return {
                type                : cTokenRules.types.preprocessor,
                value               : token,
                preprocessorType    : cTokenRules.preprocessor.associations()[token.toLowerCase()]
            }
        }
    },

    keyword: {
        types: {
            void      : 1,
            char      : 2,
            short     : 3,
            int       : 4,
            long      : 5,
            float     : 6,
            double    : 7,
            signed    : 8,
            unsigned  : 9,
            const     : 10,
            static    : 11,
            extern    : 12,
            register  : 13,
            struct    : 14,
            enum      : 15,
            union     : 16,
            typedef   : 17,
            sizeof    : 18,
            alignof   : 19
        },

        associations: () => {
            return {
                "void"      : cTokenRules.keyword.types.void,
                "char"      : cTokenRules.keyword.types.char,
                "short"     : cTokenRules.keyword.types.short,
                "int"       : cTokenRules.keyword.types.int,
                "long"      : cTokenRules.keyword.types.long,
                "float"     : cTokenRules.keyword.types.float,
                "double"    : cTokenRules.keyword.types.double,
                "signed"    : cTokenRules.keyword.types.signed,
                "unsigned"  : cTokenRules.keyword.types.unsigned,
                "const"     : cTokenRules.keyword.types.const,
                "static"    : cTokenRules.keyword.types.static,
                "extern"    : cTokenRules.keyword.types.extern,
                "register"  : cTokenRules.keyword.types.register,
                "struct"    : cTokenRules.keyword.types.struct,
                "enum"      : cTokenRules.keyword.types.enum,
                "union"     : cTokenRules.keyword.types.union,
                "typedef"   : cTokenRules.keyword.types.typedef,
                "sizeof"    : cTokenRules.keyword.types.sizeof,
                "alignof"   : cTokenRules.keyword.types.alignof
            }
        },

        validation: ( token ) => { return Object.keys ( cTokenRules.keyword.associations() ).includes ( token ); },
        accept: ( token ) => {
            return {
                type                : cTokenRules.types.keyword,
                value               : token,
                keywordType         : cTokenRules.keyword.associations()[token]
            }
        }
    },

    operator: {
        types: {
            addition:                       1,
            subtraction:                    2,
            multiplication:                 5,
            division:                       6,
            modulo:                         7,
            increment:                      8,
            decrement:                      9,

            equalTo:                        10,
            notEqualTo:                     11,
            greaterThan:                    12,
            lessThan:                       13,
            greaterThanOrEqualTo:           14,
            lessThanOrEqualTo:              15,

            logicalNegation:                16,
            logicalAnd:                     17,
            logicalOr:                      18,

            bitwiseNot:                     19,
            bitwiseAnd:                     20,
            bitwiseOr:                      21,
            bitwiseXor:                     22,
            bitwiseLeftShift:               23,
            bitwiseRightShift:              24,

            directAssignment:               25,
            additionAssignment:             26,
            subtractionAssignment:          27,
            multiplicationAssignment:       28,
            divisionAssignment:             29,
            moduloAssignment:               30,
            bitwiseAndAssignment:           31,
            bitwiseOrAssignment:            32,
            bitwiseXorAssignment:           33,
            bitwiseLeftShiftAssignment:     34,
            bitwiseRightShiftAssignment:    35,

            subscript:                      36,
            indirection:                    37,
            addressOf:                      38,
            structureDereference:           39,
            structureReference:             40,
            functionCall:                   41,
            comma:                          42,
            ternary:                        43,

            bodyBrackets:                   44,
        },

        associations: () => {
            return {
                "+"     : cTokenRules.operator.types.addition,
                "-"     : cTokenRules.operator.types.subtraction,
                "*"     : cTokenRules.operator.types.multiplication,
                "/"     : cTokenRules.operator.types.division,
                "%"     : cTokenRules.operator.types.modulo,
                "++"    : cTokenRules.operator.types.increment,
                "--"    : cTokenRules.operator.types.decrement,

                "=="    : cTokenRules.operator.types.equalTo,
                "!="    : cTokenRules.operator.types.notEqualTo,
                ">"     : cTokenRules.operator.types.greaterThan,
                "<"     : cTokenRules.operator.types.lessThan,
                ">="    : cTokenRules.operator.types.greaterThanOrEqualTo,
                "<="    : cTokenRules.operator.types.lessThanOrEqualTo,

                "!"     : cTokenRules.operator.types.logicalNegation,
                "&&"    : cTokenRules.operator.types.logicalAnd,
                "||"    : cTokenRules.operator.types.logicalOr,

                "~"     : cTokenRules.operator.types.bitwiseNot,
                "&"     : cTokenRules.operator.types.bitwiseAnd,
                "|"     : cTokenRules.operator.types.bitwiseOr,
                "^"     : cTokenRules.operator.types.bitwiseXor,
                "<<"    : cTokenRules.operator.types.bitwiseLeftShift,
                ">>"    : cTokenRules.operator.types.bitwiseRightShift,

                "="     : cTokenRules.operator.types.directAssignment,
                "+="    : cTokenRules.operator.types.additionAssignment,
                "-="    : cTokenRules.operator.types.subtractionAssignment,
                "*="    : cTokenRules.operator.types.multiplicationAssignment,
                "/="    : cTokenRules.operator.types.divisionAssignment,
                "%="    : cTokenRules.operator.types.moduloAssignment,
                "&="    : cTokenRules.operator.types.bitwiseAndAssignment,
                "|="    : cTokenRules.operator.types.bitwiseOrAssignment,
                "^="    : cTokenRules.operator.types.bitwiseXorAssignment,
                "<<="   : cTokenRules.operator.types.bitwiseLeftShiftAssignment,
                ">>="   : cTokenRules.operator.types.bitwiseRightShiftAssignment,

                "["     : cTokenRules.operator.types.subscript,
                "]"     : cTokenRules.operator.types.subscript,
                "->"    : cTokenRules.operator.types.structureDereference,
                "."     : cTokenRules.operator.types.structureReference,
                "("     : cTokenRules.operator.types.functionCall,
                ")"     : cTokenRules.operator.types.functionCall,
                ","     : cTokenRules.operator.types.comma,
                "?"     : cTokenRules.operator.types.ternary,
                ":"     : cTokenRules.operator.types.ternary,

                "{"     : cTokenRules.operator.types.bodyBrackets,
                "}"     : cTokenRules.operator.types.bodyBrackets
            }
        },

        validation: ( token ) => { return Object.keys ( cTokenRules.operator.associations() ).includes ( token ); },
        accept: ( token ) => {
            return {
                type                : cTokenRules.types.operator,
                value               : token,
                keywordType         : cTokenRules.operator.associations()[token]
            }
        }
    },

    numberConstant: {
        validation: ( token ) => {
            return (
                (
                    token.match(/^(0|([1-9]\d*))[uU]?[lL]?[lL]?$/) ||
                    token.match(/^(0|([1-9]\d*))[lL]?[lL]?[uU]?$/) ||
                    token.match(/^0[0-7]+[lL]?[lL]?[uU]?$/) ||
                    token.match(/^0[0-7]+[uU]?[lL]?[lL]?$/) || (
                        token.startsWith("0b") ||
                        token.startsWith("0B") ||
                        token.match(/^0[bB][0-1]+[uU]?[lL]?[lL]?$/)
                    ) || (
                        token.startsWith("0b") ||
                        token.startsWith("0B") ||
                        token.match(/^0[bB][0-1]+[lL]?[lL]?[uU]?$/)
                    ) || (
                        token.startsWith("0x") ||
                        token.startsWith("0X") ||
                        token.match(/^0[xX][\da-fA-F]+[uU]?[lL]?[lL]?$/)
                    )|| (
                        token.startsWith("0x") ||
                        token.startsWith("0X") ||
                        token.match(/^0[xX][\da-fA-F]+[lL]?[lL]?[uU]?$/)
                    )
                ) && token.trimEnd() === token
            )
        },

        accept: ( token ) => {
            return {
                type                : cTokenRules.types.numberConstant,
                value               : token
            }
        }
    },

    stringConstant: {
        validation: ( token ) => {
            return (
                token.startsWith('"') ||
                token.match( /^"[_a-zA-Z]+\w*"$/ )
            ) && token.trimEnd() === token
        },

        accept: ( token ) => {
            return {
                type                : cTokenRules.types.stringConstant,
                value               : token
            }
        }
    },

    identifier: {
        validation: ( token ) => { return token.match( /^[_a-zA-Z]+\w*$/ ) },
        accept: ( token ) => {
            return {
                type                : cTokenRules.types.identifier,
                value               : token
            }
        }
    },

    enumerant: {
        validation: ( token ) => { return token.match( /^[_a-zA-Z]+\w*$/ ) },
        accept: ( token ) => {
            return {
                type                : cTokenRules.types.enumerant,
                value               : token
            }
        }
    },

    functionIdentifier: {
        validation: ( token ) => { return token.match( /^[_a-zA-Z]+\w*$/ ) },
        accept: ( token ) => {
            return {
                type                : cTokenRules.types.functionIdentifier,
                value               : token
            }
        }
    },

    whitespace: {
        validation: ( token ) => { return /^[ \r\f\n\t]+$/.test ( token ); },
        accept: ( token ) => {
            return {
                type                : cTokenRules.types.whitespace,
                value               : token
            }
        }
    },

    character: {
        validation: ( token ) => { return token.length === 1; },
        accept: ( token ) => {
            return {
                type                : cTokenRules.types.character,
                value               : token[0]
            }
        }
    }
}