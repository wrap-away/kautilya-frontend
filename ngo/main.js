const API_ROOT = 'http://localhost:8000/';
const JITSI_ROOT = 'meet.jit.si';

const VOLUNTEER_ENDPOINT = 'volunteer/';
const CONFERENCE_ENDPOINT = 'conference/';
const NGO_ENDPOINT = 'ngo/';
const LISTING_ENDPOINT = 'listing/';

var ROOT_NGO = undefined

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

async function GetNgo(NgoID) {
    const ngo = await ApiGet(`${NGO_ENDPOINT}${NgoID}/`)
    return ngo
}

async function GetAllNgo() {
    const ngo = await ApiGet(`${NGO_ENDPOINT}/`)
    return ngo
}

async function GetConference(ConferenceID) {
    const conference = await ApiGet(`${CONFERENCE_ENDPOINT}${ConferenceID}/`)
    return conference
}

async function GetAllConferences() {
    const conferences = await ApiGet(`${CONFERENCE_ENDPOINT}`)
    return conferences
}

async function GetListing(ListingID) {
    const conference = await ApiGet(`${LISTING_ENDPOINT}${ListingID}/`)
    return conference
}

async function GetAllListing() {
    const conferences = await ApiGet(`${LISTING_ENDPOINT}`)
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

function renderMemberCard(member) {
    return `
    <div class='col-sm-4 col-md-4 col-lg-4 col-xl-4'>
        <div class="card">
            <h5 class="card-header">${member.user.first_name} ${member.user.last_name}</h5>
            <div class="card-body">
                <div><span>${member.user.username}<span></div>
                <div><span>${member.role_type}<span></div>
            </div>
        </div>
    </div>
    `
} 

function renderMembersCard(members_data) {
    let member_html = `<div class='row'>`
    for (const member of members_data) {
        member_html += renderMemberCard(member)
    }
    member_html += `</div>`
    return member_html
}

async function createMembersCardTemplate(members) {
    const members_data = []
    for (const member of members) {
        members_data.push(await GetVolunteer(member))
    }
    const renderHtml = renderMembersCard(members_data)

    return renderHtml
}

function renderListingCard(listing) {
    return `
    <div class='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <div class="card m-2">
            <h5 class="card-header">${listing.title}</h5>
            <div class="card-body">
                <div><span>${moment.utc(listing.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}<span></div>
                <div><span>${listing.description}<span></div>
            </div>
        </div>
    </div>
    `
} 

function renderListingCards(listing_data) {
    let member_html = `<div class='row'>`
    for (const listing of listing_data) {
        member_html += renderListingCard(listing)
    }
    member_html += `</div>`
    return member_html
}

async function createListingCardTemplate(listings) {
    const listing_data = []
    for (const listing of listings) {
        listing_data.push(await GetListing(listing))
    }
    const renderHtml = renderListingCards(listing_data)

    return renderHtml
}

async function membersClickHandler() {
    let html = await createMembersCardTemplate(ROOT_NGO.members)
    $("#ngoContent").html(html)
}
async function listingsClickHandler() {
    let html = await createListingCardTemplate(ROOT_NGO.listings)
    $("#ngoContent").html(html)
}

function appendConferenceCard(card) {
    $('#ngoContent').append(card)
}
async function conferencesClickHandler() {
    const conferences = ROOT_NGO.conferences
    $("#ngoContent").html('')
    for (const conference of conferences) {
        const conf_data = await GetConference(conference)
        const conference_card = await createConferenceCardTemplate(conf_data)
        appendConferenceCard(conference_card)
    }
}

function createDonationCardTemplate(donation) {
    return `
    <div class='col-sm-4 col-md-4 col-lg-4 col-xl-4'>
        <div class="card m-2">
            <h5 class="card-header">${donation.volunter.user.first_name} ${donation.volunter.user.last_name}</h5>
            <div class="card-body">
                <div><span>&#8377;${donation.amount}<span></div>
            </div>
        </div>
    </div>
    `
}

async function donationsClickHandler() {
    const donations = ROOT_NGO.donations
    let html = `<div class='row'>`
    for (const donation of donations) {
        donation.volunter = await GetVolunteer(donation.volunteer)
        html += await createDonationCardTemplate(donation)
    }
    html += '</div>'
    $('#ngoContent').html(html)
}

async function SetRootNgo() {
    const NgoId = window.location.hash.substr(1)
    ngo = await GetNgo(parseInt(NgoId))
    ROOT_NGO = ngo
    console.log(ROOT_NGO)
}

function SetNgoNameAndDesc() {
    $("#NGOName").html(ROOT_NGO.name)
    $("#NGODesc").html(ROOT_NGO.description)
}


$(document).ready(function() {
    async function init() {
        if (window.location.hash === "" || window.location.hash === "#" ) {
            return undefined
        }
        await SetRootNgo()
        
        $('#jitsiModal').on('hidden.bs.modal', function() {
            document.querySelector('#jitsiParent').innerHTML = ''
        });
        
        SetNgoNameAndDesc()
        
        var membersButton = $('#membersButton')
        var listingsButton = $('#listingsButton')
        var conferencesButton = $('#conferencesButton')
        var donationsButton = $('#donationsButton')

        membersButton.click(membersClickHandler)
        listingsButton.click(listingsClickHandler)
        conferencesButton.click(conferencesClickHandler)
        donationsButton.click(donationsClickHandler)

        membersButton.click()
    }
    init()
})