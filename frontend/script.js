const API_URL = "http://localhost:5000/api/events";

const eventsContainer = document.getElementById("eventsContainer");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const locationFilter = document.getElementById("locationFilter");
const filterButton = document.getElementById("filterButton");

const eventForm = document.getElementById("eventForm");


// =========================
// Edit Modal Elements
// =========================

const editModal =
    document.getElementById("editModal");

const editForm =
    document.getElementById("editForm");

const closeModal =
    document.getElementById("closeModal");

const cancelEdit =
    document.getElementById("cancelEdit");

let currentEditId = null;


// =========================
// Registration Modal Elements
// =========================

const registrationModal =
    document.getElementById("registrationModal");

const registrationForm =
    document.getElementById("registrationForm");

const closeRegistrationModal =
    document.getElementById("closeRegistrationModal");

const cancelRegistration =
    document.getElementById("cancelRegistration");

let currentRegistrationEventId = null;


// =========================
// View Registrations Modal
// =========================

const registrationsListModal =
    document.getElementById("registrationsListModal");

const registrationsList =
    document.getElementById("registrationsList");

const closeRegistrationsList =
    document.getElementById("closeRegistrationsList");


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

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to fetch events"
            );
        }

        const events =
            await response.json();

        await displayEvents(events);

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

const displayEvents = async (events) => {

    if (events.length === 0) {

        eventsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No events found</h3>
                <p>
                    Try changing your search or filters.
                </p>
            </div>
        `;

        return;
    }


    // Get registration count for every event
    const registrationCounts = {};


    await Promise.all(

        events.map(async (event) => {

            try {

                const response =
                    await fetch(
                        `http://localhost:5000/api/registrations/${event._id}`
                    );


                if (response.ok) {

                    const registrations =
                        await response.json();

                    registrationCounts[event._id] =
                        registrations.length;

                } else {

                    registrationCounts[event._id] =
                        0;
                }

            } catch (error) {

                console.error(
                    "Failed to get registration count:",
                    error
                );

                registrationCounts[event._id] =
                    0;
            }
        })
    );


    eventsContainer.innerHTML = events.map(event => {

        const eventDate =
            new Date(event.date);


        const formattedDate =
            eventDate.toLocaleDateString(
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

                    <p>
                        👥 ${registrationCounts[event._id] || 0}
                        Registered
                    </p>

                </div>


                <div class="event-actions">

                    <button
                        class="register-button"
                        onclick="openRegistrationModal('${event._id}')"
                    >
                        Register
                    </button>


                    <button
                        class="view-registrations-button"
                        onclick="viewRegistrations('${event._id}')"
                    >
                        View Registrations
                    </button>


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

        const search =
            searchInput.value.trim();

        const category =
            categoryFilter.value;

        const location =
            locationFilter.value.trim();

        const params =
            new URLSearchParams();


        if (search) {

            params.append(
                "search",
                search
            );
        }


        if (category) {

            params.append(
                "category",
                category
            );
        }


        if (location) {

            params.append(
                "location",
                location
            );
        }


        const url =
            params.toString()
                ? `${API_URL}?${params.toString()}`
                : API_URL;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Failed to filter events"
            );
        }


        const events =
            await response.json();


        await displayEvents(events);


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

    const confirmed =
        confirm(
            "Are you sure you want to delete this event?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete event"
            );
        }


        await loadEvents();


        alert(
            "Event deleted successfully"
        );


    } catch (error) {

        console.error(error);


        alert(
            "Failed to delete event"
        );
    }
};


// =========================
// Open Edit Event Modal
// =========================

