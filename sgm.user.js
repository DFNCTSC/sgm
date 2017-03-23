// ==UserScript==
// @name         Steam Group Mover
// @namespace    https://digitalgangster.com
// @version      0.1337
// @description  Facilitates moving a group by inviting users from one group to another group
// @author       foe
// @match        *://steamcommunity.com/groups/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// ==/UserScript==

// Configure the two variable (var) tags below with the correct CustomURLs for the groups you'd like to move to/from.
// i.e. http://steamcommunity.com/groups/[CustomURL] << Your CustomURL is the text after /groups/.
// After configuring, save the script and then visit the group page of the group you're moving to (output_group_CustomURL).
// The script will then execute after the page has fully loaded, and logs successes/failures to the JavaScript Console.
// It takes awhile to completely execute so being patient and viewing the console is a must.
// After the script finishes you will need to manually turn off this script or it will run every time you visit the group.
// Invites are limited to ~300 invites every ~3 hours, so this script must be run more than once for larger groups.

// CustomURL of the group to move from
var input_group_CustomURL = "";

// CustomURL of the group to move to
var output_group_CustomURL = "";


//############################################################################################//
//# # # # # # # # # # # # # # # # LEAVE EVERYTHING BELOW ALONE # # # # # # # # # # # # # # # #//
//############################################################################################//

function InviteUserToSteamGroup(group_id)
{
	return $.ajax({
		url: 'https://steamcommunity.com/groups/' + input_group_CustomURL + '/memberslistxml',
		data: { xml:1 },
		type: 'GET',
		dataType: 'xml'
	}).done(function(xml) {
		$(xml).find('steamID64').each(function(){

			var params = {
				json: 1,
				type: 'groupInvite',
				group: group_id,
				sessionID: g_sessionID,
				invitee: $(this).text()
			};

			$.ajax({
				url: 'https://steamcommunity.com/actions/GroupInvite',
				data: params,
				type: 'POST',
				dataType: 'json'
			}).done(function(data) {
				if (data.duplicate) {
					console.log('[' + $(this).text() + '] already invited or currently joined');
				} else {
					console.log('[' + $(this).text() + '] invited to group');
				}
			}).fail(function() {
				console.log('Ya dun goofed. Try again.');
			});
		});
	}).fail(function() {
		console.log('Ya dun goofed.');
	});
}

function GetGroupData(group_CustomURL)
{
	return $.ajax({
		url: 'https://steamcommunity.com/groups/' + group_CustomURL + '/memberslistxml',
		data: { xml:1 },
		type: 'GET',
		dataType: 'xml'
	}).done(function(xml) {
		InviteUserToSteamGroup($(xml).find('groupID64').text());
	}).fail(function() {
		console.log('Ya dun goofed.');
	});
}

GetGroupData(output_group_CustomURL);

// setTimeout(GetGroupData(output_group_CustomURL), 10000);
