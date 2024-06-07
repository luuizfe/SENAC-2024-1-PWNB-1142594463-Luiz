document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("newCommentForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const comment = document.getElementById("comment").value;

        const newComment = document.createElement("div");
        newComment.classList.add("tweet");

        const content = document.createElement("p");
        content.classList.add("tweet-content");
        content.textContent = comment;

        const info = document.createElement("div");
        info.classList.add("tweet-info");
        info.innerHTML = `<span>Por: <strong>@${username}</strong></span><span>Data: <strong>${getCurrentDate()}</strong></span>`;

        newComment.appendChild(content);
        newComment.appendChild(info);

        const commentsSection = document.querySelector(".section-title");
        commentsSection.parentNode.insertBefore(newComment, commentsSection.nextSibling);

        form.reset();
    });
});

function getCurrentDate() {
    const date = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("pt-BR", options);
}