const editEvent = async (id) => {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch event"
            );
        }


        const event =
            await response.json();


        currentEditId =
            id;


        document.getElementById(
            "editTitle"
        ).value =
            event.title;


        document.getElementById(
            "editDescription"
        ).value =
            event.description;


        document.getElementById(
            "editDate"
        ).value =
            event.date.split("T")[0];


        document.getElementById(
            "editTime"
        ).value =
            event.time;


        document.getElementById(
            "editLocation"
        ).value =
            event.location;


        document.getElementById(
            "editCategory"
        ).value =
            event.category;


        document.getElementById(
            "editOrganizer"
        ).value =
            event.organizer;


        editModal.classList.add(
            "active"
        );


    } catch (error) {

        console.error(error);


        alert(
            "Failed to load event details"
        );
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
                document.getElementById(
                    "editTitle"
                ).value.trim(),

            description:
                document.getElementById(
                    "editDescription"
                ).value.trim(),

            date:
                document.getElementById(
                    "editDate"
                ).value,

            time:
                document.getElementById(
                    "editTime"
                ).value.trim(),

            location:
                document.getElementById(
                    "editLocation"
                ).value.trim(),

            category:
                document.getElementById(
                    "editCategory"
                ).value.trim(),

            organizer:
                document.getElementById(
                    "editOrganizer"
                ).value.trim()
        };


        try {

            const response =
                await fetch(
                    `${API_URL}/${currentEditId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedEvent
                            )
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to update event"
                );
            }


            await response.json();


            editModal.classList.remove(
                "active"
            );


            currentEditId =
                null;


            await loadEvents();


            alert(
                "Event updated successfully"
            );


        } catch (error) {

            console.error(error);


            alert(
                "Failed to update event"
            );
        }
    }
);


// =========================
// Close Edit Modal
// =========================

const closeEditModal = () => {

    editModal.classList.remove(
        "active"
    );


    currentEditId =
        null;
};


closeModal.addEventListener(
    "click",
    closeEditModal
);


cancelEdit.addEventListener(
    "click",
    closeEditModal
);


editModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();
        }
    }
);


// =========================
// Open Registration Modal
// =========================

const openRegistrationModal = (
    eventId
) => {

    currentRegistrationEventId =
        eventId;


    registrationForm.reset();


    registrationModal.classList.add(
        "active"
    );
};


// =========================
// Register for Event
// =========================

registrationForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (
            !currentRegistrationEventId
        ) {
            return;
        }


        const name =
            document.getElementById(
                "registrationName"
            ).value.trim();


        const email =
            document.getElementById(
                "registrationEmail"
            ).value.trim();


        const registrationData = {

            eventId:
                currentRegistrationEventId,

            name:
                name,

            email:
                email
        };


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/registrations",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                registrationData
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Registration failed"
                );
            }


            registrationModal.classList.remove(
                "active"
            );


            currentRegistrationEventId =
                null;


            registrationForm.reset();


            await loadEvents();


            alert(
                "Registration successful!"
            );


        } catch (error) {

            console.error(error);


            alert(
                error.message
            );
        }
    }
);


// =========================
// Close Registration Modal
// =========================

const closeRegistration = () => {

    registrationModal.classList.remove(
        "active"
    );


    currentRegistrationEventId =
        null;


    registrationForm.reset();
};


closeRegistrationModal.addEventListener(
    "click",
    closeRegistration
);


cancelRegistration.addEventListener(
    "click",
    closeRegistration
);


registrationModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            registrationModal
        ) {

            closeRegistration();
        }
    }
);


// =========================
// View Event Registrations
// =========================

const viewRegistrations = async (
    eventId
) => {

    registrationsListModal.classList.add(
        "active"
    );


    registrationsList.innerHTML = `
        <div class="loading">
            Loading registrations...
        </div>
    `;


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/registrations/${eventId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch registrations"
            );
        }


        const registrations =
            await response.json();


        if (registrations.length === 0) {

            registrationsList.innerHTML = `
                <div class="no-registrations">

                    <h3>
                        No registrations yet
                    </h3>

                    <p>
                        Be the first person
                        to register for this event.
                    </p>

                </div>
            `;

            return;
        }


        registrationsList.innerHTML = `
            <div class="registration-list">

                ${registrations.map(
                    (registration, index) => `

                    <div class="registration-item">

                        <div class="registration-details">

                            <h4>
                                ${registration.name}
                            </h4>

                            <p>
                                ${registration.email}
                            </p>

                        </div>


                        <div class="registration-actions">

                            <div class="registration-number">
                                ${index + 1}
                            </div>


                            <button
                                class="delete-registration-button"
                                onclick="deleteRegistration('${registration._id}', '${eventId}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `
                ).join("")}

            </div>
        `;


    } catch (error) {

        console.error(error);


        registrationsList.innerHTML = `
            <div class="no-registrations">

                <h3>
                    Failed to load registrations
                </h3>

                <p>
                    Please try again.
                </p>

            </div>
        `;
    }
};


// =========================
// Delete Registration
// =========================

const deleteRegistration = async (
    registrationId,
    eventId
) => {

    const confirmed =
        confirm(
            "Are you sure you want to delete this registration?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/registrations/${registrationId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete registration"
            );
        }


        alert(
            "Registration deleted successfully"
        );


        // Refresh the registration list
        await viewRegistrations(
            eventId
        );


        // Refresh registration count
        await loadEvents();


    } catch (error) {

        console.error(error);


        alert(
            error.message
        );
    }
};


// =========================
// Close Registrations Modal
// =========================

const closeRegistrationsModal = () => {

    registrationsListModal.classList.remove(
        "active"
    );
};


closeRegistrationsList.addEventListener(
    "click",
    closeRegistrationsModal
);


registrationsListModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            registrationsListModal
        ) {

            closeRegistrationsModal();
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
                document.getElementById(
                    "title"
                ).value.trim(),

            description:
                document.getElementById(
                    "description"
                ).value.trim(),

            date:
                document.getElementById(
                    "date"
                ).value,

            time:
                document.getElementById(
                    "time"
                ).value.trim(),

            location:
                document.getElementById(
                    "location"
                ).value.trim(),

            category:
                document.getElementById(
                    "category"
                ).value.trim(),

            organizer:
                document.getElementById(
                    "organizer"
                ).value.trim()
        };


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                eventData
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to create event"
                );
            }


            eventForm.reset();


            await loadEvents();


            alert(
                "Event created successfully"
            );


        } catch (error) {

            console.error(error);


            alert(
                error.message ||
                "Failed to create event"
            );
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