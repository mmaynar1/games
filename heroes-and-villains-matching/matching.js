var imageName;
var clickCount = 0;
var chosen = ["*", "*"];
var reset = 0;
var matched = 0;
var id1 = "";
var id2 = "";

var numberOfImages = 20;

//Randomize image locations
var images = ["http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Starwars-Stormtrooper-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Master-Chief-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Spiderman-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Venom-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Ironman-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Starwars-Stormtrooper-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Master-Chief-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Spiderman-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Venom-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Ironman-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Starwars-Stormtrooper-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Master-Chief-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Spiderman-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Venom-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Ironman-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Starwars-Stormtrooper-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Master-Chief-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Spiderman-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Venom-icon.png",
  "http://icons.iconarchive.com/icons/kidaubis-design/cool-heroes/64/Ironman-icon.png"
];

var images = shuffle(images);

//Set span titles to corresponding image name
for (var i = 1; i <= numberOfImages; ++i) {
  $('#' + i).attr("name", images[i - 1]);
}

//Display image when question mark is clicked
$("span").click(function() {
  //Return previous guesses to question marks if they didn't match
  if (reset === 1 && matched === 0) {
    $('#' + id1).children("img").attr("src", "http://icons.iconarchive.com/icons/graphicloads/android-settings/64/question-icon.png");
    $('#' + id2).children("img").attr("src", "http://icons.iconarchive.com/icons/graphicloads/android-settings/64/question-icon.png");
    id1 = "";
    id2 = "";
    reset = 0;
    matched = 0;
  } else if (reset === 1 && matched === 1) {
    id1 = "";
    id2 = "";
    reset = 0;
    matched = 0;
  }

  imageName = $(this).attr("name");
  //if span has been not been matched
  if (imageName !== "matched") {
    //show span's image 
    $(this).children("img").attr("src", imageName);

    //if first spot is empty update first chosen element to include this span's id
    if (chosen[0] === "*") {
      chosen[0] = $(this).attr("id");

    }
    //if not check if second spot in chosen elements is empty 
    else if (chosen[1] === "*") {
      //update second chosen element to include this span's id
      chosen[1] = $(this).attr("id");

      //check if chosen elements images are the same and chosen elements ids are different
      if ($('#' + chosen[0]).attr("name") === $('#' + chosen[1]).attr("name") && chosen[0] !== chosen[1]) {
        $('#' + chosen[0]).attr("name", "matched");
        $('#' + chosen[1]).attr("name", "matched");
        resetDisplayFlags();
        matched = 1;
      } else {
        resetDisplayFlags();
        matched = 0;
      }
    }
    ++clickCount;
  }

  $("#countDisplay").text("Score = " + clickCount + " clicks");
})

function resetDisplayFlags() {
  setIdFlags();
  resetChosenElements();
  reset = 1;
}

function setIdFlags() {
  id1 = chosen[0];
  id2 = chosen[1];
}

function resetChosenElements() {
  chosen[0] = "*";
  chosen[1] = "*";
}

function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};
