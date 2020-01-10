function get_all_data() {
  return Get('http://localhost:8000/js/data_analytics.json')
}

async function Get(url) {
    const req = await fetch(url)
    const json_data = await req.json()

    return json_data
}

get_all_data().then(function(response) {
	fill_DOM(response)
});


function fill_DOM(data) {
	create_counters(data)
	create_chart(data.revenue)
	create_counters_social_media(data.social_media)
	create_counters_stats(data.stats)
	create_pie_chart(data.stats)
	create_doughnut_chart(data.stats)
	create_polar_area_chart(data.stats)
}

function create_counters(data) {
	total_ngos_connected = document.getElementById("total_ngos_connected");
	total_ngos_connected.innerText = data.total_ngos_connected
	total_volunteers_connected = document.getElementById("total_volunteers_connected");
	total_volunteers_connected.innerText = data.total_volunteers_connected
	total_centers_connected = document.getElementById("total_centers_connected");
	total_centers_connected.innerText = data.total_centers_connected
	total_kids_helped = document.getElementById("total_kids_helped");
	total_kids_helped.innerText = data.total_kids_helped	
}

function create_counters_social_media(data) {
	fb_likes = document.getElementById("fb_likes");
	fb_likes.innerText = data.fb_likes
	fb_shares = document.getElementById("fb_shares");
	fb_shares.innerText = data.fb_shares
	twitter_followers = document.getElementById("twitter_followers");
	twitter_followers.innerText = data.twitter_followers
	twitter_tweets = document.getElementById("twitter_tweets");
	twitter_tweets.innerText = data.twitter_tweets	
	linkedin_connections = document.getElementById("linkedin_connections");
	linkedin_connections.innerText = data.linkedin_connections
	linkedin_posts = document.getElementById("linkedin_posts");
	linkedin_posts.innerText = data.linkedin_posts	
}

function create_counters_stats(data) {
	stat_teachers = document.getElementById("stat_teachers");
	stat_teachers.innerText = data.stat_teachers
	stat_kids = document.getElementById("stat_kids");
	stat_kids.innerText = data.stat_kids
	stat_boys = document.getElementById("stat_boys");
	stat_boys.innerText = data.stat_boys
	stat_girls = document.getElementById("stat_girls");
	stat_girls.innerText = data.stat_girls	
}

function create_chart(revenue) {
	var mainChart = new Chart(document.getElementById('main-chart'), {
	type: 'line',
	data: {
	labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
	datasets: [{
	  label: 'Donation',
	  backgroundColor: hexToRgba(getStyle('--info'), 10),
	  borderColor: getStyle('--info'),
	  pointHoverBackgroundColor: '#fff',
	  borderWidth: 2,
	  data: revenue.donation
	}, {
	  label: 'Min Donation',
	  backgroundColor: 'transparent',
	  borderColor: getStyle('--danger'),
	  pointHoverBackgroundColor: '#fff',
	  borderWidth: 1,
	  borderDash: [8, 5],
	  data: revenue.min_donation
	}]
	},
	options: {
	maintainAspectRatio: false,
	legend: {
	  display: false
	},
	scales: {
	  xAxes: [{
	    gridLines: {
	      drawOnChartArea: false
	    }
	  }],
	  yAxes: [{
	    ticks: {
	      beginAtZero: true,
	      maxTicksLimit: 5,
	      stepSize: Math.ceil(250 / 5),
	      max: 250
	    }
	  }]
	},
	elements: {
	  point: {
	    radius: 0,
	    hitRadius: 10,
	    hoverRadius: 4,
	    hoverBorderWidth: 3
	  }
	}
	}
	});	
}

function create_pie_chart(data) {
	var boy_percent = Math.round((data.stat_boys / data.stat_kids) * 100)
	var girl_percent = Math.round((data.stat_girls / data.stat_kids) * 100)
	var myPie = new Chart(document.getElementById('gender-pie-chart'), {
		type: 'pie',
		data: {
			datasets: [{
				data: [
					boy_percent,
					girl_percent
				],
				backgroundColor: [
					"yellow",
					"green",
				],
				label: 'Gender Demographics'
			}],
			labels: [
				'Boys',
				'Girls',
			]
		},
		options: {
			responsive: true
		}
	});
}

function create_doughnut_chart(data) {
	var myDoughnut = new Chart(document.getElementById('age-doughnut-chart'), {
		type: 'doughnut',
		data: {
			datasets: [{
				data: data.stat_age_values,
				backgroundColor: [
					"red",
					"orange",
					"yellow",
					"green",
					"blue",
				],
				label: 'Dataset 1'
			}],
			labels: data.stat_age_labels
		},
		options: {
			responsive: true,
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Age Group Segregation'
			},
			animation: {
				animateScale: true,
				animateRotate: true
			}
		}
	});
}

function create_polar_area_chart(data) {
	var myDoughnut = new Chart.PolarArea(document.getElementById('subjects-polar-area-chart'), {	
		data: {
			datasets: [{
				data: data.stat_subject_hours,
				backgroundColor: [
					"red",
					"orange",
					"yellow",
					"green",
					"blue",
				],
				label: 'My dataset' // for legend
			}],
			labels: data.stat_subject_hours_labels
		},
		options: {
			responsive: true,
			legend: {
				position: 'right',
			},
			title: {
				display: true,
				text: 'Hours Spent In Teaching Given Subjects'
			},
			scale: {
				ticks: {
					beginAtZero: true
				},
				reverse: false
			},
			animation: {
				animateRotate: false,
				animateScale: true
			}
		}
	});
}