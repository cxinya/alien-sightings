// Define vars to create table
var $table = document.getElementById("alien-table");
var filteredData = dataSet;
var colLabels = ['Date/Time', 'Country', 'State', 'City',
                 'Shape', 'Duration', 'Comments'];
var fields = ['datetime', 'country', 'state', 'city',
              'shape', 'durationMinutes','comments'];

// Countries
var countryList = [
    {
        "name": "Australia",
        "abbreviation": "AU"
    },
    {
        "name": "Canada",
        "abbreviation": "CA"
    },
    {
        "name": "Great Britain",
        "abbreviation": "GB"
    },
    {
        "name": "United States",
        "abbreviation": "US"
    }
    ];
var countryHTML = '<option value="" selected disabled>Country</option>';
for (c = 0; c < countryList.length; c++){
    countryHTML += '<option>' + countryList[c].name + ' - ' + countryList[c].abbreviation + '</option>';
}
document.getElementById('country').innerHTML = countryHTML;


// States
var allStates = [...new Set(filteredData.map(item => item.state))].sort();
    // All states within a country
var statesCountry = [];
for (c = 0; c < countryList.length; c++){
    var states = [];
    for (i = 0; i < dataSet.length; i++){
        if (dataSet[i].country == countryList[c].abbreviation.toLowerCase()){
            states.push(dataSet[i].state);
        }
    statesCountryDict = {
        "country": countryList[c].abbreviation.toLowerCase(),
        "states": [...new Set(states)].sort()
        };
    }
    statesCountry.push(statesCountryDict);
}



// Change states based on country
renderStates();
document.getElementById("country").addEventListener("change", renderStates);

function renderStates(){
    var countryInput = document.getElementById("country").value;
    var $countryInput = countryInput.substring(countryInput.indexOf("-")+2).toLowerCase();
    var stateHTML = '<option value="" selected disabled>State</option>';
    var stateList = [];

    if ($countryInput == "") {
        stateList = allStates;
    }
    else {
        for (c = 0; c < statesCountry.length; c++){
            if ($countryInput == statesCountry[c].country){
                stateList = statesCountry[c].states;
            }
        }
    }

    for (s = 0; s < stateList.length; s++){
        stateHTML += '<option>' + stateList[s].toUpperCase() + '</option>';
    }
    document.getElementById("state").innerHTML = stateHTML;
}


// Unique shapes
var uniqueShapes = [...new Set(filteredData.map(item => item.shape))].sort();
var shapeHTML = '<option value="" selected disabled>Shape</option>';
for (s = 0; s < uniqueShapes.length; s++){
    shapeHTML += '<option>' + uniqueShapes[s] + '</option>';
}
document.getElementById("shape").innerHTML = shapeHTML;


// Error alerts for wrong dates and cities
var possibleDates = [...new Set(filteredData.map(item => item.datetime))].sort();
var possibleCities = [...new Set(filteredData.map(item => item.city))].sort();
var $cityInput = document.getElementById("city").value.toLowerCase().trim();
document.getElementById("date").addEventListener("change", checkDates);
document.getElementById("city").addEventListener("change", checkCities);

function checkDates() {
    var $dateInput = document.getElementById("date").value;
    if (possibleDates.indexOf($dateInput) >= 0) {
    }
    else {
        alert("There were no sightings on " + $dateInput + ". Please try a different date using this format: M/D/YYYY.");
    }
}

function checkCities() {
    var $cityInput = document.getElementById("city").value;
    if (possibleCities.indexOf($cityInput.toLowerCase().trim()) >= 0) {
    }
    else {
        alert("There were no sightings in " + $cityInput + ". Please try a different city.");
    }
}



// Render table
renderTable();
function renderTable() {

    var tableHTML = '<table id = "alientable" class = "table table-fixed table-hover table-bordered"><thead><tr>';

    // Add column headers
    for (c in colLabels) {
        tableHTML+= '<th>' + colLabels[c] + '</th>';
    }
    tableHTML += '</tr></thead><tbody></tbody></table>';
    $table.innerHTML = tableHTML;

    // Reference new <tbody> element
    var $tbody = document.querySelector("tbody");

    // Add table data
    for (var i = 0; i < filteredData.length; i++){
        // Current sighting
        var sighting = filteredData[i];
        // Create row for sighting
        var $row = $tbody.insertRow(i);
        // // Create cells for row
        for (var j = 0; j < fields.length; j++) {
            var field = fields[j];
            var $cell = $row.insertCell(j);
            $cell.innerText = sighting[field];
        }
    }
}



// Filter button
var $filter = document.getElementById("filter");
$filter.addEventListener("click", createFilteredData);

function createFilteredData(){
    // Input values
    var countryInput = document.getElementById("country").value;
    var $stateInput = document.getElementById("state").value.toLowerCase();
    var $cityInput = document.getElementById("city").value.toLowerCase().trim();
    var $dateInput = document.getElementById("date").value;
    var $shapeInput = document.getElementById("shape").value;
    // Add filter vars to filter array if not empty
    var filterVars = {};
    if (countryInput != "") {
        filterVars.country = countryInput.substring(countryInput.indexOf("-")+2).toLowerCase();
    }
    if ($stateInput != "") {
        filterVars.state = document.getElementById("state").value.toLowerCase();
    }
    if ($cityInput != "") {
        filterVars.city = document.getElementById("city").value.toLowerCase().trim();
    }
    if ($dateInput != "") {
        filterVars.datetime = document.getElementById("date").value;
    }
    if ($shapeInput != "") {
        filterVars.shape = document.getElementById("shape").value;
    }
    filteredData = dataSet.filter(function(sighting) {
        for(var key in filterVars) {
            if(sighting[key] === undefined || sighting[key] != filterVars[key])
                return false;
            }
        return true;
    });
    renderTable();
}

// Pagination & search comments
$(document).ready(function() {
    $('#alientable').dataTable( {
        "language": {
            "search": "Search comments:"
         }
    } );
})