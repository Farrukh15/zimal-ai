
import { onRequestPost } from "./functions/api/contact.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle contact form submissions
        if (url.pathname === "/api/contact") {
            if (request.method !== "POST") {
                return new Response("Method Not Allowed", {
                    status: 405,
                    headers: { "Allow": "POST" }
                });
            }

            return onRequestPost({ request, env });
        }

        // Serve existing website files normally
        return env.ASSETS.fetch(request);
    }
};
