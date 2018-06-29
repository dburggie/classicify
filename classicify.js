
/*
Injected into reddit's classic site.
We add an Event Listener for mouse events on the page. If the events are in
relation to a reddit url, we make sure that url points to the classic site.
*/

console.log("classicify active");


function xhr_progress_handler(e)
{
	var hits = SLR.get(this.requestURL);

	if (hits.length == 0)
	{
		var errmsg = "classicify.xhr_progress_handler():";
		errmsg += "no matching SLR for request to <";
		errmsg += this.requestURL + ">";
		console.log(errmsg);
		return;
	}

	for (var slr in hits)
	{
		if (!slr.done) slr.onProgress(e);
	}
}

function xhr_load_handler(e)
{
	var hits = SLR.get(this.requestURL);

	if (hits.length == 0)
	{
		var errmsg = "classicify.xhr_load_handler():";
		errmsg += "no matching SLR for request to <";
		errmsg += this.requestURL + ">";
		console.log(errmsg);
		this.abort();
		return;
	}

	for (var slr in hits)
	{
		if (!slr.done)
		{
			slr.onLoad(e);
		}
	}
}

function xhr_error_handler(e)
{
	var hits = SLR.get(this.requestURL);

	if (hits.length == 0)
	{
		var errmsg = "classicify.xhr_error_handler():";
		errmsg += "no matching SLR for request to <";
		errmsg += this.requestURL + ">";
		console.log(errmsg);
		this.abort();
		return;
	}

	for (var slr in hits)
	{
			if (typeof(slr) == "SLR")
			{
				slr.onError(e);
			}
			else
			{
				console.log("classicify.xhr_error_handler(): type error <" + typeof(slr) + "," + slr + ">");
			}
	}
}

function xhr_abort_handler(e)
{
	var hits = SLR.get(this.requestURL);

	if (hits.length == 0)
	{
		var errmsg = "classicify.xhr_abort_handler():";
		errmsg += "no matching SLR for request to <";
		errmsg += this.requestURL + ">";
		console.log(errmsg);
		return;
	}

	slrobj.onStop(e);
}

var slr_master_list = [];
var slr_list = [];

class SLR
{
	constructor(element) {
		this.done = false;
		this.element = element;
		this.oldhref = element.getAttribute("href");
		this.oldhtml = element.innerHTML;
		this.xhr = null;
	}



	onStart()
	{
		slr_list.push(this);

		//disable our current link
		this.updateURL("about:blank");

		//update our link text to let user know we're working
		var msg = "(starting) ";
		msg += this.oldhtml;
		this.updateHTML(msg);

		//initialize our http request
		this.xhr = new XMLHttpRequest();
		this.xhr.open("GET", this.oldhref);
		this.xhr.addEventListener("progress", xhr_progress_handler);
		this.xhr.addEventListener("load", xhr_load_handler);
		this.xhr.addEventListener("error", xhr_error_handler);

		//send request
		this.xhr.send();
	}



	onStop()
	{
		//only do this one time
		if (this.done) return;
		this.done = true;

		//craft message and url
		var msg;
		var url = this.xhr.responseURL;
		if (this.checkStatus())
		{
			msg = "(done) ";
			url = makeClassic(url);
		}

		else
		{
			msg = "(failed) ";
			url = this.oldurl;
		}


		//push our updated url and message
		this.updateURL(url);
		this.updateHTML(msg + this.oldhtml);

		//clean up
		this.xhr.abort();
	}



	onProgress(e)
	{
		//get progress and alert user
		if (this.checkStatus)
		{
			this.onStop();
			return;
		}

		var msg = "(";
		if (e.lengthComputable)
		{
			msg += e.loaded / e.total * 100;
			msg += "% done) ";
		}
		else
		{
			msg += "working) ";
		}

		msg += this.oldhtml;
		this.updateHTML(msg);
	}



	onLoad(e)
	{
		this.onStop();
	}

	onError(e)
	{
		var msg = "classicify.SLR.onError():";
		console.log(msg);
	}



	checkStatus()
	{
		var msg = "classicify.SLR.onLoad(): ";
		var url = this.xhr.responseURL;

		if (url == undefined
				|| url == null
				|| url == ""
				|| url.contains("v.redd.it")
			)
		{
			return false;
		}

		else
		{
			msg += "url resolved to <";
			msg += url + ">";
			console.log(msg);
			return true;
		}
	}



	updateHTML(txt)
	{
		var msg = "classicify.SLR.updateHTML(): ";
		console.log(msg + "setting to <" + txt + ">");

		//write to elements innerHTML field
		this.element.innerHTML = txt;

		//log text after the write
		msg += "now set to <";
		msg += this.element.innerHTML;
		msg += ">";
		console.log(msg);
	}



	updateURL(url)
	{
		var msg = "classicify.SLR.updateURL(): ";

		var old = this.element.getAttribute("href");

		if (old == url)
		{
			msg += "nothing to do <" + url + ">";
			console.log(msg);
			return;
		}

		this.element.setAttribute("href",url);
		var updated = this.element.getAttribute("href");
		if (updated != url)
		{
			msg += "could not change value <";
			msg += "old:" + old + ",";
			msg += "new:" + url + ",";
			msg += "now:" + updated + ">";
			console.log(msg);
			return;
		}

		else
		{
			msg += "updated to <" + url + ">";
			console.log(msg);
			return;
		}
	}



	static handle(element)
	{
		slr_master_list.push(new SLR(element));
		var obj = slr_master_list[slr_master_list.length - 1];
		var similar = SLR.get(obj.oldurl);
		var count = 0;

		for (var slr in similar)
		{
			if (slr.oldhtml == obj.oldhtml)
			{
				count += 1;
				break;
			}
		}

		if (count == 0)
		{
			obj.onStart();
		}
	}


	static get(url)
	{
		var result = [];

		for (var slr in slr_list)
		{
			if (slr.oldhref == url)
			{
				result.push(slr);
			}
		}

		return result;
	}
}



function eventHandler(e)
{
	console.log(e.target.innerHTML);
	console.log(e.target.href);
	
	//ignore if we're not clicking a link
	if (!e.target.hasAttribute("href"))
	{
		return;
	}
	
	var url = e.target.getAttribute("href");

	//handle the nightmare of reddit shortened links
	if (url.includes("v.redd.it"))
	{
		SLR.handle(e.target);
		return;
	}

	//ignore if we're not clicking a link to reddit.com
	if (!url.includes("reddit.com"))
	{
		return;
	}
	
	//ignore if already a classic link
	if (url.includes("old.reddit.com"))
	{
		return;
	}
	
	//correct the url
	e.target.setAttribute("href", makeClassic(url));
}




//change a www.reddit.com url to a old.reddit.com url
function makeClassic(url)
{
	var target = "reddit.com";
	var classicURL = "https://old.reddit.com";

	//split at our target string, skip the prefix and join the remaining
	//chunks (if there are any)
	return classicURL.concat(url.split(target).slice(1).join(target));
}



//link the above methods to our page via mouse events
document.addEventListener("mousedown", eventHandler);
document.addEventListener("contextmenu", eventHandler);
