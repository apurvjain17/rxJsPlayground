import Rx from "rxjs/Rx";

// const promise = new Promise((resolve,reject) => {
//     console.log("In Promise");
//     resolve("hey");
// });
//Promises are not lazy
//Observers are lazy
//observable is just a generator method that accepts an observeable
//and sets next 
// const simple$ = new Rx.Observable(observer => {
//     console.log("Generating Observable");
//     setTimeout(() => {
//         observer.next("An Item"); 
//         setTimeout(()=>{
//             observer.next("Another item!");
//             observer.complete();
//         },1000);
//     },1000);
// });

// const error$ = new Rx.Observable(observer =>{
//     observer.error(new Error("Whoa!"));
// })
// //subscriptions cause side-effects

// error$.subscribe(
//     item => console.log(`one.next ${item}`), //next
//     err => console.log(`one.error${err.stack}`), //error
//     () => console.log("one complete") //complete
// )
// simple$.subscribe(
//     item => console.log(`one.next ${item}`), //next
//     err => console.log(`one.error${err}`), //error
//     () => console.log("one complete") //complete
// )
// setTimeout(()=>{
//     simple$.subscribe({
//         next: item => console.log(`two.next ${item}`),
//         error(error){console.log(`two.error ${error}`);},
//         complete: function(){
//             console.log("two.complete");
//         }

//     })
// },3000)

function createSubscriber(tag){
    return {
        next(item) {console.log(`${tag}.next${item}`);},
        error(error) {console.log(`${tag}.error ${error.stack||error}`);},
        complete() {console.log(`${tag}.complete`);}
    }
}
//An observable is nothing more than a generator function that is invoked everytime it gets subscribed to
function createInterval$(time){
    return new Rx.Observable(observer => {
        let index = 0;
        let interval = setInterval(()=>{
            console.log(`generating index ${index}`);
            observer.next(index++);
        }, time);
        //observers can clean up when they're unsubscribed to
        return () =>{
            clearInterval(interval);
        };
    });
}
//creating my own custom operator,
//take the source observable and return a new observable
//perform some operation to it and execute it

//Operators are nothing more than just wrappers around observables
function take$(sourceObservable$, amount){
    return new Rx.Observable(observer => {
        let count = 0;
        const subscription = sourceObservable$.subscribe({
            //here we can implement a map, a skip or a filter or anything
            next(item){
                observer.next(item);
                if(++count >= amount)
                    observer.complete();
            },
            error(error){ observer.error(error);},
            complete(){observer.complete()}
        });
        return () => subscription.unsubscribe();
    });
}

const everySecond$ = createInterval$(1000);
const firstFiveSeconds$ = take$(everySecond$,5);
const subscription = firstFiveSeconds$.take(10).subscribe(createSubscriber("one")); 
//A subscription is nothing more than just a  next method a complete method and an error method that gets subscribed
// setTimeout(()=>{
//     subscription.unsubscribe();
// },4500);