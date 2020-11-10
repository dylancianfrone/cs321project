field = document.getElementById("purchasesField");
button = document.getElementById("refreshButton")
async function refresh(){

  await chrome.storage.sync.get(['purchases'], function(result){
    str = buildString(result.purchases);
    field.innerHTML = str;
  });
}
refresh();
button.onclick = refresh;

//TODO: Display data in a table rather than in a list

/*This is a very simple way to display data. Used as a placeholder right now.*/
function buildString(purchases){
  console.log("Inside builder");

  finalStr = ""
  for(i=0;i<purchases.length;i++){
    purchase = purchases[i];
    console.log(purchase)
    newline = "";
    newline += purchase.vendor;
    sectionChars = 30;
    while(newline.length<sectionChars){
      newline += "_";
    }
    //Newline:   vendor__________(fixed length)
    newline += "$"
    newline += purchase.cost.toFixed(2);
    while(newline.length<sectionChars*2){ //Don't need to use variables because cost will always be same length
      newline += "_";
    }
    // Vendor___________$XX.XX___________
    newline += purchase.category;
    while(newline.length<sectionChars*3){
      newline+="_";
    }
    // Vendor__________$XX.XX_________Category___________
    newline+=purchase.description;
    newline+="<br>";
    finalStr+=newline;

  } //close for purchase in purchases
  return finalStr;
}
