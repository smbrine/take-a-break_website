var buttonContainer = document.getElementById("button-container");
var leftGroup = document.getElementById("left-part");
var rightGroup = document.getElementById("right-part");

function fetchData(callback) {
    if (localStorage.getItem("outcomesDataset")) {
        // Fetch data from localStorage if it exists
        var outcomesDataset = JSON.parse(localStorage.getItem("outcomesDataset"));
        callback(outcomesDataset);
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/resources/outcomes", true);
        xhr.responseType = "json";
        xhr.onload = function() {
            if (xhr.status === 200) {
                localStorage.setItem("outcomesDataset", JSON.stringify(xhr.response));
                callback(xhr.response);
            }
        };
        xhr.send();
    }
}

function base64UrlEncode(str) {
  var base64 = btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  return base64;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function updateInfoText(text) {
    var infoElements = document.querySelectorAll("h1.info");
    infoElements.forEach(function(element) {
        element.innerText = text;
    });
}

function createButton(label, clickHandler, className) {
    var button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", clickHandler);
    button.className = 'button-' + className;
    return button;
}

function initializePage(outcomesDataset) {
    index1 = 0;
    updateInfoText('ВЫБЕРИ СВОЙ ПРОДУКТ');
    for (var label in outcomesDataset) {
      var button = createButton(label, function(event) {
        leftGroup.innerHTML = '';
        rightGroup.innerHTML = '';
        var clickedLabel = event.target.textContent;
        index2 = 0
        updateInfoText('ВЫБЕРИ СТИЛЬ')
        for (var label2 in outcomesDataset[clickedLabel]) {
          var button2 = createButton(label2, function(event) {
            leftGroup.innerHTML = '';
            rightGroup.innerHTML = '';
            var clickedLabel2 = event.target.textContent;
            var notChoice = getRandomInt(3);
            index3 = 0
            updateInfoText('ВЫБЕРИ СЛОГАН')
            for (var label3 in outcomesDataset[clickedLabel][clickedLabel2][notChoice]) {
              var button3 = createButton(label3, function(event) {
                buttonContainer.innerHTML = '';
                var clickedLabel3 = event.target.textContent;
                index4 = 0
                updateInfoText('ВЫБЕРИ ТЕКСТ')
                for (var label4 in outcomesDataset[clickedLabel][clickedLabel2][notChoice][clickedLabel3]) {
                  var button4 = createButton(label4, function(event) {
                    var clickedLabel4 = event.target.textContent;
  
                    var picPath = outcomesDataset[clickedLabel][clickedLabel2][notChoice][clickedLabel3][clickedLabel4];
                    poster_path = base64UrlEncode(picPath)
                    window.location.href = `/poster/${poster_path}`
                    
                  }, index4);
  
                  index4++
                  if (index4 === 1 || index4 === 3) {
                    leftGroup.appendChild(button4)
                  } else {
                    rightGroup.appendChild(button4)
                  }
                  buttonContainer.appendChild(button4);
                }
                if (index4 === 2) {
                  buttonContainer.classList.remove('four-buttons')
                  buttonContainer.classList.add('two-buttons')
                } else {
                  buttonContainer.classList.remove('two-buttons')
                  buttonContainer.classList.add('four-buttons')
                }
              }, index3);
              index3++
              // button3.classList.add("button3");
              if (index3 === 1 || index3 === 3) {
                leftGroup.appendChild(button3)
              } else {
                rightGroup.appendChild(button3)
              }
              // buttonContainer.appendChild(button3);
            }
            if (index3 === 2) {
              buttonContainer.classList.remove('four-buttons')
              buttonContainer.classList.add('two-buttons')
            } else {
              buttonContainer.classList.remove('two-buttons')
              buttonContainer.classList.add('four-buttons')
            }
          }, index2);
          index2++
          if (index2 === 1 || index2 === 3) {
            leftGroup.appendChild(button2)
          } else {
            rightGroup.appendChild(button2)
          }
          // buttonContainer.appendChild(button2);
        }
        if (index2 === 2) {
          buttonContainer.classList.remove('four-buttons')
          buttonContainer.classList.add('two-buttons')
        } else {
          buttonContainer.classList.remove('two-buttons')
          buttonContainer.classList.add('four-buttons')
        }
      }, index1);
      index1++;
      if (index1 === 1 || index1 === 3) {
        leftGroup.appendChild(button)
      } else {
        rightGroup.appendChild(button)
      }
    }
    if (index1 === 2) {
        buttonContainer.classList.remove('four-buttons');
        buttonContainer.classList.add('two-buttons');
    } else {
        buttonContainer.classList.remove('two-buttons');
        buttonContainer.classList.add('four-buttons');
    }
}

window.addEventListener('popstate', function() {
  console.log('popstated!')
    fetchData(initializePage);
});

// Initiate the process on page load
fetchData(initializePage);
