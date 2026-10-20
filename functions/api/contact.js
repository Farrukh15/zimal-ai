
/**
 * Zimal AI - Contact Form API
 * Cloudflare Pages Functions
 * Endpoint: POST /api/contact
 */

const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store"
        }
    });
};

export async function onRequestPost({ request, env }) {

    // Make webhook is stored securely in Cloudflare
    const webhookURL = env.MAKE_WEBHOOK_URL;

    if (!webhookURL) {
        return jsonResponse({
            success: false,
            message: "Contact service is not configured."
        }, 503);
    }

    // Accept standard HTML form submissions
    const contentType = request.headers.get("content-type") || "";

    if (
        !contentType.includes("multipart/form-data") &&
        !contentType.includes("application/x-www-form-urlencoded")
    ) {
        return jsonResponse({
            success: false,
            message: "Unsupported form submission."
        }, 415);
    }

    const contentLength = Number(
        request.headers.get("content-length") || 0
    );

    if (contentLength > 20000) {
        return jsonResponse({
            success: false,
            message: "Submission is too large."
        }, 413);
    }

    try {
        const form = await request.formData();

        const getValue = (key) => {
            const value = form.get(key);
            return typeof value === "string" ? value.trim() : "";
        };

        const name = getValue("name");
        const email = getValue("email");
        const project = getValue("project");
        const budget = getValue("budget");

        // Basic spam trap
        if (getValue("website")) {
            return jsonResponse({ success: true });
        }

        // Server-side validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const allowedBudgets = [
            "",
            "under-1k",
            "1k-3k",
            "3k-5k",
            "5k+",
            "unsure"
        ];


        if (
            !name ||
            name.length > 120 ||
            !emailPattern.test(email) ||
            email.length > 254 ||
            !project ||
            project.length > 5000 ||
            !allowedBudgets.includes(budget)
        ) {
            return jsonResponse({
                success: false,
                message: "Please check your form information."
            }, 400);
        }

        // Data sent to the Make.com custom webhook
        const lead = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            name,
            email,
            project,
            budget,
            source: "zimalai.net"
        };

        const makeResponse = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lead)
        });

        if (!makeResponse.ok) {
            throw new Error("Make webhook rejected submission");
        }

        // Require Make to confirm Google Sheets was updated
        const result = await makeResponse.json().catch(() => null);

        if (!result || result.success !== true) {
            throw new Error("Make did not confirm saving the lead");
        }

        return jsonResponse({
            success: true,
            message: "Your consultation request has been received."
        });

    } catch (error) {
        console.error("Contact form error:", error);

        return jsonResponse({
            success: false,
            message: "Unable to submit your request. Please try again."
        }, 502);
    }
}
