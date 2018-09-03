import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { CirclePicker } from 'react-color';
import firebase from '@firebase/app';
import '@firebase/firestore'

var config = {
  apiKey: "AIzaSyDEz_4vuYnK_8tCEyCwLIqZnqYweHqdmyE",
  authDomain: "funfunfield.firebaseapp.com",
  databaseURL: "https://funfunfield.firebaseio.com",
  projectId: "funfunfield",
  storageBucket: "",
  messagingSenderId: "955781326808"
};
firebase.initializeApp(config);

const firestore = firebase.firestore();

firestore.settings({
  timestampsInSnapshots: true
})


const PIXEL_SIZE = 10

class App extends Component {
  constructor() {
    super()
    this.state = {
      pixels: [
        { x: 2, y: 8, color: '#99CCFF' },
        { x: 8, y: 3, color: 'red' },
        { x: 1, y: 8, color: 'blue' }
      ],
    }
  }

  handlePixelsClicked(event) {
    if(this.state.selectedCoordinate) return

    const coordinate = {
      x: Math.floor(event.clientX / PIXEL_SIZE),
      y: Math.floor(event.clientY / PIXEL_SIZE)
    }
    this.setState({
      selectedCoordinate: coordinate
    })
    firebase
      .firestore()
      .collection("pixels")
      .onSnapshot(coll => 
        this.setState({
          pixels: coll.docs.map(doc => doc.data())
        })
      )
  }
  
  handleColorPicked(color) {
    firebase.firestore().collection("pixels").add({
      ...this.state.selectedCoordinate,
      color: color.hex
    })
    this.setState({
      selectedCoordinate: null,
      /*pixels: this.state.pixels.concat({
        ...this.state.selectedCoordinate,
        color: color.hex
      })*/
    })
    
  }

  render() {
    return (
      <div id="pixels" 
        onClick={this.handlePixelsClicked.bind(this)}
        style={{
          position: 'absolute',
        }}
      >
        {this.state.pixels.map(pixel =>
          <div style={{
            position: 'absolute',
            left: pixel.x * PIXEL_SIZE,
            top: pixel.y * PIXEL_SIZE,
            width: PIXEL_SIZE,
            height: PIXEL_SIZE,
            backgroundColor: pixel.color
          }}></div>
        )}
        {
          this.state.selectedCoordinate && <div style={{
            position: 'absolute',
            left: this.state.selectedCoordinate.x * PIXEL_SIZE,
            top: this.state.selectedCoordinate.y * PIXEL_SIZE,
          }}>
            <CirclePicker onChange={this.handleColorPicked.bind(this)}  />
          </div>
        }
      </div>
    );
  }
}

export default App;
