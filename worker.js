export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Only POST method allowed", {
        status: 405,
        headers: { "Content-Type": "text/plain" }
      });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/x-www-form-urlencoded")) {
      return new Response("Content-Type must be application/x-www-form-urlencoded", {
        status: 400
      });
    }

    const formData = await request.text(); // ex: url=https://vt.tiktok.com/xxx

    try {
      const response = await fetch("https://tikwm.com/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });

      const data = await response.json();

      if (data.code !== 0 || !data.data?.play) {
        throw new Error("Invalid Tikwm response");
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        code: 0,
        data: {
          title: "Backup Video by Nextime",
          play: "https://www.w3schools.com/html/mov_bbb.mp4",
          cover: "https://via.placeholder.com/400x300?text=Backup+Video",
          images: null
        },
        fallback: true,
        message: "Gagal ambil dari Tikwm. Kasih dummy backup."
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
  }
}
