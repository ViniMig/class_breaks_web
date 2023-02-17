eel.expose(createBtns);
function createBtns(names, breaks, break_times, member_id){
    //get container
    var container = document.getElementsByClassName("container")[0];
    var entryDiv = document.createElement("div");
    
    entryDiv.classList.add("entry");
    entryDiv.innerHTML = "<button class='in-class' id='"+ member_id +"' onclick=countTime(this.id)>" + names + "</button>\n<span>" + breaks + "</span>\n<span>" + break_times + "</span>";
    container.appendChild(entryDiv);
}

// Get the modal
var modal = document.getElementById("addPersonModal");

// Get the button that opens the modal
var btn = document.getElementById("addMember");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 

//Get button that adds student to classroom
var btnAddStd = document.getElementById("add-to-classroom");
var container = document.getElementsByClassName("container")[0];

btnAddStd.onclick = function(){
    var new_name = document.getElementById("new-member-input");
    var entryDiv = document.createElement("div");

    //validation
    if (new_name.value == "") {
        alert("Name cannot be empty");
        return false;
    }
    //Add information to classroom model, call Python function
    eel.add_new_member(new_name.value);

    //TODO only execute this part if student was created in the model.
    //test if student exists already

    //Append new entry to container
    entryDiv.classList.add("entry");
    entryDiv.innerHTML = "<button class='in-class'>" + new_name.value + "</button>\n<span>0</span>\n<span>0s</span>";
    container.appendChild(entryDiv);
    new_name.value = "";
}

function countTime(btnID){
    var currentBtn = document.getElementById(btnID);
    var currentClass = currentBtn.className;
    var btID = parseInt(btnID) - 1; //list in python is 0 index

    if (currentClass == "in-class"){
        currentBtn.className = "on-break";
        eel.start_clock(btID);
    } else {
        currentBtn.className = "in-class";
        eel.stop_clock(btID);
    }
}

eel.expose(updateInfoBreaks);
function updateInfoBreaks(member_id, new_breaks, new_break_times){
    //get elements
    var breakSpan = document.getElementById(member_id).nextElementSibling;
    var timeSpan = breakSpan.nextElementSibling;

    breakSpan.textContent = new_breaks;
    timeSpan.textContent = new_break_times;
}