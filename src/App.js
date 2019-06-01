import React, { Component } from 'react'
import './App.css'
import markerIcon from './icon-hotel.png'
import LocationList from './LocationList'
import escapeRegExp from 'escape-string-regexp'

class App extends Component {

	state = {
		venues: [], //all locations
		showingVenuse: [], //locations to show in location list
		markers : [],
		map: "", 
		infowindow: "",
		address: ""
	}

	componentDidMount() {
		this.getVenues()
	}
	
	//fetching data for places from foursquare API
	getVenues = () => {
		const endPoint = "https://api.foursquare.com/v2/venues/explore?"
		const parameters = {
			client_id: "5WYQILLJPGOVDJ1C3L1J35EG0X0QBG0SU2ZJRLF53PH4JG5A",
			client_secret: "4J2HHGD4AM2S45JYPFHGT1TTYRGGGTPRIGMGDNHPIE3HV1DC",
			query: "hotel",
			near: "Port Said",
			v: "20182507"
		}
		
		fetch(endPoint + new URLSearchParams(parameters))
			.then(response => {
				if (!response.ok) {
					this.errMsg("Failed to load the locations' data. Please try again later.");
					throw response;
				}
				return response.json();
			})
			.then(data => {
				this.setState({
					venues: data.response.groups[0].items,
					showingVenuse: data.response.groups[0].items
				}, this.renderMap());
			})
			.catch(err => {
				this.errMsg("Failed to load the locations' data. Please try again later.");
			});
	};
  
	//append the map to the dom
	loadScript = (url) => {
		var index  = window.document.getElementsByTagName("script")[0]
		var script = window.document.createElement("script")
		script.src = url
		script.async = true
		script.defer = true
		index.parentNode.insertBefore(script, index)
	}
	
	renderMap = () => {
		this.loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAkljbjwkt7T6FT5PxhepW-StzMPz5dq6U&callback=initMap")
		window.initMap = this.initMap
	}
	
	//open info window	
	openInfoWindow = (marker) => {
		let myVenue = this.state.venues.filter(v => v.venue.name === marker.title)
		let address = myVenue[0].venue.location.address
		let content =
				`<div id='info'>
					<div><strong><h2>${marker.title}</h2></strong></div>
					<strong><p>Egypt, Port Said, ${address? address: ""}</p></strong></div>
				</div>`
		this.state.infowindow.open(this.state.map, marker);
		this.state.infowindow.setContent(content);
	}
	
	handelClick = (myVenue) => {
		let markers = this.state.markers
		let marker = markers.filter(marker => marker.title === myVenue)
		this.openInfoWindow(marker[0])
		marker[0].setAnimation(window.google.maps.Animation.BOUNCE);
		setTimeout(function () {
		  marker[0].setAnimation(null);
		}, 800);
		markers.forEach(marker => marker.setVisible(true))
	}
	
	//display error message
	errMsg(error) {
		alert(error)
	}
	
	updateQuery = (query) => {
		this.state.infowindow.close() // close any infowindow
		this.setState({ query: query.trim() })
		if (query) {
			this.state.markers.forEach(marker => marker.setVisible(true)) // turn them on
			const match = new RegExp(escapeRegExp(query), 'i')
				this.setState({showingVenuse : this.state.venues.filter((myVenue) => match.test(myVenue.venue.name))})
				const notVisible = this.state.markers.filter(marker => this.state.showingVenuse.every(place => place.venue.id !== marker.id))
														
				notVisible.forEach(marker => marker.setVisible(false)) // turn them off
			} else {
				this.setState({ showingVenuse: this.state.venues })
				this.state.markers.forEach(marker => marker.setVisible(true)) // turn them on
			}
	}
	
	initMap = () => {
		// Create A Map
		var map = new window.google.maps.Map(document.getElementById('map'), {
		  center: {lat: 31.263767, lng: 32.288098},

		  zoom: 14
		})
		this.setState({map})
		
		// Create An InfoWindow
		var infowindow = new window.google.maps.InfoWindow()
	    var bounds = new window.google.maps.LatLngBounds();
		this.setState({infowindow})

		// Display Markers
		this.state.venues.forEach(myVenue => {
			 // Create A Marker
			var marker = new window.google.maps.Marker({
				position: {lat: myVenue.venue.location.lat , lng: myVenue.venue.location.lng},
				map: map,
				title: myVenue.venue.name,
				animation: window.google.maps.Animation.DROP,
				icon: markerIcon,
				id: myVenue.venue.id
			})
			
			this.state.markers.push(marker);
			bounds.extend(marker.position);
			window.openInfoWindow = this.openInfoWindow

			// Click on A Marker
			window.google.maps.event.addListener(marker, "click", (function(marker) {
				return function(evt) {
					window.openInfoWindow(marker)
				}
			})(marker));
		})
		// Extend the boundaries of the map for each marker
		map.fitBounds(bounds);
	}

	render() {
		return (
			<main>
				{ navigator.onLine ?
					<section className="map" id="map" role="contentinfo" aria-label="map" tabIndex="0"></section>
					: this.errMsg("Google Maps failed to load, Please check the connection!")
				}
				
				<section className="right-column" role="contentinfo" aria-label="locations' sidebar" tabIndex="0">
					<LocationList
						venuse={this.state.showingVenuse}
						updateQuery={this.updateQuery}
						handelClick={this.handelClick}
					/> 
				</section>	
		  </main>
		)
	  }
}

export default App;
