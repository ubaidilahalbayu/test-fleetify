const BASE_URL = window.APP_CONFIG.API_BASE_URL + "/api";

async function apiFetch(endpoint, options = {}) {
    const headers = {
        "X-User-ID": AppState.currentUserId,
        ...(options.headers || {})
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(BASE_URL + endpoint,
        {
            ...options,
            headers
        }
    );

    return response.json();
}