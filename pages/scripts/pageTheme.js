function applyTheme ( colorSet = darculaColorSet ) {
    for ( let element of document.getElementsByTagName("strong") ) {
        colorSet.applyForElement ( element )
    }
}

applyTheme()