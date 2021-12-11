// let btnComment = document.getElementById("btnCommentModal");
// let commentModal = document.getElementById("commentModal");

// if(btnComment){
//     btnComment.onclick = function(){
//         commentModal.style.display = "block";
//     }
//     document.getElementById("commentContent").addEventListener("submit", (event)=>{
//         let comment = document.getElementById("commentText").value;
//         console.log(comment);
//         if(comment === undefined || comment.trim() === ""){
//             event.preventDefault();
//             if(document.getElementById("contentError")){
//                 return;
//             }else{
//                 $("#commentContent").append(`<br><p id="contentError"> Please input valid content.</p>`);
//                 return;
//             }
//         }
//     })
// }

// function closeModal(){
//     if(commentModal){
//         commentModal.style.display = "none";
//     }
//     if($("#contentError").html()){
//         $('#contentError').hide();
//     }
// }
let allAnswerId = "";

function openModal(answer) {
    let answerId = $(answer).attr('id');
    console.log(answerId);
    let commentModal = document.getElementById("commentModal" + answerId);
    allAnswerId = answerId;
    commentModal.style.display = "block";
    document.getElementById("commentContent" + answerId).addEventListener('submit', (event) => {
        let comment = document.getElementById("commentText" + answerId).value;
        console.log(comment);
        if (comment === undefined || comment.trim() === "") {
            event.preventDefault();
            if (document.getElementById("contentError"+answerId)) {
                return;
            } else {
                $("#commentContent"+answerId).append(`<br><p id="contentError${answerId}"> Please input valid content.</p>`);
                return;
            }
        }
    })
}

function closeModal(answer) {
    console.log(answer);
    document.getElementById("commentModal"+allAnswerId).style.display = "none";
    if($("#contentError"+allAnswerId).html()){
        $("#contentError"+allAnswerId).hide();
    }
}