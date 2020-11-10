button  = document.getElementById('ph_button');
console.log("popup")
button.onclick = function(){
  console.log('Clicked!');
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
  if(!isNaN(cost)){
    await addPurchaseToList(Purchase(vendor, cost, category, description));
    message.innerHTML = "Purchase successfully added!"
    setTimeout(function(){
      message.innerHTML = ""
    } , 5000)
  }
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

/* Use this function to push an already created Purchase to the list in storage */
/* Future goal: Make this more efficient. */
async function addPurchaseToList(purchase){
  await chrome.storage.sync.get(['purchases'], async function(result){
    console.log("Got purchases data.");
    console.log(result)
    purchaseArray = result.purchases;
    purchaseArray.push(purchase);
    await chrome.storage.sync.set({purchases: purchaseArray}, function(){
      console.log("Purchase added.")
    }); //close set function
  }); //close get function
} //close addPurchaseToList()
