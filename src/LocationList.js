import React from 'react'
import {DebounceInput} from 'react-debounce-input';

class LocationList extends React.Component {
    state={
			workingList:'',
			v: [],
			query: ''
	}

    render() {
        return (
		    <div id='side-bar'>
				<h1 tabIndex="0">Hotels in Port Said</h1>
				<h5 tabIndex="0"> This App is using Foursquare</h5>
				<DebounceInput
                    debounceTimeout={500}
					id='input-box' 
					type='text' 
					placeholder='Enter hotel name' 
					aria-label="search hotels"
					tabIndex="0"
					onChange={(event) => this.props.updateQuery(event.target.value)}
				/>
				<ul aria-label = 'List of hotels' tabIndex="0">
					{this.props.venuse.map( location =>
						<li 
							data-key={location.venue.id} 
							key={location.venue.id} 
							//onClick={(event) => this.props.updateQuery(location.venue.name)}
							onClick={(e) => this.props.handelClick(location.venue.name)}
							tabIndex="0"
						>
							{location.venue.name} 
						</li>
					)}
				</ul>
			</div>
        )
    }
}

export default LocationList