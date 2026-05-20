const BASE_URL = "http://localhost:8080/api";

async function apiFetch(endpoint, options = {}) {

    const response = await fetch(BASE_URL + endpoint, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "X-User-ID": AppState.currentUserId,
            ...(options.headers || {})
        }
    });

    return response.json();
}