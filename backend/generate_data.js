const fs = require('fs');


let data = {}
data.products = []
for (let i = 0; i < 1000; i++) {
    let obj = {name: `Machine ${i + 1}`, company: `Company ${Math.floor(Math.random() * (5 - 1 + 1) + 1)}`}
    data.products.push(obj)
}

fs.writeFile("data.json", JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('complete');
    }
);
