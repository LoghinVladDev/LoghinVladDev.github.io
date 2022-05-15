function applyTheme ( colorSetName = "darcula" ) {
    const request = new XMLHttpRequest()
    request.onload = () => {
        let newStyle = document.createElement('style')
        newStyle.appendChild ( document.createTextNode ( request.response ) )
        document.getElementsByTagName ( "head" )[0].appendChild ( newStyle )
    }

    request.open('GET', "theme/" + colorSetName + ".css")
    request.send()
}

applyTheme()