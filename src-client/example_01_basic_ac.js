import $ from "jquery";
// browserify located the $ module from node_modules/jquery
const $title = $("#title");
const $results = $("#results");

let lastQuery = null;
let lastTimeout = null;
let nextQueryId = 0;
$title.on("keyup", e=>{
    const title = e.target.value;
    if(title == lastQuery){
        return; 
    }
    else{
        lastQuery = title
    }
    if(lastTimeout)
        window.clearTimeout(lastTimeout);
    
    let ourQueryId = ++nextQueryId;
    lastTimeout = window.setTimeout(()=>{
        console.log(title);
        getItems(title)
            .then(items => {
                console.log(items);
                if(ourQueryId!=nextQueryId)
                    return;
                $results.empty();

                const $items = items.map(item => $(`<li />`).text(item))
                $results.append($items);
            });
    },500);
});
//since all the queries will take different time since the promise will resolve at a different time
//therefore the result wont always be for the key we pressed last but based on the promise thaat we've resolved last
//--------------------------
// Library
function getItems(title){
    console.log(`Querying ${title}`);
    return new Promise((resolve,reject)=>{
        window.setTimeout(()=>{
            resolve([title,"Item 2", `Another ${Math.random()}`]);
        },500+(Math.random()*200));
    });
}