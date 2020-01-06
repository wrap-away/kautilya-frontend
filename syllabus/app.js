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
        col_md_6_1.setAttribute("class", "col-md-6")
        row.appendChild(col_md_6_1)


        var col_md_6_2 = document.createElement('div')
        col_md_6_2.setAttribute("class", "col-md-6 pb-4")
        row.appendChild(col_md_6_2)


        var subjectHeader = document.createElement('h3')
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
        subjectHeader.appendChild(subjectTitle)

        col_md_6_1.appendChild(subjectHeader)
        
        var chaptersList = document.createElement('ul')
        chapters = data[grade][key][subject].chapters
        for (chapter of chapters) {
            chapterName = document.createElement('li')
            chapterName.innerText = chapter
            chaptersList.appendChild(chapterName)
        }
        col_md_6_1.appendChild(chaptersList)

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
