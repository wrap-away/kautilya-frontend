var data

$(document).ready(function() {
    getData().then(function(response) {
        data = response
        populateSidebar()
    })
})

function populateSidebar(){
    var sidebar = document.getElementById("sidebar")
    for (grade in data) {
        var anchor = document.createElement('a')
        anchor.innerText = Object.keys(data[grade])[0]
        anchor.classList.add("list-group-item", "list-group-item-action", "bg-light")
        anchor.setAttribute("href", "#")
        anchor.setAttribute("onclick", "showSyllabus("+grade+")")
        sidebar.appendChild(anchor)
    }
}

function showSyllabus(grade) {
    var details = document.getElementById("details")
    deleteChildNodes(details)
    var subjects = Object.values(data[grade])[0]
    var key = Object.keys(data[grade])[0]
    
    for (subject in subjects) {
        var row = document.createElement('div')
        row.setAttribute('class', 'row')

        details.appendChild(row)

        var col_md_6_1 = document.createElement('div')
        col_md_6_1.setAttribute("class", "col-md-6 pb-5")
        row.appendChild(col_md_6_1)


        var col_md_6_2 = document.createElement('div')
        col_md_6_2.setAttribute("class", "col-md-6 pb-4")
        row.appendChild(col_md_6_2)

        var card = document.createElement('div')
        card.setAttribute("class", "card")
        card.style.width = "18rem"

        
        var subjectTitle = document.createElement('a')
        subjectTitle.innerText = subject
        subjectLink = data[grade][key][subject].link
        youtubePlaylistRegex = /^[a-zA-Z0-9_-]*$/
        
        if (youtubePlaylistRegex.test(subjectLink)) {
            playlistLink = "https://www.youtube.com/playlist?list=" + subjectLink
            subjectTitle.setAttribute("href", playlistLink)
        } else {
            subjectTitle.setAttribute("href", subjectLink)
        }
        
        subjectTitle.setAttribute("target", "_blank")

        cardHeader = document.createElement('div')
        cardHeader.setAttribute("class", "card-header")
        cardHeader.appendChild(subjectTitle)
        card.appendChild(cardHeader)
        
        var chaptersList = document.createElement('ul')
        chaptersList.setAttribute("class", "list-group list-group-flush")
        chapters = data[grade][key][subject].chapters
        for (chapter of chapters) {
            chapterName = document.createElement('li')
            chapterName.setAttribute("class", "list-group-item")
            chapterName.innerText = chapter
            chaptersList.appendChild(chapterName)
        }
        card.appendChild(chaptersList)
        col_md_6_1.appendChild(card)

        if (youtubePlaylistRegex.test(subjectLink) && subjectLink) {
            iframe = document.createElement("iframe")
            iframe.setAttribute("width", 560)
            iframe.setAttribute("height", 315)
            iframeLink = "https://www.youtube.com/embed/videoseries?list=" + subjectLink
            iframe.setAttribute("src", iframeLink)
            iframe.setAttribute("frameborder", 0)
            iframe.setAttribute("allow", "allow=accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture")
            iframe.setAttribute("allowfullscreen", "")

            col_md_6_2.appendChild(iframe)
        }

    }
}

function deleteChildNodes(node) {
    node.innerHTML = ""
}

$("#menu-toggle").click(function(e) {
    e.preventDefault()
    $("#wrapper").toggleClass("toggled")
})

async function getData() {
    data = await fetch('data.json')
    return await data.json()
}
