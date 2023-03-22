if(localStorage.getItem('textValues') == null){
    var listArr = [{
        "title": "Teams",
        "items": [{
            "title": "Product",
            "desc": "3 pending tasks to be picked by raj",
        }, {
            "title": "Sales",
            "desc": "send proposal to puneet for sale prices",
        }]
    }, {
        "title": "Products",
        "items": [{
            "title": "VAT Testing",
            "desc": "ask engg to set up testing infra",
        }]
    }];
}else{
    listArr = JSON.parse(localStorage.getItem('textValues'));
}

function renderList() {
    localStorage.setItem('textValues', JSON.stringify(listArr));
    let list = document.getElementById('boardlists1');
    list.innerHTML = "";
    listArr.forEach((item, index) => {
        let div = document.createElement("div");
        div.innerText = item.title;
        div.id = `list${index}`
        div.className = "board-list"
        div.ondrop = function(event){
            dropIt(event)
        }
        div.ondragover = function(event){
            allowDrop(event)
        }
        div.innerHTML = `
        <div class="list-title">${item.title} <span id="list${index}" class="close" onclick=deleteList(${index})>\u00D7</span></div>
        `
        function renderCards() {
            item.items?.forEach((card, i) => {
                let innerDiv = document.createElement("div");
                innerDiv.innerText = card.title + card.desc;
                innerDiv.id = `card${i}`;
                innerDiv.className = "card";
                innerDiv.draggable = true;
                innerDiv.ondragstart = function(event){
                    dragStart(event)
                }
                innerDiv.innerHTML = `
                ${card.title} ${card.desc} <span id="list${index}-card${i}" class="close" onclick="deleteCard(${index}, ${i})">\u00D7</span>
                `

                div.appendChild(innerDiv);
            })
        }
        renderCards();

        let cardButton = document.createElement("div");
        cardButton.innerHTML = `
            <div class="add-card">
            <input class="inputBox" type="text" id="myTitle-${index}" placeholder="Title...">
            <input class="inputBox" type="text" id="myDesc-${index}" placeholder="Desc...">
            <button onclick="addCard(${index})">Add Card</button>
            </div>
        `
        div.appendChild(cardButton);

        list.appendChild(div);
    })
}

renderList();

function addCard(index){
    listArr[index]['items'].push()
    var inputValue1 = document.getElementById(`myTitle-${index}`).value;
    var inputValue2 = document.getElementById(`myDesc-${index}`).value;
    if (inputValue1 === '' || inputValue2 == '') {
        alert("Please enter Card title and Description");
    } else {
        listArr[index]['items'].push({
            "title": inputValue1,
            "desc": inputValue2
        })
        renderList()
    }
}

function deleteCard(index, i){
    listArr[index]['items'].splice(i, 1)
    renderList();
    
}

function deleteList(index){
    listArr.splice(index,1)
    renderList();
}

function newElement(){
    var inputValue = document.getElementById("myInput").value;
    if (inputValue === '') {
        alert("Please enter List title");
    } else {
        listArr.push({
            "title": document.getElementById("myInput").value,
            "items": []
        })
        renderList()
    }
    console.log(listArr)
}

function allowDrop(ev) {
  ev.preventDefault(); // default is not to allow drop
}
function dragStart(ev) {
  // The 'text/plain' is referring the Data Type (DOMString)
  // of the Object being dragged.
  // ev.target.id is the id of the Object being dragged
  ev.dataTransfer.setData("text/plain", ev.target.id);
}
function dropIt(ev) {
  ev.preventDefault(); // default is not to allow drop
  let sourceId = ev.dataTransfer.getData("text/plain");
  let sourceIdEl = document.getElementById(sourceId);
  let sourceIdParentEl = sourceIdEl.parentElement;
  // ev.target.id here is the id of target Object of the drop
  let targetEl = document.getElementById(ev.target.id);
  let targetParentEl = targetEl.parentElement;
  console.log(sourceIdEl, sourceIdParentEl, targetEl, targetParentEl)
  // Compare List names to see if we are going between lists
  // or within the same list
  if (targetParentEl.id !== sourceIdParentEl.id) {
    // If the source and destination have the same
    // className (card), then we risk dropping a Card in to a Card
    // That may be a cool feature, but not for us!
    if (targetEl.className === sourceIdEl.className) {
      // Append to parent Object (list), not to a
      // Card in the list
      // This is in case you drag and drop a Card on top
      // of a Card in a different list
      targetParentEl.appendChild(sourceIdEl);
      console.log("first if", sourceIdEl, sourceIdParentEl, targetEl, targetParentEl)
    } else { 
      // Append to the list
        // targetEl.appendChild(sourceIdEl);

      var x = listArr[sourceIdParentEl.id.split('list')[1]]['items'].splice(sourceIdEl.id.split('card')[1],1)  
      listArr[targetEl.id.split('list')[1]]['items'].unshift(x[0])
      renderList();
    }
  } 
}
