const API_ROOT = 'http://localhost:8000/';
const JITSI_ROOT = 'meet.jit.si';

const VOLUNTEER_ENDPOINT = 'volunteer/';
const CONFERENCE_ENDPOINT = 'conference/';

$('#jitsiModal').on('hidden.bs.modal', function() {
    document.querySelector('#jitsiParent').innerHTML = ''
});

async function startJitsiMeeting(el) {
    $('#modalTitle').text(el.dataset.title)
    const options = {
        roomName: el.dataset.roomName,
        width: 960,
        height: 540,
        parentNode: document.querySelector('#jitsiParent')
    };
    const api = new JitsiMeetExternalAPI(JITSI_ROOT, options);
}

async function Get(url) {
    const req = await fetch(url)
    const json_data = await req.json()

    return json_data
}

async function ApiGet(endpoint) {
    return Get(`${API_ROOT}${endpoint}`)
}

async function GetVolunteer(VolunteerID) {
    const volunteer = await ApiGet(`${VOLUNTEER_ENDPOINT}${VolunteerID}/`)
    return volunteer
}

async function GetAllVolunteers() {
    const volunteers = await ApiGet(`${VOLUNTEER_ENDPOINT}`)
    return volunteers
}

async function GetConference(ConferenceID) {
    const conference = await ApiGet(`${CONFERENCE_ENDPOINT}${ConferenceID}/`)
    return conference
}

async function GetAllConferences() {
    const conferences = await ApiGet(`${CONFERENCE_ENDPOINT}`)
    return conferences
}

const renderConferenceCard = function(conf_data) {
return `<div class='m-2'>
    <div class="card">
        <div class="font-weight-bold card-header">
        ${conf_data.title}
        </div>
        <div class="card-body">
            <h6 class="card-text">${conf_data.description}</h6>
            <p class="card-text">${conf_data.meeting_date}</p>
            <p class="card-text">Members: ${conf_data.members.map(member => `${member.user.first_name} ${member.user.last_name}`).join(', ')}</p>
            <p class="card-text">Created by: ${conf_data.created_by.user.first_name} ${conf_data.created_by.user.last_name}</p>
            <button type="button" class="btn btn-primary" onClick='startJitsiMeeting(this)' data-room-name='${conf_data.room_name}' data-title='${conf_data.title}' data-toggle="modal" data-target="#jitsiModal">
            Join Meeting
            </button>
        </div>
    </div>
</div>
`
}

async function createConferenceCardTemplate(conf) {
    const conf_data = {
        'room_name': conf.meeting_name,
        'title': conf.title,
        'description': conf.description,
        'meeting_date': moment.utc(conf.meeting_date).format('dddd, MMMM Do YYYY, h:mm:ss a'),
        'members': [],
        'created_by': await GetVolunteer(conf.created_by)
    }
    for (const member of conf.members) {
        const volunteer = await GetVolunteer(member)
        conf_data.members.push(volunteer) 
    }
    return renderConferenceCard(conf_data)
}

function appendConferenceCard(card) {
    $('#conference-cards').append(card)
}

$(document).ready(function() {
    async function init() {
        const conferences = await GetAllConferences()
        conferences.forEach(async conf => {
            const conference_card = await createConferenceCardTemplate(conf)
            appendConferenceCard(conference_card)
        });
    }
    init()
})