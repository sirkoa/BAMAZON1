var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  buyStuff();
});





function buyStuff() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, products) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    var productname = []
    for (var i = 0; i < products.length; i++) {
      productname.push(products[i].product_name)}
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: productname,
          message: "What product do you want to buy?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How much would you like to buy?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem = {};
        console.log(products.length);
        for (var i = 0; i < products.length; i++) {
          if (products[i].product_name === answer.choice) {
            console.log(products[i])
            chosenItem = products[i];
          }

        }
        if (parseInt(answer.quantity) <= chosenItem.stock_quantity && chosenItem.stock_quantity > 0){
          var newQuantity = chosenItem.stock_quantity - parseInt(answer.quantity);
          console.log(chosenItem.item_id)
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newQuantity
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("product purchased successfully!");
              
            }
          );

        }
        });
  });
}