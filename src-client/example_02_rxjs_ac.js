import $ from "jquery";
import Rx from "rxjs/Rx";

const $title = $("#title");
const $results = $("#results");

const keyUps$ = Rx.Observable.fromEvent($title,"keyup");
const queries$ = keyUps$
    .map(e => e.target.value)
    .distinctUntilChanged()
    .debounceTime(250)
    .switchMap(getItems)
    .subscribe(items => {
        $results.empty();
        $results.append(items.map(i => $("<li />").text(i)));
    });


// const keyUps$ = Rx.Observable.fromEvent($title,"keyup");
// const queries$ = keyUps$
//     .map(e => e.target.value)
//     .distinctUntilChanged()
//     .debounceTime(250)
//     .switchMap(getItems);

// //switchMap is an alias to flatMapLatest
// //MergeMap is an alias to flatMap or selectMany    

// queries$.subscribe(items => {

//     $results.empty();

//     const $items = items.map(item => $(`<li />`).text(item))
//     $results.append($items);
// });

//Library
function getItems(title){
    console.log(`Querying ${title}`);
    return new Promise((resolve,reject)=>{
        window.setTimeout(()=>{
            resolve([title,"Item 2", `Another ${Math.random()}`]);
        },500+(Math.random()*200));
    });
}