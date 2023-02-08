// Onclick of the button
document.querySelector("#randint").onclick = function () {
    var number = Math.floor(Math.random()*100);
    // Update the div with a random number
    document.querySelector(".random_number").innerHTML = number;
}
    