function onPress() {
    var titleElement = document.getElementById("title");
    var descriptionElement = document.getElementById("description");

    var title = titleElement.value.trim();
    var description = descriptionElement.value.trim();

    if (!title || !description) {
        alert("Both title and description are required!");
        return;
    }

    fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
    })
        .then((res) => {
            if (res.status === 201) {
                titleElement.value = "";
                descriptionElement.value = "";
                getData();
            }
        })
        .catch((err) => console.error("Error adding todo:", err));
}

function todoCallback(data) {
    var parentElement = document.getElementById("todo-list");
    parentElement.innerHTML = "";

    data.forEach((todo) => {
        var childElement = document.createElement("div");
        childElement.className = "todo-item";
        childElement.dataset.id = todo.id;

        var titleSpan = document.createElement("span");
        titleSpan.textContent = todo.title;

        var descriptionSpan = document.createElement("span");
        descriptionSpan.textContent = todo.description;

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => onPressDelete(todo.id));

        childElement.append(titleSpan, descriptionSpan, deleteButton);
        parentElement.appendChild(childElement);
    });
}

function getDataCallback(resp) {
    resp.json().then(todoCallback);
}

function getData() {
    fetch("http://localhost:3000/todos", {
        method: "GET",
    })
        .then(getDataCallback)
        .catch((err) => console.error("Error fetching todos:", err));
}

function deleteDone(id) {
    var parentElement = document.getElementById("todo-list");
    var childElements = parentElement.getElementsByClassName("todo-item");

    Array.from(childElements).forEach((child) => {
        if (child.dataset.id == id) {
            parentElement.removeChild(child);
        }
    });
}

function onPressDelete(id) {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (res.status === 200) {
                getData();
            }
        })
        .catch((err) => console.error("Error deleting todo:", err));
}

// Initial data fetch
getData();
