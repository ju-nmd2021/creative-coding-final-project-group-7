//The following code was adapted from https://www.youtube.com/watch?v=3yqANLRWGLo Accessed: 2023-10-12 Author：Kazuki Umeda
//Github face-api：https://github.com/justadudewhohacks/face-api.js

//faceapi reference: https://learn.ml5js.org/#/reference/face-api
let faceapi;
let detections = [];

let video;
let canvas;

function setup() {
  canvas = createCanvas(480, 360);
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5,
  };

  faceapi = ml5.faceApi(video, faceOptions, faceReady);

  synth = new Tone.PolySynth().toDestination();

  asciiVideo = createCapture(VIDEO);
  asciiVideo.size(50, 28);
  asciiVideo.position(-100, -100);
  //asciiVideo.position(100, 100);
  asciiDiv = createDiv();
  asciiDiv.position(500, 0);
}

function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;

  clear();
  drawBoxs(detections);
  drawLandmarks(detections);
  drawExpressions(detections, 20, 250, 14);

  faceapi.detect(gotFaces);
}

function drawBoxs(detections) {
  if (detections.length > 0) {
    for (f = 0; f < detections.length; f++) {
      let { _x, _y, _width, _height } = detections[f].alignedRect._box;
      stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

function drawLandmarks(detections) {
  if (detections.length > 0) {
    for (f = 0; f < detections.length; f++) {
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

const fMinorScale = ["F6", "G6", "G#6", "A#6", "C7", "C#7", "D#7"];
const eMajorScale = ["E4", "F#4", "G#4", "A4", "B4", "C#5", "D5"];
const bMinorScale = ["B2", "C#3", "D3", "E3", "F#3", "G3", "A3", "B3"];
const dMajorScale = ["D2", "E2", "F#2", "G2", "A2", "B3", "C#3", "D4"];

const rhythmsSurprised = ["4n", "8n", "8t", "8n", "8t"];
const rhythmsHappy = ["16n", "8n", "16t", "32n", "16t"];
const rhythmsAngry = ["16n", "16n", "16n", "16n", "16n", "16n", "16n", "16n"];
const rhythmsSad = ["4n", "8n", "8t", "8n", "8t"];

function generateSurprisedMusic() {
  const randomNoteIndex = Math.floor(Math.random() * fMinorScale.length);
  const randomRhythmIndex = Math.floor(Math.random() * rhythmsSurprised.length);

  const note = fMinorScale[randomNoteIndex];
  const rhythm = rhythmsSurprised[randomRhythmIndex];

  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(note, rhythm);
}

function generateHappyMusic() {
  const randomNoteIndex = Math.floor(Math.random() * eMajorScale.length);
  const randomRhythmIndex = Math.floor(Math.random() * rhythmsHappy.length);

  const note = eMajorScale[randomNoteIndex];
  const rhythm = rhythmsHappy[randomRhythmIndex];

  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(note, rhythm);
}

function generateSadMusic() {
  const randomNoteIndex = Math.floor(Math.random() * bMinorScale.length);
  const randomRhythmIndex = Math.floor(Math.random() * rhythmsSad.length);

  const note = bMinorScale[randomNoteIndex];
  const rhythm = rhythmsSad[randomRhythmIndex];

  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(note, rhythm);
}

function generateAngryMusic() {
  const randomNoteIndex = Math.floor(Math.random() * dMajorScale.length);
  const randomRhythmIndex = Math.floor(Math.random() * rhythmsAngry.length);

  const note = dMajorScale[randomNoteIndex];
  const rhythm = rhythmsAngry[randomRhythmIndex];

  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(note, rhythm);
}

function drawExpressions(detections, x, y, textYSpace) {
  if (detections.length > 0) {
    let { neutral, happy, angry, sad, surprised } = detections[0].expressions;

    // if (neutral > 0.5) {
    //   // synth.triggerAttackRelease("B3", "4n");
    //   generateNeutralMusic();
    // }

    if (happy > 0.5) {
      // synth.triggerAttackRelease("C2", "4n");
      generateHappyMusic();
    }

    if (angry > 0.5) {
      // synth.triggerAttackRelease("A1", "4n");
      generateAngryMusic();
    }

    if (sad > 0.5) {
      // synth.triggerAttackRelease("D4", "4n");
      generateSadMusic();
    }

    if (surprised > 0.5) {
      generateSurprisedMusic();
    }

    textFont("Arial");
    textSize(14);
    noStroke();
    fill(44, 169, 225);
    text("neutral:     " + nf(neutral * 100, 2, 2) + "%", x, y);
    text("happiness: " + nf(happy * 100, 2, 2) + "%", x, y + textYSpace);
    text("anger:        " + nf(angry * 100, 2, 2) + "%", x, y + textYSpace * 2);
    text("sad:            " + nf(sad * 100, 2, 2) + "%", x, y + textYSpace * 3);
    text(
      "surprised:  " + nf(surprised * 100, 2, 2) + "%",
      x,
      y + textYSpace * 4
    );
  } else {
    text("neutral: ", x, y);
    text("happiness: ", x, y + textYSpace);
    text("anger: ", x, y + textYSpace * 2);
    text("sad: ", x, y + textYSpace * 3);
    text("surprised: ", x, y + textYSpace * 4);
  }
}

//The following code was adapted from https://thecodingtrain.com/CodingChallenges/166-ascii-image.html and https://youtu.be/55iwMYv8tGI Accessed: 2023-10-19 Author：Daniel Shiffman

const density = "абвгдеёжзийклмно?!;:+=-,._                    ";

let asciiDiv;

function draw() {
  asciiVideo.loadPixels();

  let asciiImage = "";

  for (let j = 0; j < asciiVideo.height; j++) {
    for (let i = 0; i < asciiVideo.width; i++) {
      const pixelIndex = (i + j * asciiVideo.width) * 4;

      const r = asciiVideo.pixels[pixelIndex + 0];
      const g = asciiVideo.pixels[pixelIndex + 1];
      const b = asciiVideo.pixels[pixelIndex + 2];

      const avg = (r + g + b) / 3;

      const len = density.length;
      const charIndex = floor(map(avg, 0, 255, 0, len));

      const c = density.charAt(charIndex);

      if (c == " ") asciiImage += "&nbsp;";
      else asciiImage += c;
    }
    asciiImage += "<br/>";
  }
  asciiDiv.html(asciiImage);
}
