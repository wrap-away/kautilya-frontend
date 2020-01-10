table = document.getElementById("ngo-table")

GetAllNgo().then(function(ngo_data) {
	ngo_data.map(function(element) {
		table.innerHTML += renderNGO(element)
	})
});



function renderNGO(ngo) {
	return `<br><div class="card">
			    <div class="card-body">
			      <div class="row">
			        <div class="col-md-9">
			          <h5 class="card-title">${ngo.name}</h5>
			          <p class="card-text">${ngo.location}</p>                  
			        </div>
			        <div class="col-md-3">
			          <a href="/ngo/#${ngo.id}" class="btn btn-primary">Go somewhere</a>
			        </div>
			      </div>
			    </div>
		 	 </div>
`
}

async function Get(url) {
    const req = await fetch(url)
    const json_data = await req.json()

    return json_data
}

async function GetAllNgo() {
    return Get('http://192.168.1.151:8000/ngo/')
}

