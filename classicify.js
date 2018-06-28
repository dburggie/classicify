
/*
Injected into reddit's classic site.
We add an Event Listener for mouse events on the page. If the events are in
relation to a reddit url, we make sure that url points to the classic site.
*/

function eventHandler(e) {
	
	//we don't care if we're not clicking a link
	if (!e.target.hasAttribute("href")) {
		return;
	}
	
	//return if we're not clicking a link to reddit.com
	var url = e.target.getAttribute("href");
	if (!url.includes("reddit.com")) {
		return;
	}
	
	//return if already a classic link
	if (url.includes("old.reddit.com")) {
		return;
	}
	
	//correct the url
	e.target.setAttribute("href", makeClassic(url));
}



function makeClassic(url) {

	var target = "reddit.com";
	var classicURL = "https://old.reddit.com";

	//split at our target string, skip the prefix and join the remaining
	//chunks (if there are any)
	return classicURL.concat(url.split(target).slice(1).join(target));
}



document.addEventListener("mousedown", eventHandler);
document.addEventListener("contextmenu", eventHandler);
