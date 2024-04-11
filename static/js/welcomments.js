(function() {
    function p() {
        y.value = "";
        t.placeholder = N;
        O.appendChild(n);
        const a = document.getElementsByClassName(x);
        for (let b = 0; b < a.length; b++) {
            const c = a[b];
            "true" === c.getAttribute("data-is-replying") && (c.setAttribute("data-is-replying", "false"),
            c.innerText = c.getAttribute("data-original-inner-text").trim())
        }
    }

    function X(event) {
        event.preventDefault();
        alert("Comments will be subjected for approval."); // Alert prompt added
        const formData = new FormData(n);
        const requestData = {};
        formData.forEach((value, key) => {
            requestData[key] = value;
        });
        const request = new XMLHttpRequest();
        request.open("POST", n.action);
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Accept", "application/json");
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 300) {
                    //alert("Comment submitted successfully!"); // Alert the user
                    p(); // Clear the form
                    G(JSON.parse(request.responseText).comment); // Process the response
                } else {
                    console.error("Failed to submit comment:", request.statusText);
                }
            }
        };
        request.send(JSON.stringify(requestData));
    }

    const n = document.getElementById("welcomments__form");

    if (!n || n.nodeName.toUpperCase() !== "FORM") {
        throw Error(`No <form> element with id ${L} found.`);
    }

    n.addEventListener("submit", X);
})();
