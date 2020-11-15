field = document.getElementById("purchasesField");
percents=document.getElementById("percentages");
button = document.getElementById("refreshButton");
async function refresh(){

  await chrome.storage.sync.get(['purchases'], function(result){
    str = buildTable(result.purchases);
    field.innerHTML = str;
    percents.innerHTML = calculatePercentages(result.purchases);
  });
}
refresh();
button.onclick = refresh;

budgetMessage = document.getElementById('budget_message');
budgetSubmitButton = document.getElementById('budget_submit');
budgetSubmitButton.onclick = async function(){
  form = document.getElementById("change_budget");
  budgetStr = form.elements[0].value;
  budget = parseFloat(budgetStr);
  if(!isNaN(budget) && budget >= 0){
    await chrome.storage.sync.set({budget: budget}, function(){
      budgetMessage.innerHTML = "New budget set successfully!"
      setTimeout(function(){
        budgetMessage.innerHTML = ""
      } , 5000)
    });
  } else {
    budgetMessage.innerHTML = "Error: Invalid Budget. Try again."
    setTimeout(function(){
      budgetMessage.innerHTML = ""
    } , 5000)
  }
};

function calculatePercentages(purchases){
  if(purchases.length == 0) return "Make a purchase to see data here.";
  totalSpent = 0;
  categories = {};
  for(i=0;i<purchases.length;i++){
    purchase = purchases[i];
    if(!(purchase.category in categories)){
      categories[purchase.category] = purchase.cost;
    } else {
      //purchase is in category
      categories[purchase.category]+=purchase.cost;
    } //close if purchase in category
    totalSpent+=purchase.cost;
  } //close for all purchases
  str = "You spent ";
  keys = Object.keys(categories);
  if(keys.length == 1) return "You spent 100% on "+keys[0]+".";
  for(i=0;i<keys.length;i++){
    proportion = categories[keys[i]]/totalSpent;
    percent = Math.round(proportion*100);
    if(i != keys.length-1) str+=(percent+"% on "+keys[i]+", ");
    else str+=("and "+percent+"% on "+keys[i]+".");
  }
  return str;
}

//TODO: Display data in a table rather than in a list
function buildTable(purchases){
  finalStr = "<tr>\n<th>Vendor</th><th>Cost</th><th>Category</th><th>Description</th></tr>";
  for(i=0;i<purchases.length;i++){
    purchase = purchases[i];
    newline = "<tr>";
    newline += "<td>";
    newline += purchase.vendor;
    newline += "</td>\n";
    //Newline:   vendor__________(fixed length)
    newline += "<td>$";
    newline += purchase.cost.toFixed(2);
    newline += "</td>";
    // Vendor___________$XX.XX___________
    newline += "<td>";
    newline += purchase.category;
    newline += "</td>";
    // Vendor__________$XX.XX_________Category___________
    newline+="<td>";
    newline+=purchase.description;
    newline+="</td>\n</tr>";
    finalStr+=newline;
  } //close for purchase in purchases
  return finalStr;
}

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
