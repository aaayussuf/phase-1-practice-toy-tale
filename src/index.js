// Wait for the DOM to load before executing the script
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyFormContainer = document.querySelector(".container");
  const newToyForm = document.querySelector("form.add-toy-form");
  const addToyButton = document.querySelector("#new-toy-btn");

  // Toggle the toy form visibility
  addToyButton.addEventListener("click", () => {
    toyFormContainer.style.display = toyFormContainer.style.display === "block" ? "none" : "block";
  });

  // Fetch and render toys when the page loads
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach(renderToy);
    });

  // Render a single toy card
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.classList.add("card");

    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="toy-${toy.id}">Like ❤️</button>
    `;

    // Add event listener for the like button
    const likeButton = toyCard.querySelector(".like-btn");
    likeButton.addEventListener("click", () => increaseLikes(toy, toyCard));

    toyCollection.appendChild(toyCard);
  }

  // Handle new toy form submission
  newToyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        renderToy(toy); // Add the new toy to the DOM
        newToyForm.reset(); // Clear the form
      });
  });

  // Handle likes increment
  function increaseLikes(toy, toyCard) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        toy.likes = updatedToy.likes; // Update local toy object
        toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`; // Update DOM
      });
  }
});
