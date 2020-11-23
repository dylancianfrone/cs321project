button  = document.getElementById('ph_button');
console.log("popup")
button.onclick = function(){
  chrome.tabs.create({url: chrome.extension.getURL("index.html")});
}

message = document.getElementById('message')

formSubmitButton = document.getElementById('formSubmit');
formSubmitButton.onclick = async function(){
  form = document.getElementById("new_purchase");
  vendor = form.elements[0].value;
  cost = form.elements[1].value;
  category = form.elements[2].value;
  description = form.elements[3].value;
  cost = parseFloat(cost);
  if(vendor == "__testing__"){
    purchases = [];
    purchases.push(Purchase("Amazon", 10.00, "Electronics", "Phone Charger"));
    purchases.push(Purchase("Giant", 15.00, "Food", "Groceries"));
    purchases.push(Purchase("Doordash", 20.00, "Food", "Sushi"));
    purchases.push(Purchase("Grubhub", 10.00, "Food", "Dunkin Donuts"));
    purchases.push(Purchase("Target", 17.00, "Clothing", "Tee Shirt"));
    purchases.push(Purchase("PetSmart", 7.00, "Pets", "Cat Food"));
    console.log(purchases);
    addPurchaseArrayToList(purchases);
  } else {
  if(!isNaN(cost)){
    await addPurchaseToList(Purchase(vendor, cost, category, description));
    message.innerHTML = "Purchase successfully added!"
    setTimeout(function(){
      message.innerHTML = ""
    } , 5000)
  } //close ifNan(cost)
}
} //close submitButton function

budgetMessage = document.getElementById('budget');
remainingBudgetMessage = document.getElementById('remaining_budget');
chrome.storage.sync.get(['budget'], async function(result){
    setBudget = result.budget;
    msg = "$"+result.budget.toFixed(2);
    budgetMessage.innerHTML = msg;
    await chrome.storage.sync.get(['amountSpent'], function(result){
      remainingMsg = "$"+Math.abs((setBudget-result.amountSpent)).toFixed(2);
      if(setBudget-result.amountSpent < 0) remainingMsg = '-'+remainingMsg;
      remainingBudgetMessage.innerHTML = remainingMsg;
    })
})

chrome.storage.onChanged.addListener(async function(changes, namespace){
  console.log(changes);
  for(var key in changes){
    change = changes[key]
    if(key == 'budget'){
      budgetMessage.innerHTML = "$"+change.newValue.toFixed(2);
      await chrome.storage.sync.get(['amountSpent'], function(result){
        remaining = change.newValue-result.amountSpent;
        remainingBudgetMessage.innerHTML = "$"+remaining.toFixed(2);
      });
    } else if (key == 'purchases'){
      console.log('updated purchases')
      newArray = change.newValue;
      newestPurchase = newArray[newArray.length-1];
    } else if (key == 'amountSpent'){
      await chrome.storage.sync.get(['budget'], function(result){
        remaining = result.budget-change.newValue;
        message = "$"+(Math.abs(remaining)).toFixed(2);
        if(remaining <0) message = "-"+message;
        remainingBudgetMessage.innerHTML = message;
      });
    }
  }
});

async function updateRemainingBudget(cost){
  console.log("Updating budget")
  await chrome.storage.sync.get(['amountSpent'], async function(result){
    newTotal = result.amountSpent+cost;
    console.log(newTotal)
    await chrome.storage.sync.set({amountSpent: newTotal}, function(){
      console.log("Updated amount spent.");
    });
  });
}

/*These are the exact same as the ones in the background.js script.*/
/*Future goal : have these in their own file and just have each script pull from them.*/
/* Use this function to create a Purchase data structure, which can then be added to storage. */
function Purchase(vendor, cost, category, description){
    purchase = {};
    purchase.vendor = vendor;
    purchase.cost = cost;
    purchase.category = category;
    purchase.description = description;
    return purchase;
}

async function addPurchaseArrayToList(purchases){
  await chrome.storage.sync.get(['purchases'], async function(result){
    console.log("Got purchases data.");
    console.log(result)
    cost = 0;
    purchaseArray = result.purchases;
    for(i=0;i<purchases.length;i++){
      purchaseArray.push(purchases[i]);
      cost+=purchases[i].cost;
    }
    updateRemainingBudget(cost);
    await chrome.storage.sync.set({purchases: purchaseArray}, function(){
      console.log("Purchase added.")
    }); //close set function
  }); //close get function
} //close addPurchaseToList()

/* Use this function to push an already created Purchase to the list in storage */
/* Future goal: Make this more efficient. */
async function addPurchaseToList(purchase){
  await chrome.storage.sync.get(['purchases'], async function(result){
    console.log("Got purchases data.");
    console.log(result)
    purchaseArray = result.purchases;
    purchaseArray.push(purchase);
    updateRemainingBudget(purchase.cost);
    await chrome.storage.sync.set({purchases: purchaseArray}, function(){
      console.log("Purchase added.")
    }); //close set function
  }); //close get function
} //close addPurchaseToList()
