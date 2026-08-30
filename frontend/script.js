const API_URL = "http://localhost:5000/api/events";

const eventsContainer = document.getElementById("eventsContainer");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const locationFilter = document.getElementById("locationFilter");
const filterButton = document.getElementById("filterButton");

const eventForm = document.getElementById("eventForm");

// Edit modal elements
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");

const closeModal = document.getElementById("closeModal");
const cancelEdit = document.getElementById("cancelEdit");

let currentEditId = null;


// =========================
// Fetch and Display Events
// =========================

const loadEvents = async () => {

    try {

        eventsContainer.innerHTML = `
            <div class="loading">
                Loading events...
            </div>
        `;

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }

        const events = await response.json();

        displayEvents(events);

    } catch (error) {

        console.error(error);

        eventsContainer.innerHTML = `
            <div class="error-state">
                Failed to load events. Please try again.
            </div>
        `;
    }
};


// =========================
// Display Events
// =========================

const displayEvents = (events) => {

    if (events.length === 0) {

        eventsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No events found</h3>
                <p>Try changing your search or filters.</p>
            </div>
        `;

        return;
    }


    eventsContainer.innerHTML = events.map(event => {

        const eventDate = new Date(event.date);

        const formattedDate = eventDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );


        return `
            <div class="event-card">

                <span class="event-category">
                    ${event.category}
                </span>

                <h3>
                    ${event.title}
                </h3>

                <p>
                    ${event.description}
                </p>


                <div class="event-info">

                    <p>
                        📅 ${formattedDate}
                    </p>

                    <p>
                        🕐 ${event.time}
                    </p>

                    <p>
                        📍 ${event.location}
                    </p>

                    <p>
                        👤 ${event.organizer}
                    </p>

                </div>


                <div class="event-actions">

                    <button
                        class="edit-button"
                        onclick="editEvent('${event._id}')"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-button"
                        onclick="deleteEvent('${event._id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

    }).join("");
};


// =========================
// Search and Filter Events
// =========================

const filterEvents = async () => {

    try {

        const search = searchInput.value.trim();

        const category = categoryFilter.value;

        const location = locationFilter.value.trim();


        const params = new URLSearchParams();


        if (search) {
            params.append("search", search);
        }


        if (category) {
            params.append("category", category);
        }


        if (location) {
            params.append("location", location);
        }


        const url = params.toString()
            ? `${API_URL}?${params.toString()}`
            : API_URL;


        const response = await fetch(url);


        if (!response.ok) {
            throw new Error("Failed to filter events");
        }


        const events = await response.json();


        displayEvents(events);


    } catch (error) {

        console.error(error);


        eventsContainer.innerHTML = `
            <div class="error-state">
                Failed to filter events.
            </div>
        `;
    }
};


// =========================
// Delete Event
// =========================

const deleteEvent = async (id) => {

    const confirmed = confirm(
        "Are you sure you want to delete this event?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error("Failed to delete event");
        }


        await loadEvents();


        alert("Event deleted successfully");


    } catch (error) {

        console.error(error);


        alert("Failed to delete event");
    }
};


// =========================
// Open Edit Event Modal
// =========================

const editEvent = async (id) => {

    try {

        const response = await fetch(
            `${API_URL}/${id}`
        );


        if (!response.ok) {
            throw new Error("Failed to fetch event");
        }


        const event = await response.json();


        // Store current event ID
        currentEditId = id;


        // Fill edit form with existing values

        document.getElementById("editTitle").value =
            event.title;


        document.getElementById("editDescription").value =
            event.description;


        document.getElementById("editDate").value =
            event.date.split("T")[0];


        document.getElementById("editTime").value =
            event.time;


        document.getElementById("editLocation").value =
            event.location;


        document.getElementById("editCategory").value =
            event.category;


        document.getElementById("editOrganizer").value =
            event.organizer;


        // Open modal
        editModal.classList.add("active");


    } catch (error) {

        console.error(error);

        alert("Failed to load event details");
    }
};


// =========================
// Save Edited Event
// =========================

editForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentEditId) {
            return;
        }


        const updatedEvent = {

            title:
                document.getElementById("editTitle").value.trim(),

            description:
                document.getElementById("editDescription").value.trim(),

            date:
                document.getElementById("editDate").value,

            time:
                document.getElementById("editTime").value.trim(),

            location:
                document.getElementById("editLocation").value.trim(),

            category:
                document.getElementById("editCategory").value.trim(),

            organizer:
                document.getElementById("editOrganizer").value.trim()
        };


        try {

            const response = await fetch(
                `${API_URL}/${currentEditId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(updatedEvent)
                }
            );


            if (!response.ok) {
                throw new Error("Failed to update event");
            }


            await response.json();


            // Close modal
            editModal.classList.remove("active");


            // Reset current ID
            currentEditId = null;


            // Refresh events
            await loadEvents();


            alert("Event updated successfully");


        } catch (error) {

            console.error(error);


            alert("Failed to update event");
        }
    }
);


// =========================
// Close Edit Modal
// =========================

const closeEditModal = () => {

    editModal.classList.remove("active");

    currentEditId = null;
};


// Close button
closeModal.addEventListener(
    "click",
    closeEditModal
);


// Cancel button
cancelEdit.addEventListener(
    "click",
    closeEditModal
);


// Close when clicking outside modal
editModal.addEventListener(
    "click",
    (event) => {

        if (event.target === editModal) {
            closeEditModal();
        }
    }
);


// =========================
// Add New Event
// =========================

eventForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const eventData = {

            title:
                document.getElementById("title").value.trim(),

            description:
                document.getElementById("description").value.trim(),

            date:
                document.getElementById("date").value,

            time:
                document.getElementById("time").value.trim(),

            location:
                document.getElementById("location").value.trim(),

            category:
                document.getElementById("category").value.trim(),

            organizer:
                document.getElementById("organizer").value.trim()
        };


        try {

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(eventData)
                }
            );


            if (!response.ok) {
                throw new Error("Failed to create event");
            }


            await response.json();


            // Clear form
            eventForm.reset();


            // Reload events
            await loadEvents();


            alert("Event created successfully");


        } catch (error) {

            console.error(error);


            alert("Failed to create event");
        }
    }
);


// =========================
// Filter Button
// =========================

filterButton.addEventListener(
    "click",
    filterEvents
);


// =========================
// Load Events on Page Load
// =========================

loadEvents();