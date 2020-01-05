$(document).ready(function() {
    populateSidebar()
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
        var subjectHeader = document.createElement('h3')
        var subjectTitle = document.createElement('a')
        subjectTitle.innerText = subject
        subjectTitle.setAttribute("href", data[grade][key][subject].link)
        subjectTitle.setAttribute("target", "_blank")
        subjectHeader.appendChild(subjectTitle)
        details.appendChild(subjectHeader)
        var chaptersList = document.createElement('ul')
        chapters = data[grade][key][subject].chapters
        for (chapter of chapters) {
            chapterName = document.createElement('li')
            chapterName.innerText = chapter
            chaptersList.appendChild(chapterName)
        }
        details.appendChild(chaptersList)
    }
}

function deleteChildNodes(node) {
    node.innerHTML = ""
}

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
