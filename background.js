
/*Note from Dylan: Some of the synchronicity here works a bit awkwardly. I'm working on fixing it, but it's working okay for now.*/
chrome.runtime.onInstalled.addListener(async function() {
    await chrome.storage.sync.clear();
    console.log("Clearing list")
    arr = []
    console.log(arr)
    await chrome.storage.sync.set({budget: 100}, function(){
      console.log('Budget initialized.');
    });
    await chrome.storage.sync.set({amountSpent: 0}, function(){
      console.log('Amount Spent initialized.');
    });
    await chrome.storage.sync.set({purchases: arr}, function() {
      console.log('Purchases array initialized.');
  }); //close initialization function
      //await addPurchaseToList(Purchase('Amazon', 50, 'Misc', 'Bought some things on Amazon'));
      printPurchases();
  }); //close onInstalled listener

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
    purchaseArray = result.purchases;
    purchaseArray.push(purchase);
    await chrome.storage.sync.set({purchases: purchaseArray}, function(){
      console.log("Purchase added.")
    }); //close set function
  }); //close get function
} //close addPurchaseToList()

/* This function is only for debugging, since the end user won't see the console. Prints out current purchase list. */
async function printPurchases(){
  console.log("Printing Purchases...")
  await chrome.storage.sync.get(['purchases'], function(result){
    console.log("Got purchases for printing.")
    for(purchase in result.purchases){
      console.log(purchase);
    }
  }); //close get function
} //close printPurchases()
