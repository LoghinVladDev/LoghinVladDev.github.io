function generateSidebarContentsInner ( list, element ) {

    const headingTypesToAdd = [
        "h1", "h2", "h3"
    ]

    let sublist = null;

    for ( let child of element.children ) {
        if (
            headingTypesToAdd.includes ( child.tagName.toLowerCase() ) &&
            child.id !== ""
        ) {
            sublist = document.createElement("ul")
            sublist.className = "nav-list"

            let listItem = document.createElement("li");
            list.appendChild(listItem)

            let linkToChapter = document.createElement("a");
            linkToChapter.innerText = child.innerText
            linkToChapter.href      = "#" + child.id

            listItem.appendChild (linkToChapter)

            listItem.appendChild ( sublist )
        } else {
            generateSidebarContentsRec ( sublist, child )
        }
    }
}

function generateSidebarContentsRec (list, element) {

    const headingTypesToAdd = [
        "h1", "h2", "h3"
    ]

    for ( let child of element.children ) {
        if (
            headingTypesToAdd.includes ( child.tagName.toLowerCase() ) &&
            child.id !== ""
        ) {
            generateSidebarContentsInner ( list, element )
            break
        } else {
            generateSidebarContentsRec ( list, child )
        }
    }
}

function generateSidebarContents () {
    let sidebarList = document.getElementById("navigationTree")
    let mainBody = document.getElementById("specificationBody")

    generateSidebarContentsRec(sidebarList, mainBody)
}

generateSidebarContents();