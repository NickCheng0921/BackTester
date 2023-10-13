const COOKIE_LIFE = 10;
const PRED_CLOSE_TEXT = "Pred Close: $";
let currTickers = [];
//https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";SameSite=Lax;path=/";
}
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
		c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
		}
	}
	return "";
}
function renderTicker(ticker, html_id, years_ago, months_ago) {
	$.ajax({
		url: tickerUrl,
		method: "POST",
		data: { 'ticker': ticker,
				'years_ago': years_ago,
				'months_ago': months_ago },
		success: function(response) {
			let dP = [];
			for (let i = 0; i < response['adj_close'].length; i++) {
				let date = response['dates'][i]
				dP.push({x: new Date(response['dates'][i]), y:response['adj_close'][i]})
			}
			var chart = new CanvasJS.Chart(html_id, {
				animationEnabled: false,
				theme: "light2",
				backgroundColor: "#2E3440",
				title:{
					text: response['name'],
					fontColor: "#88c0d0"
				},
				axisX:{
					labelFontColor: "#88c0d0"
				},
				axisY:{
					labelFontColor: "#88c0d0"
				},
				data: [{        
					type: "line",
					indexLabelFontSize: 16,
					dataPoints: dP
				}]
			});
			chart.render();
		},
		error: function(xhr) {
			console.log(xhr);
		}
	});
}
function searchTickers() {
	//split search query and filter empty strings
	currTickers = [];
	searchedTickers = document.getElementById("ticker_input").value.trim().split(" ").filter(o=>o);
	$('#mainContent').html("");
	$('#rightContent').html("");

	let years_ago = testFieldForInt('#ticker_search_year', 1);
	let months_ago = testFieldForInt('#ticker_search_month', 0);

	searchedTickers.forEach(function(tN) {
		tN = tN.toUpperCase();
		var newChartDiv = document.createElement("div");
		newChartDiv.id = "chart"+tN.toString();
		newChartDiv.classList.add("chart");
		document.getElementById("mainContent").appendChild(newChartDiv);
		renderTicker(tN, "chart"+tN.toString(), years_ago, months_ago);
	});
	setCookie('searchedTickers', JSON.stringify(searchedTickers), exdays=10);
	currTickers = searchedTickers;
}

function testFieldForInt(field, def){
	let fieldVal = $(field).val();
	let val;
	if (/^\d+$/.test(fieldVal)) { //regex for int
		val = parseInt(fieldVal, 10);
	} else {
		val = def;
		$(field).val(val);
	}
	return val;
}

function setupPage() {
	var previousTickers = getCookie('searchedTickers');
	if (previousTickers != "") {
		$('#ticker_input').val(JSON.parse(previousTickers).join(' '));
	}

	searchTickers();

	// search tickers on enter
    $('#ticker_input').on('keypress', function(event) {
        if (event.type === 'keypress' && event.which === 13) {
            searchTickers();
			$(this).blur(); // this refers to DOM that triggered event, which is input box
        }
    });
    $('#ticker_search_year').on('keypress', function(event) {
        if (event.type === 'keypress' && event.which === 13) {
            searchTickers();
			$(this).blur(); // this refers to DOM that triggered event, which is input box
        }
    });
    $('#ticker_search_month').on('keypress', function(event) {
        if (event.type === 'keypress' && event.which === 13) {
            searchTickers();
			$(this).blur(); // this refers to DOM that triggered event, which is input box
        }
    });
}