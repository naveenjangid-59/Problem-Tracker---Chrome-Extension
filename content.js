const bookmarkImgURL = chrome.runtime.getURL("assets/bookmark.png");
const bookmarkDoneImgURL = chrome.runtime.getURL("assets/save.png");

const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";

window.addEventListener("load",loadBookmarkImg);
const observer = new MutationObserver(()=>{
    loadBookmarkImg();
})

observer.observe(document.body, {childList : true , subtree : true});
loadBookmarkImg();

function onProblemsPage(){
    return window.location.pathname.startsWith("/problems/")
}

function loadBookmarkImg(){
    if(!onProblemsPage || document.getElementById("bookmark-Btn")) return;
    console.log("triggering")

    const bookmarkBtn = document.createElement("img");  // create button
    bookmarkBtn.id = "bookmark-Btn";
    bookmarkBtn.src = bookmarkImgURL;
    bookmarkBtn.style.height = "30px";
    bookmarkBtn.style.width = "30px";
    const problemNameBtn = document.getElementsByClassName("coding_problem_info_heading__G9ueL")[0];
    if(problemNameBtn && problemNameBtn.parentElement){
        problemNameBtn.parentElement.insertAdjacentElement("afterend",bookmarkBtn)  //add it to DOM
    
        // add event listner to bookmark image btn
        bookmarkBtn.addEventListener('click', ()=>{  // you can just do bookmarkBtn.addEventListener('click', addBookmarkHandler(isMarked,bookmarkbutton))       // why ? as this call back fn must be anonymous or reference must passed. 
            return addBookmarkHandler(bookmarkBtn)                     // [it's must either anonymous or reference]
        });
    }
}

function getUniqueId(url){
    const start = url.indexOf("problems/")+ "problems/".length;
    const end = url.indexOf("?",start);
    return end == -1 ? url.substring(start) : url.substring(start,end);
}

async function addBookmarkHandler(bookmarkBtn,isMarked){

        const bookMarkData = await getCurrentBookmarks();

        // we'll store three things about problem that is being bookmarked 1. URL 2. ID  3. Problem Name
        const url = window.location.href;
        const uniqueId = getUniqueId(url);
        const problemName = document.getElementsByClassName("coding_problem_info_heading__G9ueL")[0].textContent;

        if(bookMarkData.some((data)=>{ return data.id == uniqueId})) return;
        const obj = {
            "url" : url,
            "id" : uniqueId,
            "problemName" : problemName
        }
        

        const updatedData = [...bookMarkData,obj];
        chrome.storage.sync.set({AZ_PROBLEM_KEY : updatedData}, ()=>{
            console.log("updated bookmark data successfully" , updatedData)
        })
}



function getCurrentBookmarks(){
    return new Promise((resolve,reject) => {
        chrome.storage.sync.get([AZ_PROBLEM_KEY], (results)=>{
            resolve(results[AZ_PROBLEM_KEY] || []);
        })
    })  
}

